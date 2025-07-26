// lib/airtable.ts
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base(process.env.AIRTABLE_BASE_ID!)

const tableName = process.env.AIRTABLE_TABLE_NAME || 'Listings'

export type AirtableListing = {
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

// Get all listings with optional filters
export async function getAirtableListings(options: {
  featured?: boolean
  category?: string
  limit?: number
  status?: string
} = {}): Promise<AirtableListing[]> {
  const { featured, category, limit, status = 'Published' } = options
  
  // Build filter formula for Airtable
  let filterFormula = `{Status} = '${status}'`
  
  if (featured) {
    filterFormula += ` AND {Featured}`
  }
  
  if (category) {
    filterFormula += ` AND {Category} = '${category}'`
  }

  const records = await base(tableName)
    .select({ 
      view: 'Grid view',
      filterByFormula: filterFormula,
      maxRecords: limit || 100,
      sort: [{ field: 'Created Date', direction: 'desc' }]
    })
    .all()

  const listings: AirtableListing[] = records.map((record) => {
    const fields = record.fields

    return {
      id: record.id,
      name: fields['Name'] as string,
      slug: fields['Slug'] as string || fields['Slug 2'] as string, // Use Slug 2 as fallback
      description: fields['Description'] as string,
      imageUrl: Array.isArray(fields['Image']) ? fields['Image'][0]?.url : undefined,
      tags: (fields['Tags'] as string[]) || [],
      website: fields['Website'] as string,
      instagram: fields['Instagram'] as string,
      bookingUrl: fields['Booking URL'] as string,
      email: fields['Email'] as string,
      category: fields['Category'] as string,
      featured: Boolean(fields['Featured']),
      locale: fields['Locale'] as string,
      status: fields['Status'] as string,
      createdDate: fields['Created Date'] as string,
      lastUpdated: fields['Last Updated'] as string,
    }
  })

  return listings
}

// Get a single listing by its slug
export async function getAirtableListingBySlug(slug: string): Promise<AirtableListing | null> {
  const records = await base(tableName)
    .select({
      filterByFormula: `OR({Slug} = '${slug}', {Slug 2} = '${slug}')`,
      maxRecords: 1
    })
    .all()

  if (records.length === 0) return null

  const record = records[0]
  const fields = record.fields

  return {
    id: record.id,
    name: fields['Name'] as string,
    slug: fields['Slug'] as string || fields['Slug 2'] as string,
    description: fields['Description'] as string,
    imageUrl: Array.isArray(fields['Image']) ? fields['Image'][0]?.url : undefined,
    tags: (fields['Tags'] as string[]) || [],
    website: fields['Website'] as string,
    instagram: fields['Instagram'] as string,
    bookingUrl: fields['Booking URL'] as string,
    email: fields['Email'] as string,
    category: fields['Category'] as string,
    featured: Boolean(fields['Featured']),
    locale: fields['Locale'] as string,
    status: fields['Status'] as string,
    createdDate: fields['Created Date'] as string,
    lastUpdated: fields['Last Updated'] as string,
  }
}

// Get all unique categories
export async function getCategories(): Promise<string[]> {
  const records = await base(tableName)
    .select({
      fields: ['Category'],
      filterByFormula: `{Status} = 'Published'`
    })
    .all()

  const categories = new Set<string>()
  records.forEach(record => {
    const category = record.fields['Category'] as string
    if (category) categories.add(category)
  })

  return Array.from(categories)
}

// Get all unique tags
export async function getTags(): Promise<string[]> {
  const records = await base(tableName)
    .select({
      fields: ['Tags'],
      filterByFormula: `{Status} = 'Published'`
    })
    .all()

  const tags = new Set<string>()
  records.forEach(record => {
    const recordTags = record.fields['Tags'] as string[]
    if (recordTags) {
      recordTags.forEach(tag => tags.add(tag))
    }
  })

  return Array.from(tags)
}

export type SanityCompatibleListing = {
  _id: string
  _type: "product"
  _createdAt: string
  _updatedAt: string
  _rev: string
  name: string
  slug: string | null
  desc: string
  description?: string
  coverImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    hotspot?: any;
    crop?: any;
    _type: "image";
    url?: string; // Store Airtable URL directly for fallback
  }
  image?: { url: string }
  tags: { _id: string; _type: "tag"; _createdAt: string; _updatedAt: string; _rev: string; name?: string; slug: string | null; order?: number; date?: string }[] | null
  website?: string
  link?: string
  category: {
    _id: string
    _type: "category"
    _createdAt: string
    _updatedAt: string
    _rev: string
    name: string
    slug: string | null
    group: {
      _id: string
      _type: "group"
      _createdAt: string
      _updatedAt: string
      _rev: string
      name: string
      slug: string | null
      order?: number
      date?: string
    } | null
    order?: number
    date?: string
  } | null
  featured?: boolean
  visible?: boolean
  date: string
  submitter: any
  guides: any[]
  status: "draft" | "published"
  order?: number
}

