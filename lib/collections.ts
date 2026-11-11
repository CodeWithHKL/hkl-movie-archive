// lib/collections.ts
import { mockMovies, Movie } from './data';

export interface Collection {
  title: string;
  description: string;
  color: string; // accent used to tell collections apart on the page
  movies: Movie[]; // Hardcoded list
}

const getMoviesByIds = (ids: string[]) => 
  ids.map(id => mockMovies.find(m => m.id === id)).filter((m): m is Movie => !!m);

export const BEST_PICKS_COLLECTIONS: Collection[] = [
  {
    title: "All-Time Favorites",
    color: "#e5b567",
    description: "My personal best of the best.",
    movies: getMoviesByIds(['152', '69', '93', '203'])
  },
  {
    title: "Action Masterpiece",
    color: "#d9695f",
    description: "Peak action choreography and intense thriller.",
    movies: getMoviesByIds(['72', '156', '150', '177', '170'])
  },
  {
    title: "Visual Elite",
    color: "#a58bc4",
    description: "Movies that I truly admire their visual and graphics quality.",
    movies: getMoviesByIds(['135', '136', '191', '31', '152'])
  },
  {
    title: "Storyline Genius",
    color: "#6fb3b8",
    description: "High-level premise, plot, and storyline crafting that is very smart.",
    movies: getMoviesByIds(['203', '140', '51', '104', '74'])
  },
  {
    title: "Impactful",
    color: "#c98aa5",
    description: "Stories that leave a lasting impression, provoke thought, and inspire change.",
    movies: getMoviesByIds(['204', '120', '117', '100', '20'])
  },
  {
    title: "Underrated",
    color: "#7fb095",
    description: "Movies I rated significantly higher than the public.",
    movies: getMoviesByIds(['216', '73', '197', '19', '145'])
  }
];