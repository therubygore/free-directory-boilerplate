# PDX Tattoo Directory - Project Memory

## Project Overview
A Next.js-based tattoo shop directory for Portland, originally built with Sanity CMS but migrated to use Airtable as the data source while maintaining the existing UI components.

## Current Status (as of January 2025)

### ✅ Completed
- **Full Airtable Integration**: All pages now fetch data from Airtable instead of Sanity
- **Data Transformation Layer**: Created seamless compatibility between Airtable and existing UI components  
- **Image Handling**: Hybrid approach supporting both Sanity image processing and direct Airtable URLs
- **Type Safety**: All transformations properly typed and build-ready
- **Route Configuration**: Fixed middleware and routing issues

### 🔧 Current Issues
- Runtime error: "missing required error components, refreshing..." on some pages
- Needs debugging of Airtable API calls in production environment

## Key Architecture Decisions

### 1. Data Source Migration: Sanity → Airtable
**Decision**: Keep existing UI components unchanged, create transformation layer
**Rationale**: Minimize breaking changes while switching data sources
**Implementation**: 
- `lib/airtable.ts` handles all data fetching and transformation
- `getListingsForUI()` and `getListingForUIBySlug()` provide Sanity-compatible data

### 2. Image Handling Strategy
**Decision**: Hybrid approach supporting both Sanity and Airtable image formats
**Implementation**:
- Modified `urlForImageWithSize()` in `sanity/lib/utils.ts` to detect and handle direct URLs
- Airtable images stored with both Sanity asset structure and direct URL fallback

### 3. Type Compatibility
**Decision**: Create `SanityCompatibleListing` type that matches existing component expectations
**Implementation**:
- Required fields: `desc: string`, `date: string`
- Complex nested structures for `category`, `tags`, `coverImage`
- Proper `_id`, `_type`, `_createdAt`, etc. metadata

## File Structure

```
/app/[lang]/(main)/(product)/
├── group/
│   ├── new/page.tsx                    # New listings page
│   ├── featured/page.tsx               # Featured listings page  
│   ├── [group]/
│   │   ├── layout.tsx                  # Category layout
│   │   └── category/[category]/page.tsx # Category-specific listings
│   └── page.tsx                        # Category overview
├── product/[product]/page.tsx          # Individual product pages
└── (indieapp)/
    ├── app/[app]/page.tsx             # Individual app pages
    └── apptype/[type]/page.tsx        # App type listings

/lib/
└── airtable.ts                        # Core Airtable integration

/components/
├── product-grid-client.tsx           # Grid display component
├── product-single-client.tsx         # Single product display
└── ...

/config/
├── site.ts                           # Site configuration
├── settings.ts                       # Settings configuration  
└── share-resource.ts                 # Resource sharing config

/sanity/lib/
└── utils.ts                          # Image processing utilities (modified for Airtable)
```

## Core Data Flow

### Listing Pages
1. Page component calls `getListingsForUI(options)`
2. Function fetches from Airtable using `getAirtableListings()`  
3. Raw Airtable data transformed to `SanityCompatibleListing[]`
4. Data passed to `ProductGridClient` component unchanged
5. Component uses `urlForImageWithSize()` for images (hybrid processing)

### Individual Product Pages
1. Page component calls `getListingForUIBySlug(slug)`
2. Function fetches single item using `getAirtableListingBySlug()`
3. Raw data transformed to `SanityCompatibleListing`
4. Data passed to `ProductSingleClient` component unchanged

## Airtable Configuration

### Environment Variables
```
AIRTABLE_API_TOKEN=pataKJg5TGo7NamKy...
AIRTABLE_BASE_ID=appsS1sc96kycAeG3  
AIRTABLE_TABLE_NAME=Listings
```

### Airtable Schema
- **Name**: Shop name
- **Slug**: URL slug
- **Description**: Shop description
- **Image**: Array of image attachments
- **Tags**: Array of category tags
- **Website**: Website URL
- **Instagram**: Instagram URL
- **Booking URL**: Appointment booking link
- **Email**: Contact email
- **Category**: Primary category
- **Featured**: Boolean flag
- **Status**: Published/Draft status
- **Locale**: Language locale
- **Created Date**: Creation timestamp
- **Last Updated**: Update timestamp

## Key Functions

### `lib/airtable.ts`
- `getAirtableListings(options)`: Raw Airtable data fetching
- `getAirtableListingBySlug(slug)`: Single item by slug
- `getListingsForUI(options)`: UI-compatible data transformation
- `getListingForUIBySlug(slug)`: Single item UI transformation
- `getCategories()`: Unique categories list
- `getTags()`: Unique tags list

### Data Transformation
Airtable → Sanity compatibility:
```typescript
{
  id: string              → _id: string
  name: string            → name: string  
  description?: string    → desc: string (required)
  imageUrl?: string       → coverImage: SanityImageObject
  tags?: string[]         → tags: SanityTagObject[]
  category?: string       → category: SanityCategoryObject
  createdDate?: string    → date: string (required)
  // + additional Sanity metadata fields
}
```

## Fixed Issues During Migration

### 1. Build Errors
- **Missing exports**: Added `getAllSettingsConfigs()`, `getAllShareResourceConfigs()`
- **Edge Runtime**: Fixed `import { env } from "process"` → `import { env } from "@/env.mjs"`
- **TypeScript errors**: Fixed unescaped entities, type mismatches

### 2. Component Compatibility  
- **Image processing**: Modified `urlForImageWithSize()` for Airtable URLs
- **Required fields**: Made `desc` and `date` fields required and non-nullable
- **Type casting**: Removed `as any` casts after proper type alignment

### 3. Route Configuration
- **Middleware**: Fixed Node.js module imports in Edge Runtime
- **Public routes**: Ensured `/group/*` routes are publicly accessible

## Debug Features Added

### Debug Logging (Temporary)
Added comprehensive logging to `group/new/page.tsx`:
- Airtable fetch attempt logging
- Success/failure status  
- Error message details
- Listing count and sample data

## Next Steps for Debugging

1. **Check server logs** when visiting `http://localhost:3000/en/group/new`
2. **Verify Airtable connectivity** in browser network tab
3. **Examine error boundary triggers** if "missing required error components" persists
4. **Test individual components** in isolation if needed

## Environment Setup

### Development Server
```bash
npm run dev        # Starts on http://localhost:3000
```

### Build Process
```bash
npm run build      # Compiles successfully (except unrelated dashboard error)
```

### Airtable Testing
Direct API test confirmed working:
```bash
curl -H "Authorization: Bearer TOKEN" \
"https://api.airtable.com/v0/BASE_ID/Listings?maxRecords=1"
```

## Code Quality Notes

- **No UI changes**: All existing components work unchanged
- **Type safety**: Full TypeScript compatibility maintained  
- **Error handling**: Comprehensive try/catch blocks with fallbacks
- **Performance**: Efficient data transformation with minimal overhead
- **Maintainability**: Clear separation between data layer and UI components

---

*Last updated: January 2025*
*Status: Airtable integration complete, debugging runtime errors*