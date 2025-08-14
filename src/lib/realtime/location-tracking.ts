"use client";

import { geolocationService, LocationData } from '../location/geolocation-service';

export interface RealTimeSession {
  id: string;
  userId: string;
  type: 'customer' | 'provider';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  serviceId?: string;
  startTime: Date;
  endTime?: Date;
  tracking: {
    enabled: boolean;
    precision: 'high' | 'medium' | 'low';
    interval: number; // milliseconds
    shareLevel: 'exact' | 'approximate' | 'area_only';
  };
  privacy: {
    shareWithProvider: boolean;
    shareWithCustomer: boolean;
    shareWithSupport: boolean;
    anonymize: boolean;
  };
}

export interface LocationUpdate {
  sessionId: string;
  location: LocationData;
  timestamp: Date;
  accuracy: number;
  heading?: number;
  speed?: number;
  altitude?: number;
  battery?: number;
  networkType?: string;
}

export interface ServiceMatch {
  id: string;
  providerId: string;
  customerId: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  estimatedArrival: Date;
  actualArrival?: Date;
  route?: LocationData[];
  distance: number;
  duration: number;
  realTimeUpdates: LocationUpdate[];
}

export interface GeofenceEvent {
  id: string;
  type: 'enter' | 'exit' | 'dwell';
  location: LocationData;
  radius: number;
  userId: string;
  sessionId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

class RealTimeLocationService {
  private static instance: RealTimeLocationService;
  private activeSessions: Map<string, RealTimeSession> = new Map();
  private locationUpdateCallbacks: Map<string, ((update: LocationUpdate) => void)[]> = new Map();
  private geofences: Map<string, { location: LocationData; radius: number; callback: (event: GeofenceEvent) => void }> = new Map();
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  static getInstance(): RealTimeLocationService {
    if (!RealTimeLocationService.instance) {
      RealTimeLocationService.instance = new RealTimeLocationService();
    }
    return RealTimeLocationService.instance;
  }

  // Initialize real-time tracking session
  async startTrackingSession(
    userId: string,
    type: 'customer' | 'provider',
    config: {
      precision?: 'high' | 'medium' | 'low';
      shareLevel?: 'exact' | 'approximate' | 'area_only';
      privacy?: Partial<RealTimeSession['privacy']>;
      serviceId?: string;
    } = {}
  ): Promise<string> {
    const sessionId = this.generateSessionId();
    
    const session: RealTimeSession = {
      id: sessionId,
      userId,
      type,
      status: 'active',
      serviceId: config.serviceId,
      startTime: new Date(),
      tracking: {
        enabled: true,
        precision: config.precision || 'medium',
        interval: this.getTrackingInterval(config.precision || 'medium'),
        shareLevel: config.shareLevel || 'approximate'
      },
      privacy: {
        shareWithProvider: true,
        shareWithCustomer: true,
        shareWithSupport: false,
        anonymize: false,
        ...config.privacy
      }
    };

    this.activeSessions.set(sessionId, session);
    
    // Initialize WebSocket connection for real-time updates
    await this.initializeWebSocket();
    
    // Start location watching
    const watchId = geolocationService.watchLocation((location) => {
      this.handleLocationUpdate(sessionId, location);
    });

    // Store watch ID for cleanup
    (session as any).watchId = watchId;

    // Notify server about new session
    this.sendMessage({
      type: 'session_start',
      sessionId,
      userId,
      config: session
    });

    return sessionId;
  }

  // Stop tracking session
  async stopTrackingSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.status = 'completed';
    session.endTime = new Date();

    // Stop location watching
    if ((session as any).watchId) {
      geolocationService.stopWatching((session as any).watchId);
    }

    // Notify server
    this.sendMessage({
      type: 'session_end',
      sessionId,
      endTime: session.endTime
    });

    this.activeSessions.delete(sessionId);
  }

