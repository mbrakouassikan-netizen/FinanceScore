import client from './sanity';

export interface Article {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  category: string;
  excerpt: string;
  mainImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  body?: any[];
  estimatedReadingTime?: number;
}

export const getAllArticles = async (): Promise<Article[]> => {
  const query = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  category,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
}`;
  return await client.fetch(query);
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  const query = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  category,
  excerpt,
  mainImage,
  body,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
}`;
  return await client.fetch(query, { slug });
};
