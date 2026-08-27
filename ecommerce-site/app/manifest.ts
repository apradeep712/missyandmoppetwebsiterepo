import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Missy & Moppet | The Pastel World',
    short_name: 'Missy & Moppet',
    description: 'Artistic and minimal luxury clothing for your little ones.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdf7f2',
    theme_color: '#fdf7f2',
    icons: [
      {
        src: '/hero/logomain.png?v=1',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
