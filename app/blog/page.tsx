import { getAllArticles } from '@/lib/sanity.queries';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog éducation financière diaspora',
  description: 'Articles sur l\'épargne, les transferts, le crédit et le budget pour la diaspora africaine en France.',
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-8">
          Blog CultureFinance
        </h1>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-text-secondary">
              Aucun article pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/blog/${article.slug.current}`}
                className="bg-bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.mainImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={urlFor(article.mainImage).url()}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-accent-primary text-black text-sm font-medium rounded-full">
                      {article.category}
                    </span>
                    <span className="text-text-secondary text-sm">
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary mb-3">
                    {article.title}
                  </h2>
                  <p className="text-text-secondary line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
