import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/listings/route'

// Mock auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-id' })),
}))

describe('/api/listings', () => {
  describe('GET /api/listings', () => {
    it('should return listings with valid query parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/listings?q=plumber&limit=10')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('listings')
      expect(data).toHaveProperty('pagination')
    })

    it('should handle location-based search', async () => {
      const request = new NextRequest('http://localhost:3000/api/listings?lat=40.7128&lng=-74.0060&radius=5')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.listings).toBeDefined()
    })

    it('should validate query parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/listings?limit=invalid')
      
      const response = await GET(request)
      
      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/listings', () => {
    it('should create a listing with valid data', async () => {
      const listingData = {
        title: 'Professional Plumbing Services',
        description: 'Expert plumber with 10 years experience',
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        price: 100,
        price_type: 'hourly' as const,
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: '123 Main St, New York, NY',
        },
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
          hours: {
            start: '09:00',
            end: '17:00',
          },
        },
      }

      const request = new NextRequest('http://localhost:3000/api/listings', {
        method: 'POST',
        body: JSON.stringify(listingData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      
      expect(response.status).toBe(201)
    })

    it('should reject invalid listing data', async () => {
      const invalidData = {
        title: '', // Invalid: too short
        description: 'Short', // Invalid: too short
        price: -100, // Invalid: negative price
      }

      const request = new NextRequest('http://localhost:3000/api/listings', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      
      expect(response.status).toBe(400)
    })

    it('should require authentication', async () => {
      // Mock unauthenticated user
      vi.mocked(require('@clerk/nextjs/server').auth).mockReturnValue({ userId: null })

      const request = new NextRequest('http://localhost:3000/api/listings', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      
      expect(response.status).toBe(401)
    })
  })
})
