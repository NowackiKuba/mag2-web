export const factorUrl = (source: string): string => {
  const BASE = 'http://localhost:3000/api/v1';
  switch (source) {
    case 'ERLI':
      return BASE + '/erli';
    case 'ALLEGRO':
      return BASE + '/allegro';
    default:
      return BASE;
  }
};
