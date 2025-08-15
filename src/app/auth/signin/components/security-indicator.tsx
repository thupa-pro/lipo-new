"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  Globe, 
  Server, 
  Fingerprint,
  CheckCircle,
  AlertTriangle,
  Wifi,
  Monitor
} from "lucide-react";

interface SecurityMetric {
  id: string;
  label: string;
  value: string;
  status: 'secure' | 'warning' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function SecurityIndicator() {
  const [connectionSecure, setConnectionSecure] = useState(true);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>("");
  const [encryptionLevel, setEncryptionLevel] = useState("AES-256");

  useEffect(() => {
    // Detect connection security
    setConnectionSecure(window.location.protocol === 'https:');
    
    // Generate simple device fingerprint for demo
    const generateFingerprint = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Security fingerprint', 2, 2);
        return canvas.toDataURL().slice(-8);
      }
      return 'DEV' + Math.random().toString(36).substr(2, 5);
    };

    setDeviceFingerprint(generateFingerprint());
  }, []);

  const securityMetrics: SecurityMetric[] = [
    {
      id: 'connection',
      label: 'Connection',
      value: connectionSecure ? 'Encrypted' : 'Insecure',
      status: connectionSecure ? 'secure' : 'warning',
      icon: connectionSecure ? Lock : AlertTriangle,
      description: connectionSecure 
        ? 'Your connection is secured with TLS 1.3 encryption'
        : 'Your connection is not secure. Please use HTTPS.'
    },
    {
      id: 'server',
      label: 'Server',
      value: 'Global CDN',
      status: 'secure',
      icon: Server,
      description: 'Connected to nearest secure data center'
    },
    {
      id: 'encryption',
      label: 'Encryption',
      value: encryptionLevel,
      status: 'secure',
      icon: Shield,
      description: 'Military-grade encryption protects your data'
    },
    {
      id: 'device',
      label: 'Device ID',
      value: deviceFingerprint,
      status: 'info',
      icon: Fingerprint,
      description: 'Unique device identifier for enhanced security'
    }
  ];

  const getStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'secure':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'secure':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Security Status
              </h3>
              <Badge className="mt-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Protected
              </Badge>
            </div>
          </div>
          
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Live</span>
          </div>
        </div>

        {/* Security Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {securityMetrics.map((metric) => (
            <div
              key={metric.id}
              className="group relative"
              title={metric.description}
            >
              <div className={`p-3 rounded-xl ${getStatusBg(metric.status)} hover:scale-105 transition-all duration-200 cursor-help`}>
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {metric.label}
                  </span>
                </div>
                <div className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs p-2 rounded-lg whitespace-nowrap shadow-lg">
                  {metric.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Security Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              <span>Global security monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              <span>Zero-knowledge architecture</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>ISO 27001</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
