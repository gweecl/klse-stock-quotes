# AGENTS.md

A simple, open format for guiding coding agents on the KLSE Stock Quotes project.

## Project Overview

KLSE Stock Quotes is a full-stack React Router 7 application that fetches real-time stock data from the Kuala Lumpur Stock Exchange (KLSE). It includes a web UI for searching stocks and a JSON API endpoint for programmatic access.

## Dev Environment Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to `https://klse.i3investor.com/` (for data scrapping)

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
# App available at http://localhost:5173
```

The dev server includes Hot Module Replacement (HMR) for fast feedback.

## Dev Environment Tips

- Use `npm run typecheck` frequently to catch TypeScript errors early
- Check browser DevTools Network tab when debugging stock data fetching
- The scraper validates HTML responses to ensure valid stock pages
- Malaysia timezone (Asia/Kuala_Lumpur) is used for timestamps
- Test with different KLSE tickers (MAYBANK, CIMB, TENAGA, etc.)

## Project Structure

```
app/
├── lib/
│   └── scraper.ts              # KLSE data scraper with validation
├── routes/
│   ├── home.tsx                # Home page with search UI
│   └── ticker.$exchangeTicker.tsx  # API endpoint
├── root.tsx                    # Root layout with SEO metadata
├── routes.ts                   # Route configuration
└── app.css                     # Tailwind CSS styles
```

### Key Files to Know

- **scraper.ts** - Handles HTML parsing and data extraction from KLSE
- **home.tsx** - React component with search form and results display
- **ticker.$exchangeTicker.tsx** - Server-side API endpoint handler
- **root.tsx** - SEO metadata and layout

## Testing Instructions

### Type Checking
```bash
npm run typecheck
```
Ensures all TypeScript types are correct. Must pass before committing.

### Building
```bash
npm run build
```
Creates production builds in the `build/` directory. Test this before deployment.

### Manual Testing

1. **Test valid tickers** - Search for MAYBANK, CIMB, TENAGA
2. **Test invalid tickers** - Try "PETRONAS", "INVALID", "ABC"
3. **Test API directly** - Visit `/ticker/MAYBANK` in the browser
4. **Check error handling** - Verify error messages display correctly

### Testing Checklist

- [ ] Form input styling is correct (text visible on white background)
- [ ] Valid stock tickers return correct data
- [ ] Invalid tickers show appropriate error messages
- [ ] Back button resets form state
- [ ] New Search button clears input
- [ ] API endpoint returns valid JSON
- [ ] Timestamp uses Malaysia timezone
- [ ] TypeScript types all pass

## Common Issues & Debugging

### Stock data returns "not found"

This typically means one of:
1. **Invalid ticker** - Check KLSE listing
2. **KLSE website down** - Try accessing it directly
3. **HTML parsing failed** - Check browser console for scraper errors
4. **Validation rejected the response** - Response didn't have enough stock indicators

Check the `isValidStockPage()` function in scraper.ts for validation rules.

### Build errors

Clear and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## PR Instructions

### Before Committing

1. Run `npm run typecheck` - All types must pass
2. Run `npm run build` - Production build must succeed
3. Test with multiple stock tickers
4. Verify error handling works
5. Check input/output styling

### Commit Message Format

```
[feature|fix|refactor|chore]: Brief description

- Detail 1
- Detail 2
```

### Example PR Workflow

```bash
# Create feature branch
git checkout -b fix/stock-data-parsing

# Make changes and test
npm run typecheck
npm run build

# Commit and push
git add .
git commit -m "fix: improve HTML parsing for stock data"
git push origin fix/stock-data-parsing
```

## Production Deployment

### Building for Production
```bash
npm run build
```
Output is in `build/` directory:
- `build/client/` - Static assets
- `build/server/` - Server-side code

### Running Production Build
```bash
npm run start
# Server runs on port 3000
```

### Deployment Options

1. **Docker** - Use existing Dockerfile
   ```bash
   docker build -t klse-stock-quotes .
   docker run -p 3000:3000 klse-stock-quotes
   ```

2. **Node.js Direct** - Any Node.js hosting (AWS EC2, VPS, etc.)

3. **Serverless** - Vercel, Netlify (recommended for ease)

## Architecture & Key Design Decisions

### Data Flow

1. User enters stock ticker in form
2. Form submission triggers fetch to `/ticker/{ticker}`
3. Server-side endpoint calls `fetchStockDetails()`
4. Scraper fetches HTML from KLSE i3investor
5. HTML response validated (`isValidStockPage()`)
6. Data extracted and parsed
7. JSON response returned to client
8. UI updates with stock details

### Validation Strategy

The scraper uses multi-layer validation:
1. **Page validation** - Checks if response is actual stock page (not search results)
2. **Data validation** - Ensures extracted price and volume are in reasonable ranges
3. **Parsing fallback** - Tries multiple HTML parsing strategies and JSON extraction

### Why Server-Side Scraping?

- Avoids CORS issues
- Hides scraper logic from client
- Allows flexible data transformation
- Server can cache responses (future enhancement)

## Performance Considerations

- Current implementation has minimal caching
- Consider adding 1-minute cache for stock data in future
- KLSE HTML parsing could be optimized with better patterns
- Consider rate limiting to avoid overwhelming KLSE servers

## Future Enhancements

1. **Caching layer** - Cache stock data for 1-5 minutes
2. **Stock charts** - Integrate Chart.js or D3.js
3. **Favorites** - Store user's favorite stocks
4. **Historical data** - Show price history
5. **Alerts** - Notify when stock price changes
6. **Database** - Persist search history or user data
7. **Additional APIs** - Add more data sources

## Resources

- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [KLSE Website](https://www.bursamalaysia.com/)
- [AGENTS.md Format](https://agents.md/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Tech Stack

- **React Router 7** - Full-stack framework with SSR
- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Tailwind CSS 4.2** - Styling
- **Vite 8** - Build tool
- **Node.js** - Server runtime
