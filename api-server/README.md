# NapiFit API Server

A standalone Express.js API server for the NapiFit Android native application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Fill in your environment variables in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Allowed CORS origin (default: "*")

## Development

Run the development server:
```bash
npm run dev
```

## Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
All endpoints (except `/health`) require authentication via `Authorization: Bearer <token>` header.

### Endpoints

- `GET /health` - Health check
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/meals` - List meals
- `POST /api/meals` - Create meal
- `GET /api/workouts` - List workouts
- `POST /api/workouts` - Create workout
- `GET /api/water-intake` - Get water intake
- `POST /api/water-intake` - Add water intake
- `GET /api/health-metrics` - List health metrics
- `POST /api/health-metrics` - Create health metric
- `GET /api/feature-requests` - List feature requests
- `POST /api/feature-requests` - Create feature request
- `POST /api/feature-requests/:id/like` - Like/unlike feature request
- `POST /api/feature-requests/:id/dislike` - Dislike/undislike feature request
- `GET /api/feature-requests/leaderboard` - Get leaderboard

## Deployment

This server can be deployed to:
- Railway
- Render
- Heroku
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Azure

Make sure to set all environment variables in your deployment platform.

