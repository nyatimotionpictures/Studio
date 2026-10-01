/**
 * Public origin of the consumer app, used to build shareable film links.
 * The consumer app already routes /film/:id and /series/:id, and the api
 * accepts a slug in that position, so a slug link needs no new public route.
 */
export const PUBLIC_APP_URL = 'https://stream.nyatimotionpictures.com';

/**
 * @name buildShareLink
 * @description Build the public url for a film. Movies live under /film, series
 * under /series, matching the consumer app's route table.
 * @param {{slug?: string, type?: string}} film
 * @returns {string} the public url, or an empty string when there is no slug yet
 */
export const buildShareLink = (film) => {
  if (!film?.slug) return '';

  const segment =
    film?.type === 'series' || film?.type?.toLowerCase?.().includes('series')
      ? 'series'
      : 'film';

  return `${PUBLIC_APP_URL}/${segment}/${film.slug}`;
};
