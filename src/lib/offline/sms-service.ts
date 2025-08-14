import { createSupabaseAdminClient } from '@/lib/supabase/client';

export interface SMSBookingRequest {
  phoneNumber: string;
  serviceType: string;
  location: string;
  preferredTime?: string;
  urgency: 'low' | 'medium' | 'high';
  message: string;
}

export interface SMSNotification {
  to: string;
  message: string;
  type: 'booking_confirmation' | 'reminder' | 'status_update' | 'payment_request';
  bookingId?: string;
  metadata?: Record<string, any>;
}

export interface QRBookingData {
  providerId: string;
  serviceId?: string;
  quickBookingCode: string;
  validUntil: string;
  pricing: {
    basePrice: number;
    currency: string;
  };
}

export class OfflineCommerceService {
  private supabase = createSupabaseAdminClient();
  private twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  private twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  private twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  constructor() {
    if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioPhoneNumber) {
      console.warn('Twilio credentials not configured. SMS features will be disabled.');
    }
  }

  /**
   * Process incoming SMS booking requests
   */
  async processSMSBooking(request: SMSBookingRequest): Promise<{
    success: boolean;
    bookingId?: string;
    confirmationCode?: string;
    estimatedResponse: string;
  }> {
    try {
      // Parse and extract booking details using AI
      const bookingDetails = await this.parseBookingFromSMS(request);
      
      // Find matching providers
      const providers = await this.findProvidersForSMS(bookingDetails);
      
      if (providers.length === 0) {
        await this.sendSMS(request.phoneNumber, 
          "Sorry, no providers available for your request. Please try our website at loconomy.com or call our support line."
        );
        return {
          success: false,
          estimatedResponse: "No providers available"
        };
      }

      // Create a provisional booking
      const bookingId = await this.createSMSBooking(bookingDetails, providers[0]);
      const confirmationCode = this.generateConfirmationCode();

      // Send confirmation SMS
      const confirmationMessage = `Booking confirmed! Code: ${confirmationCode}. Provider will contact you within 30 minutes. Track at: loconomy.com/track/${bookingId}`;
      await this.sendSMS(request.phoneNumber, confirmationMessage);

      // Notify the provider
      await this.notifyProviderOfSMSBooking(providers[0], bookingDetails, confirmationCode);

      return {
        success: true,
        bookingId,
        confirmationCode,
        estimatedResponse: "Provider will contact within 30 minutes"
      };
    } catch (error) {
      console.error('Error processing SMS booking:', error);
      await this.sendSMS(request.phoneNumber, 
        "Sorry, there was an error processing your request. Please visit loconomy.com or call support."
      );
      return {
        success: false,
        estimatedResponse: "Error occurred"
      };
    }
  }

  /**
   * Generate QR code for quick booking
   */
  async generateQRBooking(providerId: string, serviceId?: string): Promise<{
    qrCode: string;
    bookingUrl: string;
    validUntil: string;
  }> {
    try {
      const quickBookingCode = this.generateQuickCode();
      const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      // Get provider and service info
      const { data: provider } = await this.supabase
        .from('providers')
        .select(`
          *,
          users!inner(display_name, city, state),
          services(*)
        `)
        .eq('user_id', providerId)
        .single();

      if (!provider) {
        throw new Error('Provider not found');
      }

      const service = serviceId 
        ? provider.services?.find((s: any) => s.id === serviceId)
        : provider.services?.[0];

      // Create QR booking entry
      const qrData: QRBookingData = {
        providerId,
        serviceId: service?.id,
        quickBookingCode,
        validUntil,
        pricing: {
          basePrice: service?.price || 0,
          currency: 'USD'
        }
      };

      // Store QR booking data
      await this.supabase
        .from('analytics_events')
        .insert({
          user_id: providerId,
          event_name: 'qr_code_generated',
          event_properties: qrData,
          created_at: new Date().toISOString()
        });

      const bookingUrl = `${process.env.NEXT_PUBLIC_URL}/quick-book/${quickBookingCode}`;
      const qrCodeData = await this.generateQRCodeImage(bookingUrl);

      return {
        qrCode: qrCodeData,
        bookingUrl,
        validUntil
      };
    } catch (error) {
      console.error('Error generating QR booking:', error);
      throw new Error('Failed to generate QR booking');
    }
  }

  /**
   * Process QR code booking
   */
  async processQRBooking(quickBookingCode: string, customerData: {
    name: string;
    phone: string;
    email: string;
    preferredTime: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    bookingId?: string;
    providerInfo?: any;
    estimatedCost?: number;
  }> {
    try {
      // Find the QR booking data
      const { data: qrEvent } = await this.supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'qr_code_generated')
        .contains('event_properties', { quickBookingCode })
        .single();

      if (!qrEvent) {
        throw new Error('Invalid or expired QR code');
      }

      const qrData = qrEvent.event_properties as QRBookingData;
      
      // Check if still valid
      if (new Date() > new Date(qrData.validUntil)) {
        throw new Error('QR code has expired');
      }

      // Get provider information
      const { data: provider } = await this.supabase
        .from('providers')
        .select(`
          *,
          users!inner(display_name, phone, email),
          services(*)
        `)
        .eq('user_id', qrData.providerId)
        .single();

      if (!provider) {
        throw new Error('Provider not found');
      }

      // Create a guest customer if needed
      let customerId = await this.findOrCreateGuestCustomer(customerData);

      // Create the booking
      const bookingId = await this.createQuickBooking({
        customerId,
        providerId: qrData.providerId,
        serviceId: qrData.serviceId,
        customerData,
        pricing: qrData.pricing
      });

      // Send confirmation SMS
      await this.sendSMS(customerData.phone, 
        `Booking confirmed with ${provider.users.display_name}! They'll contact you shortly. Booking ID: ${bookingId.slice(-6)}`
      );

      // Notify provider
      await this.sendSMS(provider.users.phone || '', 
        `New QR booking from ${customerData.name} (${customerData.phone}). Preferred time: ${customerData.preferredTime}. View: loconomy.com/bookings/${bookingId}`
      );

      return {
        success: true,
        bookingId,
        providerInfo: {
          name: provider.users.display_name,
          rating: provider.rating_average,
          responseTime: provider.response_time_minutes
        },
        estimatedCost: qrData.pricing.basePrice
      };
    } catch (error) {
      console.error('Error processing QR booking:', error);
      throw error;
    }
  }

  /**
   * Send SMS notifications
   */
  async sendSMSNotification(notification: SMSNotification): Promise<{ success: boolean; messageId?: string }> {
    if (!this.twilioAccountSid || !this.twilioAuthToken) {
      console.log('SMS would be sent:', notification);
      return { success: true, messageId: 'mock-message-id' };
    }

    try {
      // In a real implementation, you would use Twilio or another SMS service
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.twilioAccountSid}:${this.twilioAuthToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: notification.to,
          From: this.twilioPhoneNumber!,
          Body: notification.message
        })
      });

      const result = await response.json();
      
      // Log the SMS for audit trail
      await this.logSMSEvent(notification, result.sid);

      return {
        success: response.ok,
        messageId: result.sid
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false };
    }
  }

  /**
   * Create PWA manifest and service worker
   */
  generatePWAConfig(): {
    manifest: any;
    serviceWorkerScript: string;
  } {
    const manifest = {
      name: "Loconomy - Local Services",
      short_name: "Loconomy",
      description: "AI-powered local services marketplace",
      start_url: "/",
      display: "standalone",
      background_color: "#0A091A",
      theme_color: "#8A2BE2",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        }
      ],
      categories: ["business", "productivity"],
      shortcuts: [
        {
          name: "Book Service",
          short_name: "Book",
          description: "Quickly book a service",
          url: "/browse",
          icons: [{ src: "/shortcut-book.png", sizes: "96x96" }]
        },
        {
          name: "My Bookings",
          short_name: "Bookings",
          description: "View your bookings",
          url: "/my-bookings",
          icons: [{ src: "/shortcut-bookings.png", sizes: "96x96" }]
        }
      ],
      screenshots: [
        {
          src: "/screenshot-mobile.png",
          sizes: "390x844",
          type: "image/png",
          form_factor: "narrow"
        },
        {
          src: "/screenshot-desktop.png",
          sizes: "1280x720",
          type: "image/png",
          form_factor: "wide"
        }
      ]
    };

    const serviceWorkerScript = `
const CACHE_NAME = 'loconomy-v1';
const urlsToCache = [
  '/',
  '/browse',
  '/my-bookings',
  '/offline',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Loconomy',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'View Details',
        icon: '/action-view.png'},
      {action: 'close', title: 'Close',
        icon: '/action-close.png'},
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Loconomy', options)
  );
});

async function doBackgroundSync() {
  try {
    // Sync offline data when connection is restored
    const response = await fetch('/api/sync-offline-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: Date.now() })
    });
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
`;

    return { manifest, serviceWorkerScript };
  }

  // Private helper methods
  private async parseBookingFromSMS(request: SMSBookingRequest) {
    // In a real implementation, this would use NLP/AI to parse the SMS
    return {
      serviceType: request.serviceType,
      location: request.location,
      phoneNumber: request.phoneNumber,
      preferredTime: request.preferredTime,
      urgency: request.urgency,
      parsedMessage: request.message
    };
  }

  private async findProvidersForSMS(bookingDetails: any) {
    const { data: providers } = await this.supabase
      .from('providers')
      .select(`
        *,
        users!inner(phone, city, state),
        services!inner(*)
      `)
      .eq('is_active', true)
      .limit(3);

    return providers || [];
  }

  private async createSMSBooking(bookingDetails: any, provider: any): Promise<string> {
    const bookingId = `sms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data } = await this.supabase
      .from('bookings')
      .insert({
        id: bookingId,
        customer_id: null, // Guest booking
        provider_id: provider.id,
        status: 'pending',
        scheduled_start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        pricing: { base_price: 0, total: 0, sms_booking: true },
        customer_notes: bookingDetails.parsedMessage,
        metadata: {
          source: 'sms',
          customer_phone: bookingDetails.phoneNumber,
          urgency: bookingDetails.urgency
        }
      })
      .select()
      .single();

    return bookingId;
  }

  private async notifyProviderOfSMSBooking(provider: any, bookingDetails: any, confirmationCode: string) {
    if (provider.users?.phone) {
      await this.sendSMS(provider.users.phone, 
        `New SMS booking! Customer: ${bookingDetails.phoneNumber}. Service: ${bookingDetails.serviceType}. Code: ${confirmationCode}. Respond within 30 mins.`
      );
    }
  }

  private generateConfirmationCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private generateQuickCode(): string {
    return `QR${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  private async generateQRCodeImage(data: string): Promise<string> {
    // In a real implementation, use a QR code library like 'qrcode'
    // For now, return a data URL or reference to QR code service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  }

  private async findOrCreateGuestCustomer(customerData: any): Promise<string> {
    // Check if customer exists by phone/email
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .or(`phone.eq.${customerData.phone},email.eq.${customerData.email}`)
      .single();

    if (existingUser) {
      return existingUser.id;
    }

    // Create guest customer
    const { data: newUser } = await this.supabase
      .from('users')
      .insert({
        email: customerData.email,
        display_name: customerData.name,
        phone: customerData.phone,
        role: 'customer',
        metadata: { source: 'qr_booking', guest: true }
      })
      .select()
      .single();

    return newUser.id;
  }

  private async createQuickBooking(data: any): Promise<string> {
    const { data: booking } = await this.supabase
      .from('bookings')
      .insert({
        customer_id: data.customerId,
        provider_id: data.providerId,
        service_id: data.serviceId,
        status: 'pending',
        scheduled_start: new Date(data.customerData.preferredTime).toISOString(),
        pricing: data.pricing,
        customer_notes: data.customerData.notes,
        metadata: {
          source: 'qr_code',
          quick_booking: true
        }
      })
      .select()
      .single();

    return booking.id;
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    await this.sendSMSNotification({
      to: phoneNumber,
      message,
      type: 'booking_confirmation'
    });
  }

  private async logSMSEvent(notification: SMSNotification, messageId?: string): Promise<void> {
    try {
      await this.supabase
        .from('analytics_events')
        .insert({
          event_name: 'sms_sent',
          event_properties: {
            to: notification.to,
            type: notification.type,
            message_id: messageId,
            booking_id: notification.bookingId
          },
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging SMS event:', error);
    }
  }
}

// Singleton instance
export const offlineCommerce = new OfflineCommerceService();
