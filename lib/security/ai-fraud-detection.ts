"use client";

import { geolocationService, LocationData } from '../location/geolocation-service';

export interface UserBehaviorProfile {
  userId: string;
  biometric: {
    typingPattern: {
      averageSpeed: number;
      rhythm: number[];
      commonMistakes: string[];
      fingerprint: string;
    };
    mouseMovement: {
      speed: number;
      acceleration: number;
      clickPattern: number[];
      scrollBehavior: string;
    };
    touchPattern?: {
      pressure: number[];
      touchSize: number[];
      gestureSpeed: number;
      swipePattern: string;
    };
  };
  behavioral: {
    loginTimes: number[];
    devicePreferences: string[];
    locationPatterns: LocationData[];
    navigationFlow: string[];
    sessionDuration: number[];
    interactionFrequency: Record<string, number>;
  };
  risk: {
    score: number;
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    anomalies: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      timestamp: Date;
      details: string;
    }>;
  };
  lastUpdated: Date;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  type: 'login_attempt' | 'transaction' | 'profile_change' | 'suspicious_activity' | 'device_change';
  riskScore: number;
  factors: Array<{
    name: string;
    score: number;
    confidence: number;
    explanation: string;
  }>;
  location?: LocationData;
  deviceFingerprint: string;
  timestamp: Date;
  action: 'allow' | 'challenge' | 'block' | 'monitor';
  confidence: number;
  metadata: Record<string, any>;
}

export interface FraudDetectionResult {
  safe: boolean;
  riskScore: number;
  confidence: number;
  reasons: string[];
  recommendedAction: 'allow' | 'challenge' | 'block' | 'require_verification';
  additionalVerification?: Array<{
    method: 'sms' | 'email' | 'biometric' | 'security_question' | 'device_confirm';
    reason: string;
    required: boolean;
  }>;
  explanation: {
    primaryConcerns: string[];
    mitigatingFactors: string[];
    userFriendlyMessage: string;
  };
}

export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  screen: { width: number; height: number; colorDepth: number };
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: boolean;
  plugins: string[];
  fonts: string[];
  canvas: string;
  webgl: string;
  audioContext: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  connection?: {
    type: string;
    effectiveType: string;
    downlink: number;
  };
  battery?: {
    level: number;
    charging: boolean;
  };
  trustScore: number;
  firstSeen: Date;
  lastSeen: Date;
}

export interface BiometricChallenge {
  id: string;
  type: 'typing' | 'mouse' | 'touch' | 'voice' | 'behavioral';
  challenge: string;
  expectedPattern?: any;
  timeout: number;
  maxAttempts: number;
  fallbackMethods: string[];
}

class AIFraudDetectionEngine {
  private static instance: AIFraudDetectionEngine;
  private userProfiles: Map<string, UserBehaviorProfile> = new Map();
  private deviceFingerprints: Map<string, DeviceFingerprint> = new Map();
  private securityEvents: Map<string, SecurityEvent[]> = new Map();
  private mlModels: Map<string, any> = new Map();
  
  // Risk scoring weights
  private riskWeights = {
    location: 0.25,
    device: 0.20,
    behavior: 0.20,
    timing: 0.15,
    biometric: 0.15,
    network: 0.05
  };

  // Anomaly detection thresholds
  private thresholds = {
    riskScore: 0.7,
    locationDeviation: 100, // km
    timeDeviation: 4, // hours
    velocityAlert: 1000, // km/h impossible travel
    deviceTrust: 0.6,
    behaviorChange: 0.3
  };

  static getInstance(): AIFraudDetectionEngine {
    if (!AIFraudDetectionEngine.instance) {
      AIFraudDetectionEngine.instance = new AIFraudDetectionEngine();
    }
    return AIFraudDetectionEngine.instance;
  }

