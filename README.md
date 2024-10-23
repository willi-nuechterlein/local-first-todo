# Local-First To-Do App

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

For local first approach:
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via [idb](https://www.npmjs.com/package/idb))
- [ElectricSQL](https://electric-sql.com/)
- [PGlite](https://pglite.dev/)

## Getting Started
To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm run dev
   ```
4. Open [http://localhost:3001](http://localhost:3001) in your browser (Port 3000 is used for Electric Sync Engine)

## Examples (see other branches)

- `main`: Basic example using IndexedDB wrapper (idb)
- `electric-sql`: Implementation using ElectricSQL for local-first sync and PGlite as local db
- `electric-sql-write`: Implementation using ElectricSQL for local-first sync and PGlite as local db (+ write operations via API route)

Each branch demonstrates a different approach to local-first data storage and synchronization:

1. `main`: Uses IndexedDB (via idb wrapper) for simple local storage without sync capabilities.
2. `electric-sql`: Implements ElectricSQL for local-first architecture with PostgreSQL compatibility and sync features (no write sync)
3. `electric-sql-write`: Adds a workaround for missing write sync. Write data to remote db via API routes

To explore these examples, switch to the respective branch and follow the setup instructions in the README.


Built with ❤️ and 🤖 using shadcn, claude, cursor
