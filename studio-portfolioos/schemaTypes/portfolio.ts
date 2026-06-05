import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'portfolio',
  title: 'Portfolio Content',
  type: 'document',
  fields: [
    defineField({
      name: 'heroName',
      title: 'Hero Developer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Subtitle Tagline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroBio',
      title: 'Hero Bio Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
  ],
});
