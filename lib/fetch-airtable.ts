// lib/fetch-airtable.ts

export async function fetchAirtable<T = any>({
  tableName,
  view = 'Grid view',
  maxRecords = 100,
  filterByFormula
}: {
  tableName: string
  view?: string
  maxRecords?: number
  filterByFormula?: string
}): Promise<T[]> {
  const apiKey = process.env.AIRTABLE_API_TOKEN  // Fixed to match your .env file
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey || !baseId) {
    throw new Error('Missing Airtable API credentials')
  }

  // Build URL with optional filter
  let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?view=${encodeURIComponent(view)}&maxRecords=${maxRecords}`
  
  if (filterByFormula) {
    url += `&filterByFormula=${encodeURIComponent(filterByFormula)}`
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 60, // ISR for 60s
    },
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Failed to fetch Airtable records: ${res.status} - ${errorBody}`)
  }

  const data = await res.json()
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }))
}