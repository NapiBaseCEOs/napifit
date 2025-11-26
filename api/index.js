// Vercel serverless function for API server
const app = require('../api-server/dist/server.js').default || require('../api-server/dist/server.js');
module.exports = app;

