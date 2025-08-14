"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, AlertTriangle, XCircle, Settings, 
  Database, CreditCard, Shield, Mail, Key
} from "lucide-react";

interface EnvironmentVariable {
  name: string;
  description: string;
  required: boolean;
  category: "database" | "auth" | "payment" | "email" | "api";
  icon: any;
}

const envVars: EnvironmentVariable[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Supabase project URL for database operations",
    required: true,
    category: "database",
    icon: Database
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", 
    description: "Supabase anonymous key for client-side operations",
    required: true,
    category: "database",
    icon: Database
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    description: "Supabase service role key for server-side operations",
    required: true,
    category: "database", 
    icon: Database
  },
  {
    name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    description: "Clerk publishable key for authentication",
    required: false,
    category: "auth",
    icon: Shield
  },
  {
    name: "CLERK_SECRET_KEY",
    description: "Clerk secret key for server-side auth operations",
    required: false,
    category: "auth",
    icon: Shield
  },
  {
    name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    description: "Stripe publishable key for payments",
    required: false,
    category: "payment",
    icon: CreditCard
  },
  {
    name: "STRIPE_SECRET_KEY",
    description: "Stripe secret key for payment processing",
    required: false,
    category: "payment",
    icon: CreditCard
  },
  {
    name: "RESEND_API_KEY",
    description: "Resend API key for email notifications",
    required: false,
    category: "email",
    icon: Mail
  },
  {
    name: "GOOGLE_AI_API_KEY",
    description: "Google AI API key for AI features",
    required: false,
    category: "api",
    icon: Key
  }
];

export function EnvironmentCheck() {
  const checkEnvVar = (name: string) => {
    if (name.startsWith("NEXT_PUBLIC_")) {
      return !!process.env[name];
    }
    // For server-only vars, we can't check them client-side
    // So we assume they might be set
    return "unknown";
  };

  const getStatusIcon = (status: boolean | "unknown") => {
    if (status === true) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === false) return <XCircle className="w-4 h-4 text-red-600" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  const getStatusBadge = (status: boolean | "unknown", required: boolean) => {
    if (status === true) return <Badge className="bg-green-100 text-green-800">✓ Set</Badge>;
    if (status === false && required) return <Badge className="bg-red-100 text-red-800">✗ Missing (Required)</Badge>;
    if (status === false && !required) return <Badge className="bg-yellow-100 text-yellow-800">Not Set (Optional)</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">? Unknown</Badge>;
  };

  const categorizedVars = envVars.reduce((acc, envVar) => {
    if (!acc[envVar.category]) acc[envVar.category] = [];
    acc[envVar.category].push(envVar);
    return acc;
  }, {} as Record<string, EnvironmentVariable[]>);

  const categoryLabels = {
    database: "Database Configuration",
    auth: "Authentication Services", 
    payment: "Payment Processing",
    email: "Email Services",
    api: "External APIs"
  };

  const categoryIcons = {
    database: Database,
    auth: Shield,
    payment: CreditCard,
    email: Mail,
    api: Key
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Environment Configuration
        </CardTitle>
        <CardDescription>
          Environment variables and API key configuration status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(categorizedVars).map(([category, vars]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          return (
            <div key={category}>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Icon className="w-4 h-4 mr-2" />
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h4>
              
              <div className="space-y-2">
                {vars.map((envVar) => {
                  const status = checkEnvVar(envVar.name);
                  return (
                    <div key={envVar.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(status)}
                        <div>
                          <h5 className="font-medium text-sm text-slate-900 dark:text-white">
                            {envVar.name}
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {envVar.description}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(status, envVar.required)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>Development Mode:</strong> The app will function with mock data when API keys are missing. 
            Configure environment variables for full functionality in production.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