// Transform Airtable listings to Sanity-compatible format
export async function getListingsForUI(options: {
  featured?: boolean
  category?: string
  limit?: number
  status?: string
} = {}): Promise<SanityCompatibleListing[]> {
  const airtableListings = await getAirtableListings(options)
  
  return airtableListings.map(listing => ({
    _id: listing.id,
    _type: "product",
    _createdAt: listing.createdDate || new Date().toISOString(),
    _updatedAt: listing.lastUpdated || new Date().toISOString(),
    _rev: "1",
    name: listing.name,
    slug: listing.slug,
    desc: listing.description || '',
    description: listing.description,
    coverImage: listing.imageUrl ? {
      asset: {
        _ref: `image-${listing.id}`,
        _type: "reference" as const,
        _weak: false,
      },
      _type: "image" as const,
      url: listing.imageUrl, // Store direct URL for components
    } : undefined,
    image: listing.imageUrl ? { url: listing.imageUrl } : undefined,
    tags: listing.tags?.map(tag => ({
      _id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "1",
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
      order: 0,
      date: new Date().toISOString()
    })) || null,
    website: listing.website,
    link: listing.website,
    category: listing.category ? {
      _id: `cat-${listing.category}`,
      _type: "category",
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "1",
      name: listing.category,
      slug: listing.category.toLowerCase().replace(/\s+/g, '-'),
      group: null,
      order: 0,
      date: new Date().toISOString()
    } : null,
    featured: listing.featured,
    visible: true,
    date: listing.createdDate || new Date().toISOString(),
    submitter: null,
    guides: [],
    status: "published" as const,
    order: 0
  }))
}

// Transform single listing to Sanity-compatible format
export async function getListingForUIBySlug(slug: string): Promise<SanityCompatibleListing | null> {
  const airtableListing = await getAirtableListingBySlug(slug)
  
  if (!airtableListing) return null
  
  return {
    _id: airtableListing.id,
    _type: "product",
    _createdAt: airtableListing.createdDate || new Date().toISOString(),
    _updatedAt: airtableListing.lastUpdated || new Date().toISOString(),
    _rev: "1",
    name: airtableListing.name,
    slug: airtableListing.slug,
    desc: airtableListing.description || '',
    description: airtableListing.description,
    coverImage: airtableListing.imageUrl ? {
      asset: {
        _ref: `image-${airtableListing.id}`,
        _type: "reference" as const,
        _weak: false,
      },
      _type: "image" as const,
      url: airtableListing.imageUrl, // Store direct URL for components
    } : undefined,
    image: airtableListing.imageUrl ? { url: airtableListing.imageUrl } : undefined,
    tags: airtableListing.tags?.map(tag => ({
      _id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "1",
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
      order: 0,
      date: new Date().toISOString()
    })) || null,
    website: airtableListing.website,
    link: airtableListing.website,
    category: airtableListing.category ? {
      _id: `cat-${airtableListing.category}`,
      _type: "category" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "1",
      name: airtableListing.category,
      slug: airtableListing.category.toLowerCase().replace(/\s+/g, '-'),
      group: null,
      order: 0,
      date: new Date().toISOString()
    } : null,
    featured: airtableListing.featured,
    visible: true,
    date: airtableListing.createdDate || new Date().toISOString(),
    submitter: null,
    guides: [],
    status: "published" as const,
    order: 0
  }
}