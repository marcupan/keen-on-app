# KeenOn Card Generate – Frontend

**KeenOn Card Generate** is a **study project** that explores microservice architecture, featuring a **Next.js frontend** for interacting with the backend services.

## Overview

This frontend provides a **user-friendly interface** for generating and managing Chinese learning cards. It connects to the **backend API (Node.js)**, which orchestrates:
- **Translation Service (Python)** – Generates translations.
- **Image Composition Service (Rust)** – Creates visuals.

## Key Features
- **Next.js** for fast, server-side rendering and API handling.
- **REST API Integration** to interact with the backend.
- **Interactive UI** for seamless card generation.
- **Modern UI/UX** focused on simplicity and usability.

## Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- pnpm (v10 or higher)
- Access to the backend API services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/orchestrator-repo.git
   cd orchestrator-repo/frontend/keen-on-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # Create a .env.local file
   touch .env.local

   # Add the following variables (adjust as needed)
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development Workflow

1. Make changes to the codebase
2. Run linting:
   ```bash
   pnpm lint
   ```
3. Format code:
   ```bash
   pnpm format # If available, or use Prettier directly
   ```
4. Build for production:
   ```bash
   pnpm build
   ```

## Project Structure

```
keen-on-app/
├── app/                # Next.js app directory (pages, layouts)
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and shared logic
├── public/             # Static assets
├── types/              # TypeScript type definitions
└── validations/        # Form and data validation schemas
```

## API Integration

The frontend communicates with the backend API using fetch or a similar HTTP client. The main endpoints include:

- `/api/auth/*` - Authentication endpoints
- `/api/cards/*` - Card management endpoints
- `/api/folders/*` - Folder organization endpoints

## Deployment

### Production Deployment

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

For containerized deployment:

```bash
# Build the Docker image
docker build -t keenon-frontend:latest .

# Run the container
docker run -p 3000:3000 keenon-frontend:latest
```

## Technologies Used
- **Next.js**: Frontend framework.
- **React**: Component-based UI.
- **Tailwind CSS**: Styling.
- **TypeScript**: Type-safe development.
- **TanStack React Query**: Data fetching and state management.
- **TanStack React Form**: Form handling.
- **Zod**: Schema validation.

---

> **Note:** This frontend is a learning project, demonstrating my progress in full-stack development.
