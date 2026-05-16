import { getArticleBySlug } from '@/lib/sanity.queries';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-bg-primary py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-text-primary mb-8">
            Article non trouvé
          </h1>
          <Link
            href="/blog"
            className="text-accent-primary hover:underline"
          >
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-accent-primary hover:underline mb-8"
        >
          ← Retour au blog
        </Link>

        {article.mainImage && (
          <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlFor(article.mainImage).url()}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-accent-primary text-black text-sm font-medium rounded-full">
            {article.category}
          </span>
          <span className="text-text-secondary text-sm">
            {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-6">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-text-secondary mb-8">
            {article.excerpt}
          </p>
        )}

        {article.body && (
          <div className="prose prose-lg max-w-none text-text-primary">
            <PortableText value={article.body} />
          </div>
        )}
      </div>
    </div>
  );
}
