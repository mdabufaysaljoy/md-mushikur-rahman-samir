export function notFound(req, res) {
  res.status(404).json({ error: { code: 'not_found', message: `No route for ${req.method} ${req.originalUrl}` } });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error('[api]', err);
  res.status(status).json({
    error: {
      code: err.code || 'server_error',
      message: err.message || 'Something went wrong',
      details: err.details,
    },
  });
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
