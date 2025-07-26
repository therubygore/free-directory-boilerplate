// types/airtable.ts

export interface AirtableListing {
    id: string
    name: string
    slug: string
    description?: string
    imageUrl?: string
    tags?: string[]
    website?: string
    instagram?: string
    bookingUrl?: string
    email?: string
    category?: string
    featured?: boolean
    locale?: string
    status?: string
    createdDate?: string
    lastUpdated?: string
  }
  
  export interface AirtableCategory {
    name: string
    slug: string
    count?: number
  }
  
  export interface AirtableTag {
    name: string
    slug: string
    count?: number
  }
  
  // For sitemap generation
  export interface SitemapListing {
    id: string
    slug: string
  }