import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity-studio/schemas';

export default defineConfig({
  name: 'default',
  title: 'Samyak Jain Portfolio Studio',

  projectId: process.env.VITE_SANITY_PROJECT_ID || 'dummy_project_id',
  dataset: process.env.VITE_SANITY_DATASET || 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
