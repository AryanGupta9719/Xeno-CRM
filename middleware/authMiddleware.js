const API_KEY = process.env.API_KEY || 'your-secret-api-key-123';

const authMiddleware = (req, res, next) => {
  // Check for API key in query parameters or headers
  const apiKey = req.query.apiKey || req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required'
    });
  }

  if (apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  // If API key is valid, proceed to the next middleware/route handler
  next();
};

module.exports = authMiddleware; 