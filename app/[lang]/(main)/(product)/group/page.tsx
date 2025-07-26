import { getCategories } from '@/lib/airtable'

export default async function GroupIndexPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tattoo Shop Categories</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <a
            key={category}
            href={`/${lang}/group/tattoo/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{category}</h2>
            <p className="text-gray-600">Browse {category.toLowerCase()} tattoo shops</p>
          </a>
        ))}
      </div>
    </div>
  )
}