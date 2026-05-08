# KLSE Stock Quotes App

A modern full-stack React Router application for checking real-time stock quotes from the Kuala Lumpur Stock Exchange (KLSE).

## Features

- 🚀 Server-side rendering with React Router 7
- ⚡️ Hot Module Replacement (HMR) for fast development
- 📦 Real-time KLSE stock data fetching
- 🔍 Search functionality for Malaysian listed stocks
- 📱 Responsive design with TailwindCSS
- 🔒 TypeScript for type safety
- 📊 JSON API endpoint for programmatic access
- 🎯 SEO optimized with meta tags and OG properties

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Features & Routes

### Home Page (`/`)
- Search form to enter KLSE stock ticker
- Real-time stock details display
- Quick links to popular stocks (MAYBANK, CIMB, TENAGA, etc.)
- Responsive UI with error handling

### Stock API Endpoint (`/ticker/:exchangeTicker`)
- JSON endpoint for programmatic access
- Returns stock details in JSON format
- Example: `/ticker/MAYBANK` or `/ticker/KLSE:MAYBANK`

**Response Format:**
```json
{
  "name": "MALAYAN BANKING BHD",
  "ticker": "KLSE:MAYBANK",
  "lastPrice": 11.26,
  "todayChange": 0.36,
  "todayChangeValue": 0.04,
  "timestamp": "07/05/2026, 05:17:00 pm"
}
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Option 1: Docker Deployment

Build and run using Docker:

```bash
docker build -t klse-stock-quotes .

# Run the container
docker run -p 3000:3000 klse-stock-quotes
```

The containerized application can be deployed to:
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Option 2: Node.js Deployment

Deploy the output of `npm run build`:

```
build/
├── client/    # Static assets
└── server/    # Server-side code
```

Start the server:

```bash
npm run start
```

### Option 3: GitHub Pages Deployment (Static Export)

For hosting on GitHub Pages, you'll need to use static export mode. However, this app requires server-side functionality for the API endpoints.

**Recommended approach:**
1. Use Vercel or Netlify for automatic deployments (they support full-stack apps)
2. Or use a traditional Node.js host mentioned above

**For GitHub Pages with limited functionality:**
- Build: `npm run build`
- Deploy the `build/client` folder to GitHub Pages
- Note: API endpoints won't work without server-side rendering

## Project Structure

```
├── app/
│   ├── lib/
│   │   └── scraper.ts          # KLSE data scraper utility
│   ├── routes/
│   │   ├── home.tsx            # Home page with search form
│   │   └── ticker.$exchangeTicker.tsx  # API endpoint
│   ├── root.tsx                # Root layout with SEO meta
│   ├── routes.ts               # Route configuration
│   └── app.css                 # Global styles
├── public/                     # Static assets
├── build/                      # Build output (after npm run build)
├── Dockerfile                  # Docker configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

## API Reference

### GET `/ticker/:exchangeTicker`

Fetch stock details for a given ticker symbol.

**Parameters:**
- `exchangeTicker` (string, required): Stock ticker symbol (e.g., `MAYBANK`, `CIMB`, or `KLSE:MAYBANK`)

**Example Requests:**
```
GET /ticker/MAYBANK
GET /ticker/KLSE:MAYBANK
GET /ticker/CIMB
```

**Example Response:**
```json
{
  "name": "MALAYAN BANKING BHD",
  "ticker": "KLSE:MAYBANK",
  "lastPrice": 11.26,
  "todayChange": 0.36,
  "todayChangeValue": 0.04,
  "timestamp": "07/05/2026, 05:17:00 PM"
}
```

**Error Response:**
```json
{
  "error": "Failed to fetch stock data from KLSE"
}
```

## Data Source

Stock data is fetched from: `https://klse.i3investor.com/quoteservlet.jsp?sa=ss&q={ticker}`

The scraper extracts:
- Stock name/company name
- Last traded price
- Trading volume
- Current timestamp (Malaysia timezone)

## SEO Optimization

The app includes:
- Meta title and description tags
- Open Graph (OG) tags for social media sharing
- Twitter Card meta tags
- Keywords and author information
- Canonical URL tag
- Proper HTML semantics

## Styling

This template uses [Tailwind CSS](https://tailwindcss.com/) for styling with a modern, responsive design.

## Technologies Used

- **React Router 7** - Full-stack framework with SSR
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Vite** - Build tool and dev server
- **Node.js** - Server runtime

## Environment Variables

Currently, the app doesn't require environment variables for basic functionality. 

For production deployment, consider adding:
- `NODE_ENV` - Set to 'production' for production builds
- `PORT` - Server port (defaults to 3000)

## Troubleshooting

### Stock data not loading
- Verify the KLSE website is accessible (`https://klse.i3investor.com/`)
- Check if the ticker symbol is valid
- Review browser console for error messages

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (requires Node 18+)

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT

## Resources

- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Built with ❤️ for Malaysian stock market enthusiasts.