  // Main fraud detection function
  async detectFraud(
    userId: string,
    eventType: SecurityEvent['type'],
    context: {
      location?: LocationData;
      deviceFingerprint?: Partial<DeviceFingerprint>;
      biometricData?: any;
      transactionAmount?: number;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<FraudDetectionResult> {
    try {
      // Get or create user behavior profile
      const userProfile = await this.getUserBehaviorProfile(userId);
      
      // Generate device fingerprint
      const deviceFingerprint = await this.generateDeviceFingerprint(context.deviceFingerprint);
      
      // Calculate comprehensive risk score
      const riskAssessment = await this.calculateRiskScore(
        userId,
        eventType,
        context,
        userProfile,
        deviceFingerprint
      );

      // Run ML-based anomaly detection
      const anomalies = await this.detectAnomalies(
        userId,
        context,
        userProfile,
        deviceFingerprint
      );

      // Combine scores and make decision
      const finalRiskScore = this.combineRiskScores(riskAssessment, anomalies);
      const action = this.determineAction(finalRiskScore, eventType, context);

      // Generate security event
      const securityEvent: SecurityEvent = {
        id: this.generateEventId(),
        userId,
        type: eventType,
        riskScore: finalRiskScore.score,
        factors: finalRiskScore.factors,
        location: context.location,
        deviceFingerprint: deviceFingerprint.id,
        timestamp: new Date(),
        action: action.action,
        confidence: finalRiskScore.confidence,
        metadata: context.metadata || {}
      };

      // Store event for learning
      await this.recordSecurityEvent(securityEvent);

      // Update user profile with new data
      await this.updateUserProfile(userId, context, deviceFingerprint);

      return {
        safe: action.action === 'allow',
        riskScore: finalRiskScore.score,
        confidence: finalRiskScore.confidence,
        reasons: finalRiskScore.factors.map(f => f.explanation),
        recommendedAction: action.action,
        additionalVerification: action.verification,
        explanation: {
          primaryConcerns: this.extractPrimaryConcerns(finalRiskScore.factors),
          mitigatingFactors: this.extractMitigatingFactors(finalRiskScore.factors),
          userFriendlyMessage: this.generateUserFriendlyMessage(action.action, finalRiskScore.score)
        }
      };
    } catch (error) {
      console.error('Fraud detection failed:', error);
      
      // Return safe fallback
      return {
        safe: true,
        riskScore: 0.5,
        confidence: 0.5,
        reasons: ['Unable to complete security analysis'],
        recommendedAction: 'challenge',
        explanation: {
          primaryConcerns: ['System temporarily unavailable'],
          mitigatingFactors: [],
          userFriendlyMessage: 'Please verify your identity to continue.'
        }
      };
    }
  }

  // Behavioral authentication
  async authenticateWithBehavior(
    userId: string,
    biometricData: {
      typing?: {
        keystrokes: Array<{ key: string; timestamp: number; duration: number }>;
        text: string;
      };
      mouse?: {
        movements: Array<{ x: number; y: number; timestamp: number }>;
        clicks: Array<{ x: number; y: number; timestamp: number }>;
      };
      touch?: {
        touches: Array<{ x: number; y: number; pressure: number; timestamp: number }>;
        gestures: Array<{ type: string; data: any; timestamp: number }>;
      };
    }
  ): Promise<{
    authenticated: boolean;
    confidence: number;
    score: number;
    details: Array<{
      method: string;
      score: number;
      confidence: number;
    }>;
  }> {
    const userProfile = await this.getUserBehaviorProfile(userId);
    const results = [];

    // Typing pattern analysis
    if (biometricData.typing && userProfile.biometric.typingPattern) {
      const typingResult = await this.analyzeTypingPattern(
        biometricData.typing,
        userProfile.biometric.typingPattern
      );
      results.push({
        method: 'typing_pattern',
        score: typingResult.score,
        confidence: typingResult.confidence
      });
    }

    // Mouse movement analysis
    if (biometricData.mouse && userProfile.biometric.mouseMovement) {
      const mouseResult = await this.analyzeMousePattern(
        biometricData.mouse,
        userProfile.biometric.mouseMovement
      );
      results.push({
        method: 'mouse_dynamics',
        score: mouseResult.score,
        confidence: mouseResult.confidence
      });
    }

    // Touch pattern analysis (mobile)
    if (biometricData.touch && userProfile.biometric.touchPattern) {
      const touchResult = await this.analyzeTouchPattern(
        biometricData.touch,
        userProfile.biometric.touchPattern
      );
      results.push({
        method: 'touch_dynamics',
        score: touchResult.score,
        confidence: touchResult.confidence
      });
    }

    // Combine results
    const overallScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const overallConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

    return {
      authenticated: overallScore > 0.7,
      confidence: overallConfidence,
      score: overallScore,
      details: results
    };
  }

  // Real-time risk monitoring
  startRealTimeMonitoring(userId: string): {
    stop: () => void;
    updateRisk: (event: Partial<SecurityEvent>) => void;
  } {
    const eventListeners: Array<() => void> = [];
    let riskAccumulator = 0;
    let eventCount = 0;

    // Monitor user interactions
    const monitorClicks = (e: MouseEvent) => {
      this.recordInteraction(userId, 'click', { x: e.clientX, y: e.clientY });
    };

    const monitorKeystrokes = (e: KeyboardEvent) => {
      this.recordInteraction(userId, 'keystroke', { key: e.key, timestamp: Date.now() });
    };

    const monitorScroll = (e: Event) => {
      this.recordInteraction(userId, 'scroll', { scrollY: window.scrollY });
    };

    // Set up listeners
    document.addEventListener('click', monitorClicks);
    document.addEventListener('keydown', monitorKeystrokes);
    document.addEventListener('scroll', monitorScroll);

    eventListeners.push(
      () => document.removeEventListener('click', monitorClicks),
      () => document.removeEventListener('keydown', monitorKeystrokes),
      () => document.removeEventListener('scroll', monitorScroll)
    );

    // Periodic risk assessment
    const riskInterval = setInterval(async () => {
      const currentRisk = await this.calculateContinuousRisk(userId);
      riskAccumulator += currentRisk;
      eventCount++;

      if (currentRisk > this.thresholds.riskScore) {
        this.triggerSecurityAlert(userId, currentRisk);
      }
    }, 30000); // Every 30 seconds

    eventListeners.push(() => clearInterval(riskInterval));

    return {
      stop: () => eventListeners.forEach(cleanup => cleanup()),
      updateRisk: (event) => this.updateRealTimeRisk(userId, event)
    };
  }

  // Advanced device fingerprinting
  async generateDeviceFingerprint(
    partialFingerprint?: Partial<DeviceFingerprint>
  ): Promise<DeviceFingerprint> {
    const fingerprint: DeviceFingerprint = {
      id: '',
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      plugins: Array.from(navigator.plugins).map(p => p.name),
      fonts: await this.detectFonts(),
      canvas: await this.generateCanvasFingerprint(),
      webgl: await this.generateWebGLFingerprint(),
      audioContext: await this.generateAudioFingerprint(),
      hardwareConcurrency: navigator.hardwareConcurrency,
      trustScore: 0.5,
      firstSeen: new Date(),
      lastSeen: new Date(),
      ...partialFingerprint
    };

    // Add device memory if available
    if ('deviceMemory' in navigator) {
      fingerprint.deviceMemory = (navigator as any).deviceMemory;
    }

    // Add connection info if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      fingerprint.connection = {
        type: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink
      };
    }

    // Add battery info if available
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        fingerprint.battery = {
          level: battery.level,
          charging: battery.charging
        };
      } catch (error) {
        console.warn('Battery API unavailable');
      }
    }

    // Generate unique ID
    fingerprint.id = await this.hashFingerprint(fingerprint);

    // Calculate trust score
    fingerprint.trustScore = this.calculateDeviceTrustScore(fingerprint);

    // Store or update fingerprint
    this.deviceFingerprints.set(fingerprint.id, fingerprint);

    return fingerprint;
  }

  // Machine learning model training
  async trainFraudModel(
    trainingData: Array<{
      features: Record<string, number>;
      label: 'fraud' | 'legitimate';
      confidence: number;
    }>
  ): Promise<{ accuracy: number; modelVersion: string }> {
    try {
      // Prepare features
      const features = trainingData.map(d => Object.values(d.features));
      const labels = trainingData.map(d => d.label === 'fraud' ? 1 : 0);

      // Simple neural network implementation (in production, use TensorFlow.js)
      const model = await this.createSimpleNeuralNetwork(features[0].length);
      
      // Train model
      await this.trainModel(model, features, labels);

      // Validate model
      const accuracy = await this.validateModel(model, features, labels);

      // Store model
      const modelVersion = `fraud_model_v${Date.now()}`;
      this.mlModels.set('fraud_detection', { model, accuracy, version: modelVersion });

      return { accuracy, modelVersion };
    } catch (error) {
      console.error('Model training failed:', error);
      return { accuracy: 0, modelVersion: '' };
    }
  }

  // Continuous learning from user behavior
  async updateModelWithFeedback(
    eventId: string,
    feedback: {
      accurate: boolean;
      falsePositive?: boolean;
      falseNegative?: boolean;
      userNote?: string;
    }
  ): Promise<void> {
    const event = await this.getSecurityEventById(eventId);
    if (!event) return;

    // Create training sample from feedback
    const trainingSample = {
      features: this.extractFeatures(event),
      label: feedback.falsePositive ? 'legitimate' : 
             feedback.falseNegative ? 'fraud' : 
             event.riskScore > 0.7 ? 'fraud' : 'legitimate',
      confidence: feedback.accurate ? 1.0 : 0.3
    };

    // Add to training queue
    await this.addToTrainingQueue(trainingSample);

    // Trigger model retraining if enough new samples
    const queueSize = await this.getTrainingQueueSize();
    if (queueSize > 100) {
      await this.scheduleModelRetraining();
    }
  }

  // Risk calculation and analysis methods
  private async calculateRiskScore(
    userId: string,
    eventType: string,
    context: any,
    userProfile: UserBehaviorProfile,
    deviceFingerprint: DeviceFingerprint
  ): Promise<{
    score: number;
    confidence: number;
    factors: Array<{ name: string; score: number; confidence: number; explanation: string }>;
  }> {
    const factors = [];

    // Location risk
    if (context.location) {
      const locationRisk = await this.calculateLocationRisk(userId, context.location, userProfile);
      factors.push({
        name: 'location',
        score: locationRisk.score,
        confidence: locationRisk.confidence,
        explanation: locationRisk.explanation
      });
    }

    // Device risk
    const deviceRisk = this.calculateDeviceRisk(deviceFingerprint, userProfile);
    factors.push({
      name: 'device',
      score: deviceRisk.score,
      confidence: deviceRisk.confidence,
      explanation: deviceRisk.explanation
    });

    // Behavioral risk
    const behaviorRisk = this.calculateBehaviorRisk(eventType, context, userProfile);
    factors.push({
      name: 'behavior',
      score: behaviorRisk.score,
      confidence: behaviorRisk.confidence,
      explanation: behaviorRisk.explanation
    });

    // Timing risk
    const timingRisk = this.calculateTimingRisk(userProfile);
    factors.push({
      name: 'timing',
      score: timingRisk.score,
      confidence: timingRisk.confidence,
      explanation: timingRisk.explanation
    });

    // Calculate weighted average
    const totalScore = factors.reduce((sum, factor) => {
      const weight = this.riskWeights[factor.name as keyof typeof this.riskWeights] || 0.1;
      return sum + (factor.score * weight);
    }, 0);

    const avgConfidence = factors.reduce((sum, f) => sum + f.confidence, 0) / factors.length;

    return {
      score: Math.max(0, Math.min(1, totalScore)),
      confidence: avgConfidence,
      factors
    };
  }

  private async detectAnomalies(
    userId: string,
    context: any,
    userProfile: UserBehaviorProfile,
    deviceFingerprint: DeviceFingerprint
  ): Promise<Array<{
    type: string;
    severity: number;
    confidence: number;
    description: string;
  }>> {
    const anomalies = [];

    // Velocity check (impossible travel)
    if (context.location && userProfile.behavioral.locationPatterns.length > 0) {
      const velocityAnomaly = await this.detectVelocityAnomaly(
        context.location,
        userProfile.behavioral.locationPatterns
      );
      if (velocityAnomaly) {
        anomalies.push(velocityAnomaly);
      }
    }

    // Device change anomaly
    const knownDevices = await this.getUserDevices(userId);
    if (!knownDevices.some(d => d.id === deviceFingerprint.id)) {
      anomalies.push({
        type: 'new_device',
        severity: 0.6,
        confidence: 0.9,
        description: 'Login from unrecognized device'
      });
    }

    // Behavioral pattern anomaly
    const behaviorAnomaly = this.detectBehaviorAnomaly(context, userProfile);
    if (behaviorAnomaly) {
      anomalies.push(behaviorAnomaly);
    }

    return anomalies;
  }

  // Helper methods and implementations
  private async getUserBehaviorProfile(userId: string): Promise<UserBehaviorProfile> {
    if (!this.userProfiles.has(userId)) {
      const profile = await this.createDefaultProfile(userId);
      this.userProfiles.set(userId, profile);
    }
    return this.userProfiles.get(userId)!;
  }

  private async createDefaultProfile(userId: string): Promise<UserBehaviorProfile> {
    return {
      userId,
      biometric: {
        typingPattern: {
          averageSpeed: 150, // WPM
          rhythm: [],
          commonMistakes: [],
          fingerprint: ''
        },
        mouseMovement: {
          speed: 300, // px/s
          acceleration: 50,
          clickPattern: [],
          scrollBehavior: 'smooth'
        }
      },
      behavioral: {
        loginTimes: [],
        devicePreferences: [],
        locationPatterns: [],
        navigationFlow: [],
        sessionDuration: [],
        interactionFrequency: {}
      },
      risk: {
        score: 0.3, // Default low risk
        factors: [],
        anomalies: []
      },
      lastUpdated: new Date()
    };
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private combineRiskScores(riskAssessment: any, anomalies: any[]): any {
    const anomalyScore = anomalies.reduce((sum, a) => sum + a.severity, 0) / Math.max(anomalies.length, 1);
    const combinedScore = (riskAssessment.score * 0.7) + (anomalyScore * 0.3);
    
    return {
      score: Math.max(0, Math.min(1, combinedScore)),
      confidence: riskAssessment.confidence,
      factors: riskAssessment.factors
    };
  }

  private determineAction(riskScore: any, eventType: string, context: any): any {
    if (riskScore.score < 0.3) {
      return { action: 'allow' };
    } else if (riskScore.score < 0.7) {
      return {
        action: 'challenge',
        verification: [
          { method: 'email', reason: 'Verify identity', required: true }
        ]
      };
    } else {
      return {
        action: 'block',
        verification: [
          { method: 'sms', reason: 'High risk detected', required: true },
          { method: 'security_question', reason: 'Additional verification', required: true }
        ]
      };
    }
  }

  // Placeholder implementations for various methods
  private async recordSecurityEvent(event: SecurityEvent): Promise<void> {}
  private async updateUserProfile(userId: string, context: any, fingerprint: DeviceFingerprint): Promise<void> {}
  private extractPrimaryConcerns(factors: any[]): string[] { return factors.map(f => f.explanation); }
  private extractMitigatingFactors(factors: any[]): string[] { return []; }
  private generateUserFriendlyMessage(action: string, score: number): string {
    return action === 'allow' ? 'Access granted' : 
           action === 'challenge' ? 'Please verify your identity' : 
           'Access blocked for security reasons';
  }
  private async analyzeTypingPattern(typing: any, profile: any): Promise<{ score: number; confidence: number }> { return { score: 0.8, confidence: 0.7 }; }
  private async analyzeMousePattern(mouse: any, profile: any): Promise<{ score: number; confidence: number }> { return { score: 0.8, confidence: 0.7 }; }
  private async analyzeTouchPattern(touch: any, profile: any): Promise<{ score: number; confidence: number }> { return { score: 0.8, confidence: 0.7 }; }
  private recordInteraction(userId: string, type: string, data: any): void {}
  private async calculateContinuousRisk(userId: string): Promise<number> { return 0.3; }
  private triggerSecurityAlert(userId: string, risk: number): void {}
  private updateRealTimeRisk(userId: string, event: any): void {}
  private async detectFonts(): Promise<string[]> { return []; }
  private async generateCanvasFingerprint(): Promise<string> { return 'canvas_hash'; }
  private async generateWebGLFingerprint(): Promise<string> { return 'webgl_hash'; }
  private async generateAudioFingerprint(): Promise<string> { return 'audio_hash'; }
  private async hashFingerprint(fingerprint: DeviceFingerprint): Promise<string> { return 'device_hash'; }
  private calculateDeviceTrustScore(fingerprint: DeviceFingerprint): number { return 0.8; }
  private async createSimpleNeuralNetwork(inputSize: number): Promise<any> { return {}; }
  private async trainModel(model: any, features: number[][], labels: number[]): Promise<void> {}
  private async validateModel(model: any, features: number[][], labels: number[]): Promise<number> { return 0.85; }
  private async getSecurityEventById(id: string): Promise<SecurityEvent | null> { return null; }
  private extractFeatures(event: SecurityEvent): Record<string, number> { return {}; }
  private async addToTrainingQueue(sample: any): Promise<void> {}
  private async getTrainingQueueSize(): Promise<number> { return 0; }
  private async scheduleModelRetraining(): Promise<void> {}
  private async calculateLocationRisk(userId: string, location: LocationData, profile: UserBehaviorProfile): Promise<{ score: number; confidence: number; explanation: string }> {
    return { score: 0.2, confidence: 0.8, explanation: 'Location matches typical patterns' };
  }
  private calculateDeviceRisk(fingerprint: DeviceFingerprint, profile: UserBehaviorProfile): { score: number; confidence: number; explanation: string } {
    return { score: 0.3, confidence: 0.9, explanation: 'Device partially recognized' };
  }
  private calculateBehaviorRisk(eventType: string, context: any, profile: UserBehaviorProfile): { score: number; confidence: number; explanation: string } {
    return { score: 0.4, confidence: 0.7, explanation: 'Behavior within normal range' };
  }
  private calculateTimingRisk(profile: UserBehaviorProfile): { score: number; confidence: number; explanation: string } {
    return { score: 0.2, confidence: 0.8, explanation: 'Login time is typical for user' };
  }
  private async detectVelocityAnomaly(location: LocationData, patterns: LocationData[]): Promise<any> { return null; }
  private async getUserDevices(userId: string): Promise<DeviceFingerprint[]> { return []; }
  private detectBehaviorAnomaly(context: any, profile: UserBehaviorProfile): any { return null; }
}

export const aiFraudDetectionEngine = AIFraudDetectionEngine.getInstance();
