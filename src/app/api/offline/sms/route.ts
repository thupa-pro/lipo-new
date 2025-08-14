import { NextRequest, NextResponse } from 'next/server';
import { offlineCommerce } from '@/lib/offline/sms-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'process_sms_booking':
        const { phoneNumber, serviceType, location, preferredTime, urgency, message } = body;
        
        if (!phoneNumber || !serviceType || !message) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        const bookingResult = await offlineCommerce.processSMSBooking({
          phoneNumber,
          serviceType,
          location: location || 'Not specified',
          preferredTime,
          urgency: urgency || 'medium',
          message
        });

        return NextResponse.json(bookingResult);

      case 'send_notification':
        const { to, message: notificationMessage, type, bookingId, metadata } = body;
        
        if (!to || !notificationMessage || !type) {
          return NextResponse.json(
            { error: 'Missing notification fields' },
            { status: 400 }
          );
        }

        const notificationResult = await offlineCommerce.sendSMSNotification({
          to,
          message: notificationMessage,
          type,
          bookingId,
          metadata
        });

        return NextResponse.json(notificationResult);

      case 'generate_qr':
        const { providerId, serviceId } = body;
        
        if (!providerId) {
          return NextResponse.json(
            { error: 'Provider ID required' },
            { status: 400 }
          );
        }

        const qrResult = await offlineCommerce.generateQRBooking(providerId, serviceId);
        return NextResponse.json(qrResult);

      case 'process_qr_booking':
        const { quickBookingCode, customerData } = body;
        
        if (!quickBookingCode || !customerData) {
          return NextResponse.json(
            { error: 'Missing QR booking data' },
            { status: 400 }
          );
        }

        const qrBookingResult = await offlineCommerce.processQRBooking(quickBookingCode, customerData);
        return NextResponse.json(qrBookingResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Offline SMS API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle incoming SMS webhooks (from Twilio)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('From');
    const body = searchParams.get('Body');
    
    if (!from || !body) {
      return NextResponse.json({ error: 'Missing SMS data' }, { status: 400 });
    }

    // Parse the SMS message and create a booking request
    const result = await offlineCommerce.processSMSBooking({
      phoneNumber: from,
      serviceType: 'General Service', // Would be parsed from body
      location: 'To be determined',
      message: body,
      urgency: 'medium'
    });

    // Respond with TwiML for Twilio
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thanks for your message! We're processing your service request and will get back to you shortly.</Message>
</Response>`;

    return new NextResponse(twimlResponse, {
      headers: { 'Content-Type': 'text/xml' }
    });
  } catch (error) {
    console.error('SMS webhook error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
