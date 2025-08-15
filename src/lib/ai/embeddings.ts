import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseAdminClient } from '@/lib/supabase/client'

export interface EmbeddingResult {
  embedding: number[]
  text: string
  metadata?: Record<string, any>
}

export interface SearchResult {
  id: string
  similarity: number
  content: string
  metadata: Record<string, any>
}

class EmbeddingsService {
  private client: GoogleGenerativeAI
  private model = 'text-embedding-004'

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is required')
    }
    this.client = new GoogleGenerativeAI(apiKey)
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model })
      const result = await model.embedContent(text)
      return result.embedding.values
    } catch (error) {
      console.error('Embedding generation error:', error)
      throw new Error('Failed to generate embedding')
    }
  }

  async generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = []
    
    // Process in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      const embeddings = await Promise.all(
        batch.map(async (text) => {
          const embedding = await this.generateEmbedding(text)
          return { embedding, text }
        })
      )
      results.push(...embeddings)
    }

    return results
  }

  async indexListing(listingId: string, content: string, metadata: Record<string, any>): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(content)
      const supabase = createSupabaseAdminClient()

      await supabase
        .from('listing_embeddings')
        .upsert({
          listing_id: listingId,
          content: content,
          embedding: embedding,
          metadata: metadata,
          updated_at: new Date().toISOString(),
        })

    } catch (error) {
      console.error('Error indexing listing:', error)
      throw new Error('Failed to index listing for search')
    }
  }

  async searchListings(
    query: string, 
    options: {
      limit?: number
      threshold?: number
      filters?: Record<string, any>
    } = {}
  ): Promise<SearchResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query)
      const supabase = createSupabaseAdminClient()

      // Use pgvector similarity search
      const { data: results, error } = await supabase
        .rpc('search_listings_by_embedding', {
          query_embedding: queryEmbedding,
          similarity_threshold: options.threshold || 0.7,
          match_count: options.limit || 10,
          filter_metadata: options.filters || {},
        })

      if (error) {
        console.error('Vector search error:', error)
        throw new Error('Failed to search listings')
      }

      return results?.map((result: any) => ({
        id: result.listing_id,
        similarity: result.similarity,
        content: result.content,
        metadata: result.metadata,
      })) || []

    } catch (error) {
      console.error('Semantic search error:', error)
      throw new Error('Failed to perform semantic search')
    }
  }

  async bulkIndexListings(): Promise<void> {
    try {
      const supabase = createSupabaseAdminClient()

      // Get all active listings that need indexing
      const { data: listings, error } = await supabase
        .from('services')
        .select(`
          id,
          name,
          description,
          provider:providers(business_name, bio),
          category:categories(name, description)
        `)
        .eq('is_active', true)
        .is('embedding_indexed', false)

      if (error || !listings) {
        console.error('Error fetching listings for indexing:', error)
        return
      }

      console.log(`Indexing ${listings.length} listings...`)

      // Process in smaller batches
      const batchSize = 5
      for (let i = 0; i < listings.length; i += batchSize) {
        const batch = listings.slice(i, i + batchSize)
        
        await Promise.all(
          batch.map(async (listing) => {
            // Create comprehensive content for embedding
            const content = [
              listing.name,
              listing.description,
              listing.provider?.business_name,
              listing.provider?.bio,
              listing.category?.name,
              listing.category?.description,
            ].filter(Boolean).join(' ')

            const metadata = {
              listing_id: listing.id,
              category: listing.category?.name,
              provider: listing.provider?.business_name,
            }

            await this.indexListing(listing.id, content, metadata)

            // Mark as indexed
            await supabase
              .from('services')
              .update({ embedding_indexed: true })
              .eq('id', listing.id)
          })
        )

        console.log(`Indexed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(listings.length / batchSize)}`)
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      console.log('Bulk indexing completed')

    } catch (error) {
      console.error('Bulk indexing error:', error)
      throw new Error('Failed to bulk index listings')
    }
  }
}

export const embeddingsService = new EmbeddingsService()

// Utility function to create searchable content from listing data
export function createSearchableContent(listing: any): string {
  const parts = [
    listing.name || listing.title,
    listing.description,
    listing.provider?.business_name,
    listing.provider?.bio,
    listing.category?.name,
    listing.category?.description,
    listing.tags?.join(' '),
    listing.requirements?.join(' '),
  ].filter(Boolean)

  return parts.join(' ')
}

// Utility function to extract keywords for traditional search fallback
export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word))
}
