/**
 * Public origin of the consumer app, used to build shareable links.
 * The consumer app already routes every id position through the api, which
 * resolves an ObjectId or a slug, so a slug link needs no new public route.
 */
export const PUBLIC_APP_URL = 'https://stream.nyatimotionpictures.com';

/**
 * @name buildShareLink
 * @description Build the public url for a record, matching the consumer app's
 * route table.
 *
 *  - a feature film lives under /film, a series under /series
 *  - a season is called a "segment" publicly, /segments/:id
 *  - an episode has no page of its own, it opens as a modal on its season page,
 *    so the link carries the season in the path and the episode as ?ep=
 *
 * @param {{slug?: string, type?: string}} resource the record being shared
 * @param {{seasonSlug?: string}} [parents] slug of the parent season, only used
 *   for episodes
 * @returns {string} the public url, or an empty string when required slugs are
 *   missing so a half built link is never copied
 */
export const buildShareLink = (resource, parents = {}) => {
  const slug = resource?.slug;
  if (!slug) return '';

  const type = String(resource?.type ?? '').toLowerCase();

  if (type.includes('season') || type.includes('segment')) {
    return `${PUBLIC_APP_URL}/segments/${slug}`;
  }

  if (type.includes('episode')) {
    // the season page already has the episode list, so only the season is
    // needed to resolve it
    if (!parents.seasonSlug) return '';
    return `${PUBLIC_APP_URL}/segments/${parents.seasonSlug}?ep=${slug}`;
  }

  const segment = type.includes('series') ? 'series' : 'film';
  return `${PUBLIC_APP_URL}/${segment}/${slug}`;
};
