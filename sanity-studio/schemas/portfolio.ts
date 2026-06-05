export default {
  name: 'portfolio',
  title: 'Portfolio Content',
  type: 'document',
  fields: [
    {
      name: 'heroName',
      title: 'Hero Developer Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroTitle',
      title: 'Hero Subtitle Tagline',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroBio',
      title: 'Hero Bio Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'projectTitle',
      title: 'Project Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'projectCategory',
      title: 'Project Category',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'projectSummary',
      title: 'Project Short Summary',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'projectDescription',
      title: 'Project Detailed Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'projectStack',
      title: 'Project Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'projectGithub',
      title: 'Project GitHub Link',
      type: 'url',
    },
    {
      name: 'projectDemo',
      title: 'Project Live Demo Link',
      type: 'url',
    },
    {
      name: 'projectImage',
      title: 'Project Screenshot Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};
