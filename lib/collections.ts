// lib/collections.ts
import { mockMovies, Movie } from './data';

export interface Collection {
  title: string;
  description: string;
  movies: Movie[]; // Hardcoded list
}

export const BEST_PICKS_COLLECTIONS: Collection[] = [
  {
    title: "All-Time Favorites",
    description: "My personal best of the best.",
    movies: mockMovies.filter(m => m.id === '152' || m.id === '69' || m.id === '51' || m.id === '93') // Add your specific IDs here
  },
  {
    title: "Action Masterpiece",
    description: "Movies I rated significantly higher than the public.",
    movies: mockMovies.filter(m => m.id === '93' || m.id === '156')
  },
  {
    title: "Visual Elite",
    description: "Movies visual that are ahead of it's time.",
    movies: mockMovies.filter(m => m.id === '135' || m.id === '136' || m.id === '99' || m.id === '31' || m.id === '152' )
  },
  {
    title: "Storyline Genius",
    description: "The best adrenaline-fueled favorites.",
    movies: mockMovies.filter(m => m.id === '203' || m.id === '140' || m.id === '117' || m.id === '104' || m.id === '74')
  },
  {
    title: "Impactful",
    description: "The best adrenaline-fueled favorites.",
    movies: mockMovies.filter(m => m.id === '204' || m.id === '120' || m.id === '91' || m.id === '100' || m.id === '119')
  },
  {
    title: "Underrated",
    description: "Movies I rated significantly higher than the public.",
    movies: mockMovies.filter(m => m.id === '8' || m.id === '14' || m.id === '99')
  }
];