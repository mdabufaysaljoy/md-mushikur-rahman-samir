import { Router } from 'express';
import slugify from 'slugify';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

/**
 * Builds a REST resource: public GET list/detail, authenticated write routes.
 */
export function crudRouter(repository, { slugField = false, defaultSort = { order: 1 } } = {}) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const filter = {};
      for (const key of ['type', 'group', 'featured', 'published']) {
        if (req.query[key] !== undefined) {
          filter[key] = req.query[key] === 'true' ? true : req.query[key] === 'false' ? false : req.query[key];
        }
      }
      res.json({ data: await repository.list(filter, defaultSort) });
    })
  );

  router.get(
    '/:idOrSlug',
    asyncHandler(async (req, res) => {
      const { idOrSlug } = req.params;
      const doc = (slugField ? await repository.findOne({ slug: idOrSlug }) : null) || (await repository.findById(idOrSlug));
      if (!doc) return res.status(404).json({ error: { code: 'not_found', message: 'Not found' } });
      res.json({ data: doc });
    })
  );

  router.post(
    '/',
    requireAuth,
    asyncHandler(async (req, res) => {
      const payload = { ...req.body };
      if (slugField && !payload.slug && payload.title) payload.slug = slugify(payload.title, { lower: true, strict: true });
      res.status(201).json({ data: await repository.create(payload) });
    })
  );

  router.put(
    '/:id',
    requireAuth,
    asyncHandler(async (req, res) => {
      const payload = { ...req.body };
      delete payload._id;
      if (slugField && payload.slug) payload.slug = slugify(payload.slug, { lower: true, strict: true });
      const doc = await repository.update(req.params.id, payload);
      if (!doc) return res.status(404).json({ error: { code: 'not_found', message: 'Not found' } });
      res.json({ data: doc });
    })
  );

  router.delete(
    '/:id',
    requireAuth,
    asyncHandler(async (req, res) => {
      const doc = await repository.remove(req.params.id);
      if (!doc) return res.status(404).json({ error: { code: 'not_found', message: 'Not found' } });
      res.json({ data: { _id: req.params.id, deleted: true } });
    })
  );

  return router;
}
