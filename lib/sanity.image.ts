import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
  projectId: 'sg7cvg19',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export const urlFor = (source: any) => {
  return imageUrlBuilder(client).image(source);
};
