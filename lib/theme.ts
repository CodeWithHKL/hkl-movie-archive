// Muted genre palette shared by the table and charts. Values are CSS variables
// (defined per theme in globals.css) so light mode gets darker, higher-contrast tones.
export const GENRE_COLORS: Record<string, string> = {
  'Sci-Fi': 'var(--genre-sci-fi)',
  'Crime': 'var(--genre-crime)',
  'Thriller': 'var(--genre-thriller)',
  'Action': 'var(--genre-action)',
  'Drama': 'var(--genre-drama)',
  'War': 'var(--genre-war)',
  'Romance': 'var(--genre-romance)',
  'Horror': 'var(--genre-horror)',
  'Animation': 'var(--genre-animation)',
  'Comedy': 'var(--genre-comedy)',
  'History': 'var(--genre-history)',
};

export const genreColor = (genre: string) => GENRE_COLORS[genre] ?? 'var(--genre-other)';

// Ratings read as plain numerals; only the top tier gets the accent.
export const ratingClass = (rating: number) =>
  rating >= 9 ? 'text-accent' : rating >= 8 ? 'text-ink' : rating >= 7 ? 'text-ink-soft' : 'text-ink-faint';
