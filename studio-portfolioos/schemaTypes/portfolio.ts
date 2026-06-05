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
    defineField({
      name: 'projectTitle',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectCategory',
      title: 'Project Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectSummary',
      title: 'Project Short Summary',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectDescription',
      title: 'Project Detailed Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectStack',
      title: 'Project Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectGithub',
      title: 'Project GitHub Link',
      type: 'url',
    }),
    defineField({
      name: 'projectDemo',
      title: 'Project Live Demo Link',
      type: 'url',
    }),
    defineField({
      name: 'projectImage',
      title: 'Project Screenshot Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});
