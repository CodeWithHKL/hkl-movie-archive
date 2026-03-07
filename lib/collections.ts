// lib/collections.ts
import { mockMovies, Movie } from './data';

export interface Collection {
  title: string;
  description: string;
  movies: Movie[]; // Hardcoded list
}

export const BEST_PICKS_COLLECTIONS: Collection[] = [
  {
    title: "Masterpieces",
    description: "My personal 10/10 perfect scores.",
    movies: mockMovies.filter(m => m.id === '1' || m.id === '5' || m.id === '12') // Add your specific IDs here
  },
  {
    title: "Hidden Gems",
    description: "Movies I rated significantly higher than the public.",
    movies: mockMovies.filter(m => m.id === '22' || m.id === '45')
  },
  {
    title: "Top Action Picks",
    description: "The best adrenaline-fueled favorites.",
    movies: mockMovies.filter(m => m.id === '8' || m.id === '14' || m.id === '99')
  }
];