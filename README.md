# NsNxDemo

A full-stack application built with Nx, Next.js (frontend), and NestJS (backend).

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Installation

1. Create a new Nx workspace:
```bash
npx create-nx-workspace@latest ns-nx-demo
# Select the following options:
# - What to create in the new workspace: empty
# - Package manager: npm
```

2. Navigate to the workspace:
```bash
cd ns-nx-demo
```

3. Install Nx and required plugins:
```bash
npm install --save-dev @nx/next@latest
npm install --save-dev @nx/next
npm install --save-dev @nx/nest
```

4. Create the frontend application:
```bash
npx nx generate @nx/next:app frontend
# Select the following options:
# - Unit test runner: none
# - E2E test runner: playwright
# - App Router: false
# - src/ directory: false
```

5. Create the backend application:
```bash
npx nx generate @nx/nest:app backend
```

## Development

### Running the Frontend
From the project root:
```bash
npx nx start frontend -p 3001
```
The frontend will be available at http://localhost:3001

### Running the Backend
From the project root:
```bash
npx nx serve backend
```
The backend will be available at http://localhost:3000

## Deployment (Render.com)

### Backend Deployment
Build command:
```bash
npm install; cd backend; npx nx build --prod
```

Start command:
```bash
npx nx serve --prod
```

### Frontend Deployment
Build command:
```bash
npm install; cd frontend; npx next build
```

Start command:
```bash
cd frontend; npx next start -p $PORT
```

## Project Structure

- `frontend/` - Next.js frontend application
  - `pages/` - Next.js pages
  - `public/` - Static assets
  - `next.config.js` - Next.js configuration

- `backend/` - NestJS backend application
  - `src/` - Source code
    - `app/` - Main application code
    - `main.ts` - Application entry point

## Development Tips

1. The frontend and backend can be run simultaneously in different terminal windows
2. Frontend development server supports hot reloading
3. Backend development server supports hot reloading
4. Use `npx nx graph` to visualize the project dependencies

## Useful Commands

- Build frontend: `npx nx build frontend`
- Build backend: `npx nx build backend`
- Test frontend: `npx nx test frontend`
- Test backend: `npx nx test backend`
- Lint frontend: `npx nx lint frontend`
- Lint backend: `npx nx lint backend`

## Learn More

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
