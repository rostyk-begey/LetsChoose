import * as withSass from '@zeit/next-sass';
import * as withPlugins from 'next-compose-plugins';
import * as withOptimizedImages from 'next-optimized-images';

export default withPlugins([
  [
    withSass({
      cssModules: true,
    }),
  ],
  [withOptimizedImages],
]);