  // Real-time service matching with location awareness
  async findNearbyServices(
    sessionId: string,
    filters: {
      category?: string;
      radius?: number;
      maxProviders?: number;
      sortBy?: 'distance' | 'rating' | 'availability' | 'price';
      urgency?: 'low' | 'medium' | 'high' | 'emergency';
    } = {}
  ): Promise<ServiceMatch[]> {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const currentLocation = await geolocationService.getCurrentLocation();
    const {
      category,
      radius = 10,
      maxProviders = 5,
      sortBy = 'distance',
      urgency = 'medium'
    } = filters;

    // Get nearby providers in real-time
    const nearbyProviders = await this.queryNearbyProviders(
      currentLocation,
      radius,
      category,
      urgency
    );

    // Create service matches with real-time data
    const matches = await Promise.all(
      nearbyProviders.slice(0, maxProviders).map(async (provider) => {
        const match = await this.createServiceMatch(session, provider, currentLocation);
        return match;
      })
    );

    // Sort matches based on criteria
    return this.sortServiceMatches(matches, sortBy);
  }

  // Track service provider in real-time (like Uber driver tracking)
  async trackServiceProvider(
    matchId: string,
    customerId: string
  ): Promise<{
    subscribe: (callback: (update: LocationUpdate) => void) => void;
    unsubscribe: () => void;
    getCurrentLocation: () => Promise<LocationData | null>;
    getETA: () => Promise<number | null>;
    getRoute: () => Promise<LocationData[] | null>;
  }> {
    const callbacks: ((update: LocationUpdate) => void)[] = [];

    return {
      subscribe: (callback) => {
        callbacks.push(callback);
        if (!this.locationUpdateCallbacks.has(matchId)) {
          this.locationUpdateCallbacks.set(matchId, []);
        }
        this.locationUpdateCallbacks.get(matchId)!.push(callback);
      },
      
      unsubscribe: () => {
        const matchCallbacks = this.locationUpdateCallbacks.get(matchId);
        if (matchCallbacks) {
          callbacks.forEach(cb => {
            const index = matchCallbacks.indexOf(cb);
            if (index > -1) matchCallbacks.splice(index, 1);
          });
        }
      },
      
      getCurrentLocation: async () => {
        return this.getProviderCurrentLocation(matchId);
      },
      
      getETA: async () => {
        return this.calculateProviderETA(matchId, customerId);
      },
      
      getRoute: async () => {
        return this.getProviderRoute(matchId);
      }
    };
  }

  // Geofencing for location-based triggers
  createGeofence(
    id: string,
    location: LocationData,
    radius: number,
    callback: (event: GeofenceEvent) => void
  ): void {
    this.geofences.set(id, { location, radius, callback });
  }

  removeGeofence(id: string): void {
    this.geofences.delete(id);
  }

