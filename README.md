# Service Dog Standards

A modern frontend built with **Vue 3** and **Vite**

### Requirements

- **Node.js 18+** (recommended)
- **npm** installed

## install dependencies

```
npm install
```

### Run the development server

```
npm run dev
```

### Build for Production

This generates a dist directory with minified and optimized files ready for deployment.

```
npm run build
```

### Lint and format files

To check for linting issues and format files according to project guidelines:

```
npm run lint:format
```

## Environment Variables

Create a `.env` file in the root directory and define the necessary variables.  
Refer to `.env.example` for the required structure and values.
Ensure sensitive keys are not committed by adding .env to .gitignore.

## Dependencies

Some key dependencies used in this project:

- **Vue 3** – Progressive frontend framework.
- **Vue Router** – Official router for Vue.js.
- **Pinia** – Lightweight and modular state management.
- **Axios** – Promise-based HTTP client for making API requests.
- **Vite SVG Loader** – Load and optimize SVG files as Vue components.
- **Vite** – Fast build tool and development server.
- **ESLint** – Linter to enforce code quality.
- **Prettier** – Code formatter.
- **Sass** – CSS preprocessor for styling.

## Deployment

Run npm run build to generate production files.
Upload the dist/ directory to your hosting provider.
After the build is complete, navigate to the dist/ directory and create a file named `.htaccess` with the following content:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Project Structure

### `src/`

This directory contains the main source code of the project.

### `assets/`

Static assets such as images, fonts, and global styles.

### `components/`

The components directory holds reusable Vue.js components, which serve as building blocks for your application. These components can be used across pages, layouts, and even within other components to maintain a modular and organized structure.

### `plugins/`

The plugins directory contains JavaScript plugins that should run before initializing the root Vue.js application.

### `router/`

Application routing configuration.

### `store/`

Pinia store definitions for state management.

### `views/`

Vue Router page components.

Read the official Vite Documentation [Vite Documentation](https://vite.dev/).

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
