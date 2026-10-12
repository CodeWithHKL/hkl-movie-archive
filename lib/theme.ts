// Muted, desaturated genre palette shared by the table and charts.
export const GENRE_COLORS: Record<string, string> = {
  'Sci-Fi': '#7aa2c9',
  'Crime': '#c47a72',
  'Thriller': '#a58bc4',
  'Action': '#d09a62',
  'Drama': '#7fb095',
  'War': '#c4b266',
  'Romance': '#c98aa5',
  'Horror': '#8c9099',
  'Animation': '#6fb3b8',
  'Comedy': '#d8d3c4',
  'History': '#b08d5b',
};

export const genreColor = (genre: string) => GENRE_COLORS[genre] ?? '#8c8a82';

// Ratings read as plain numerals; only the top tier gets the accent.
export const ratingClass = (rating: number) =>
  rating >= 9 ? 'text-accent' : rating >= 8 ? 'text-ink' : rating >= 7 ? 'text-ink-soft' : 'text-ink-faint';
