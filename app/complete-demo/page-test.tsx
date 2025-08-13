"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Rocket } from 'lucide-react';

export default function CompleteDemoTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">
            Loconomy Platform
          </h1>
          <h2 className="text-3xl font-semibold mb-4">
            Complete Implementation
          </h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto">
            Experience the fully implemented next-generation marketplace platform with 
            advanced features, enterprise capabilities, and cutting-edge technology integrations.
          </p>
          
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Rocket className="w-5 h-5 mr-2" />
            Explore Features
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Complete Feature Suite</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore all the implemented features and capabilities of the Loconomy platform. 
            Each module is fully functional and ready for production use.
          </p>
        </div>

        {/* Simple card to test */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span>Test Card</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a test to see if the glass-card styling is working properly.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
