import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Budget', value: 'Budget' },
          { title: 'Investissement', value: 'Investissement' },
          { title: 'Arnaque', value: 'Arnaque' },
          { title: 'Diaspora', value: 'Diaspora' },
          { title: 'Crédit', value: 'Crédit' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      description: 'Résumé affiché dans la liste des articles',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'body',
      title: 'Corps de l\'article',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
