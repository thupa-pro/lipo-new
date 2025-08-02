# Supabase Backend Setup Guide

This guide will help you set up a fully functional Supabase backend for the Loconomy platform.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `loconomy-backend`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Environment Variables

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `lib/supabase/schema.sql`
3. Paste and run the SQL script
4. This will create all tables, indexes, RLS policies, and sample data

### 5. Verify Setup

Run the development server and test:

```bash
pnpm dev
```

Visit these endpoints to verify:
- `http://localhost:3000/api/health` - Health check
- `http://localhost:3000/api/test` - Backend tests
- `http://localhost:3000/api/categories` - Categories API

## 📊 Database Schema Overview

### Core Tables

- **users** - User profiles and authentication
- **providers** - Service provider profiles
- **categories** - Service categories
- **services** - Services offered by providers
- **bookings** - Service bookings
- **reviews** - Reviews and ratings
- **messages** - In-app messaging

### Sample Data Included

- 8 service categories (Home Services, Personal Care, etc.)
- Health check records
- Proper indexes for performance
- Row Level Security (RLS) policies

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Users can only access their own data
- Public read access to providers and services
- Secure booking and messaging flows

### Authentication

- Email/password authentication
- Social login support (Google, GitHub, etc.)
- Secure session management
- Role-based access control

## 🛠️ Development Features

### API Routes

- **GET /api/health** - System health check
- **GET /api/test** - Backend connectivity test
- **GET /api/categories** - List service categories
- **GET /api/providers** - Search providers with filters
- **POST /api/providers** - Create provider profile
- **GET /api/users** - User profile
- **PUT /api/users** - Update user profile

### Client Libraries

- `createSupabaseClient()` - Browser client
- `createSupabaseServerClient()` - Server client
- `createSupabaseAdminClient()` - Admin client
- `createSupabaseServerComponent()` - Server component client

## 🔧 Configuration Options

### Authentication Providers

To enable social login:

1. Go to **Authentication** → **Providers**
2. Configure your preferred providers:
   - Google OAuth
   - GitHub OAuth
   - Apple OAuth
   - etc.

### Storage

To enable file uploads:

1. Go to **Storage** → **Buckets**
2. Create buckets for:
   - `avatars` - User profile pictures
   - `covers` - Provider cover photos
   - `documents` - Service documents

### Real-time

Real-time subscriptions are enabled by default for:
- Messages table
- Bookings table
- Provider status updates

## 🚀 Production Deployment

### Environment Variables

Set these in your production environment:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
```

### Database Optimization

For production, consider:
- Connection pooling via Supabase built-in pooler
- Read replicas for high-traffic read operations
- Database backups and point-in-time recovery

## 🐛 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure all env vars are set correctly
   - Restart dev server after changes

2. **"Table doesn't exist" errors**
   - Run the schema.sql script in Supabase dashboard
   - Check table permissions and RLS policies

3. **Authentication errors**
   - Verify anon key is correct
   - Check if RLS policies allow the operation

### Debug Endpoints

- `/api/health` - Basic connectivity
- `/api/test` - Comprehensive backend tests

## 📚 Next Steps

1. Set up authentication flows
2. Implement provider onboarding
3. Add payment processing with Stripe
4. Set up real-time notifications
5. Configure file storage for images

## 🤝 Support

For issues with this setup:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Create an issue in the repository
