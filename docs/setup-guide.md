# Setup Guide

This guide will help you set up the project locally on your machine.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. We recommend the latest LTS version. You can check if you have it installed by running `node -v` in your terminal.
- **Git**: Required for cloning the repository.

## Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd portafolio-dani
    ```

2.  **Install dependencies**:
    This project uses `npm` to manage dependencies. Run the following command in the root directory:
    ```bash
    npm install
    ```

## Running the Project

### Development Server
To start the local development server with hot-reload:

```bash
npm run dev
```

The terminal will show the local URL (usually `http://localhost:5173/`). Open this in your browser to see the app.

### Production Build
To build the project for production:

```bash
npm run build
```

This will create a `dist/` directory with the compiled assets.

To preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

- **Dependency issues**: If you encounter errors during installation, try deleting `node_modules` and `package-lock.json`, then run `npm install` again.
- **Port already in use**: If port 5173 is busy, Vite will automatically try the next available port. Check the terminal output for the correct URL.
