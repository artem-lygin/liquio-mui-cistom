# register

Registry / reference-data storage service: structured records, search,
import/export. See the full system context in
[ARCHITECTURE.md](../../ARCHITECTURE.md).

## Development

```bash
npm install

# run against TypeScript sources
npm run start:ts
npm run start:dev

# run compiled build
npm run build && npm start

# lint
npm run lint
npm run lint:fix

# tests
npm test
npm run test:e2e

# database migrations
npm run migration-up
npm run migration-clear
npm run migration-generate --name <name>
```

## Service dependencies

From the [C4 diagram](../../ARCHITECTURE.md#c4-container-diagram):

- `admin-api` → `register` (proxies)
- `task` → `register` (reads/writes records)
- `event` → `register` (uses)
- `register` → `sign-tool` (signs)
- `register` → PostgreSQL (`register` database)
