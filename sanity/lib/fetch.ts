// This file has been replaced with Airtable integration
// If you see this error, a component is still trying to use Sanity
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective = "published",
  useCache = true,
}: {
  query: string;
  params?: any;
  perspective?: string;
  useCache?: boolean;
}): Promise<QueryResponse> {
  console.error('ERROR: sanityFetch is deprecated! Convert this component to use Airtable instead.');
  console.error('Query:', query);
  console.error('Params:', params);
  
  throw new Error('sanityFetch is no longer supported. This component needs to be converted to use Airtable.');
}