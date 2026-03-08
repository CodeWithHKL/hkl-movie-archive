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
    movies: getMoviesByIds(['152', '69', '51', '93'])
  },
  {
    title: "Action Masterpiece",
    description: "Movies I rated significantly higher than the public.",
    movies: getMoviesByIds(['93', '156'])
  },
  {
    title: "Visual Elite",
    description: "Movies visual that are ahead of it's time.",
    movies: getMoviesByIds(['135', '136', '99', '31', '152'])
  },
  {
    title: "Storyline Genius",
    description: "The best adrenaline-fueled favorites.",
    movies: getMoviesByIds(['203', '140', '117', '104', '74'])
  },
  {
    title: "Impactful",
    description: "The best adrenaline-fueled favorites.",
    movies: getMoviesByIds(['204', '120', '91', '100', '119'])
  },
  {
    title: "Underrated",
    description: "Movies I rated significantly higher than the public.",
    movies: getMoviesByIds(['8', '14', '99'])
  }
];