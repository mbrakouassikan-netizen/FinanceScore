import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './sanity/schema';

export default defineConfig({
  projectId: 'sg7cvg19',
  dataset: 'production',
  title: 'CultureFinance Studio',
  basePath: '/studio',
  plugins: [structureTool()],
  schema,
});