  // Smart ETA calculation with real-time traffic
  async calculateSmartETA(
    fromLocation: LocationData,
    toLocation: LocationData,
    transportMode: 'driving' | 'walking' | 'transit' = 'driving'
  ): Promise<{
    duration: number; // minutes
    distance: number; // km
    route: LocationData[];
    trafficLevel: 'low' | 'medium' | 'high';
    alternativeRoutes: Array<{
      duration: number;
      distance: number;
      description: string;
    }>;
  }> {
    // Use multiple routing services for accuracy
    const routes = await Promise.allSettled([
      this.getGoogleMapsRoute(fromLocation, toLocation, transportMode),
      this.getMapboxRoute(fromLocation, toLocation, transportMode),
      this.getOpenRouteServiceRoute(fromLocation, toLocation, transportMode)
    ]);

    // Select best route based on real-time conditions
    const validRoutes = routes
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<any>).value);

    if (validRoutes.length === 0) {
      throw new Error('No routes found');
    }

    const bestRoute = this.selectBestRoute(validRoutes);
    const trafficLevel = await this.analyzeTrafficLevel(bestRoute.route);

    return {
      ...bestRoute,
      trafficLevel,
      alternativeRoutes: validRoutes.slice(1, 4).map(route => ({
        duration: route.duration,
        distance: route.distance,
        description: route.description || 'Alternative route'
      }))
    };
  }

  // Location-based service recommendations
  async getLocationBasedRecommendations(
    location: LocationData,
    userPreferences: {
      categories: string[];
      priceRange: [number, number];
      timeOfDay: string;
    }
  ): Promise<Array<{
    type: 'service' | 'provider' | 'offer';
    title: string;
    description: string;
    location: LocationData;
    distance: number;
    relevanceScore: number;
    data: any;
  }>> {
    const recommendations = [];
    const currentTime = new Date();
    const timeOfDay = this.getTimeOfDay(currentTime);

    // Context-aware recommendations based on location and time
    const contextualServices = await this.getContextualServices(location, timeOfDay);
    
    // Popular services in the area
    const popularServices = await this.getPopularServicesInArea(location, 2); // 2km radius
    
    // Trending services based on real-time data
    const trendingServices = await this.getTrendingServices(location);

    // Combine and score recommendations
    const allRecommendations = [
      ...contextualServices,
      ...popularServices,
      ...trendingServices
    ];

    return allRecommendations
      .map(rec => ({
        ...rec,
        relevanceScore: this.calculateRelevanceScore(rec, userPreferences, location)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  }

  // Privacy-aware location sharing
  async shareLocation(
    sessionId: string,
    recipientId: string,
    shareLevel: 'exact' | 'approximate' | 'area_only',
    duration: number = 3600000 // 1 hour default
  ): Promise<{
    shareId: string;
    expiresAt: Date;
    shareUrl: string;
  }> {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const shareId = this.generateShareId();
    const expiresAt = new Date(Date.now() + duration);
    
    const shareData = {
      sessionId,
      recipientId,
      shareLevel,
      expiresAt,
      createdAt: new Date()
    };

    // Store share configuration
    await this.storeLocationShare(shareId, shareData);

    // Generate secure share URL
    const shareUrl = this.generateSecureShareUrl(shareId);

    return { shareId, expiresAt, shareUrl };
  }

  // Private implementation methods
  private async initializeWebSocket(): Promise<void> {
    if (this.websocket?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/location-tracking`;
    
    try {
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('Real-time location service connected');
        this.reconnectAttempts = 0;
      };
      
      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(JSON.parse(event.data));
      };
      
      this.websocket.onclose = () => {
        this.handleWebSocketClose();
      };
      
      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private handleLocationUpdate(sessionId: string, location: LocationData): void {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.tracking.enabled) return;

    const update: LocationUpdate = {
      sessionId,
      location: this.applyPrivacyFilter(location, session.tracking.shareLevel),
      timestamp: new Date(),
      accuracy: location.accuracy
    };

    // Check geofences
    this.checkGeofences(sessionId, location);

    // Send to server
    this.sendMessage({
      type: 'location_update',
      update
    });

    // Notify local callbacks
    const callbacks = this.locationUpdateCallbacks.get(sessionId);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(update);
        } catch (error) {
          console.error('Location update callback error:', error);
        }
      });
    }
  }

  private applyPrivacyFilter(location: LocationData, shareLevel: string): LocationData {
    switch (shareLevel) {
      case 'exact':
        return location;
      case 'approximate':
        return {
          ...location,
          latitude: this.roundToDecimalPlaces(location.latitude, 3),
          longitude: this.roundToDecimalPlaces(location.longitude, 3),
          accuracy: Math.max(100, location.accuracy)
        };
      case 'area_only':
        return {
          ...location,
          latitude: this.roundToDecimalPlaces(location.latitude, 2),
          longitude: this.roundToDecimalPlaces(location.longitude, 2),
          accuracy: 1000
        };
      default:
        return location;
    }
  }

  private checkGeofences(sessionId: string, location: LocationData): void {
    for (const [geofenceId, geofence] of this.geofences) {
      const distance = geolocationService.calculateDistance(
        location.latitude,
        location.longitude,
        geofence.location.latitude,
        geofence.location.longitude
      );

      if (distance <= geofence.radius / 1000) { // Convert to km
        const event: GeofenceEvent = {
          id: geofenceId,
          type: 'enter',
          location,
          radius: geofence.radius,
          userId: sessionId, // This should be actual userId
          sessionId,
          timestamp: new Date(),
          metadata: {}
        };

        geofence.callback(event);
      }
    }
  }

  private sendMessage(message: any): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    }
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'location_update':
        this.handleIncomingLocationUpdate(message.data);
        break;
      case 'service_match':
        this.handleServiceMatchUpdate(message.data);
        break;
      case 'eta_update':
        this.handleETAUpdate(message.data);
        break;
    }
  }

  private handleWebSocketClose(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, Math.pow(2, this.reconnectAttempts) * 1000);
    }
  }

  private handleIncomingLocationUpdate(data: any): void {
    // Handle incoming location updates from other users
    const callbacks = this.locationUpdateCallbacks.get(data.sessionId);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private handleServiceMatchUpdate(data: any): void {
    // Handle service match updates
  }

  private handleETAUpdate(data: any): void {
    // Handle ETA updates
  }

  private getTrackingInterval(precision: string): number {
    const intervals = {
      high: 5000,    // 5 seconds
      medium: 15000, // 15 seconds
      low: 60000     // 1 minute
    };
    return intervals[precision as keyof typeof intervals] || intervals.medium;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateShareId(): string {
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private roundToDecimalPlaces(value: number, places: number): number {
    const factor = Math.pow(10, places);
    return Math.round(value * factor) / factor;
  }

  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private calculateRelevanceScore(
    recommendation: any,
    preferences: any,
    location: LocationData
  ): number {
    // Implement relevance scoring algorithm
    return Math.random(); // Placeholder
  }

  // Placeholder implementations for external service integrations
  private async queryNearbyProviders(location: LocationData, radius: number, category?: string, urgency?: string): Promise<any[]> {
    // Implement nearby provider query
    return [];
  }

  private async createServiceMatch(session: RealTimeSession, provider: any, location: LocationData): Promise<ServiceMatch> {
    // Implement service match creation
    return {
      id: 'match_' + Math.random().toString(36).substr(2, 9),
      providerId: provider.id,
      customerId: session.userId,
      status: 'pending',
      estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
      distance: 0,
      duration: 30,
      realTimeUpdates: []
    };
  }

  private sortServiceMatches(matches: ServiceMatch[], sortBy: string): ServiceMatch[] {
    // Implement match sorting
    return matches;
  }

  private async getProviderCurrentLocation(matchId: string): Promise<LocationData | null> {
    // Implement provider location retrieval
    return null;
  }

  private async calculateProviderETA(matchId: string, customerId: string): Promise<number | null> {
    // Implement ETA calculation
    return null;
  }

  private async getProviderRoute(matchId: string): Promise<LocationData[] | null> {
    // Implement route retrieval
    return null;
  }

  private async getGoogleMapsRoute(from: LocationData, to: LocationData, mode: string): Promise<any> {
    // Implement Google Maps routing
    return { duration: 30, distance: 10, route: [], description: 'Google Maps route' };
  }

  private async getMapboxRoute(from: LocationData, to: LocationData, mode: string): Promise<any> {
    // Implement Mapbox routing
    return { duration: 32, distance: 10.2, route: [], description: 'Mapbox route' };
  }

  private async getOpenRouteServiceRoute(from: LocationData, to: LocationData, mode: string): Promise<any> {
    // Implement OpenRouteService routing
    return { duration: 31, distance: 10.1, route: [], description: 'OpenRouteService route' };
  }

  private selectBestRoute(routes: any[]): any {
    // Implement best route selection algorithm
    return routes[0];
  }

  private async analyzeTrafficLevel(route: LocationData[]): Promise<'low' | 'medium' | 'high'> {
    // Implement traffic analysis
    return 'medium';
  }

  private async getContextualServices(location: LocationData, timeOfDay: string): Promise<any[]> {
    // Implement contextual service recommendations
    return [];
  }

  private async getPopularServicesInArea(location: LocationData, radius: number): Promise<any[]> {
    // Implement popular services query
    return [];
  }

  private async getTrendingServices(location: LocationData): Promise<any[]> {
    // Implement trending services query
    return [];
  }

  private async storeLocationShare(shareId: string, shareData: any): Promise<void> {
    // Implement share storage
  }

  private generateSecureShareUrl(shareId: string): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}/share/location/${shareId}`;
  }
}

export const realTimeLocationService = RealTimeLocationService.getInstance();
