// app/[lang]/airtable-test/page.tsx

import { fetchAirtable } from '@/lib/fetch-airtable'

export default async function AirtableTestPage() {
  const records = await fetchAirtable({
    tableName: 'Listings',
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Airtable Listings</h1>
      <ul className="space-y-2">
        {records.map((record: any) => (
          <li key={record.id} className="border p-4 rounded shadow">
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(record, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
}