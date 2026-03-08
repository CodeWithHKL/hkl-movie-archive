// lib/collections.ts
import { mockMovies, Movie } from './data';

export interface Collection {
  title: string;
  description: string;
  movies: Movie[]; // Hardcoded list
}

const getMoviesByIds = (ids: string[]) => 
  ids.map(id => mockMovies.find(m => m.id === id)).filter((m): m is Movie => !!m);

export const BEST_PICKS_COLLECTIONS: Collection[] = [
  {
    title: "All-Time Favorites",
    description: "My personal best of the best.",
    movies: getMoviesByIds(['152', '69', '93', '203'])
  },
  {
    title: "Action Masterpiece",
    description: "Peak action choreography and intense thriller.",
    movies: getMoviesByIds(['72', '156', '150', '177', '170'])
  },
  {
    title: "Visual Elite",
    description: "Movies that I truly admire their visual and graphics quality.",
    movies: getMoviesByIds(['135', '136', '191', '31', '152'])
  },
  {
    title: "Storyline Genius",
    description: "High-level premise, plot, and storyline crafting that is very smart.",
    movies: getMoviesByIds(['203', '140', '51', '104', '74'])
  },
  {
    title: "Impactful",
    description: "Stories that leave a lasting impression, provoke thought, and inspire change.",
    movies: getMoviesByIds(['204', '120', '117', '100', '20'])
  },
  {
    title: "Underrated",
    description: "Movies I rated significantly higher than the public.",
    movies: getMoviesByIds(['112', '73', '197', '19', '145'])
  }
];