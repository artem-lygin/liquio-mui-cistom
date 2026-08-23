# How-To: Run Liquio Locally (Docker Compose)

Quick reference so you don't have to dig through CONTRIBUTING.md every time.

## 1. Prerequisites

- Docker + Docker Compose
- `jq`
- `openssl`

## 2. First-time setup

```bash
./scripts/init.sh          # generates ./config and .env from templates + certs
docker compose up -d       # brings up the full stack
```

- `./scripts/init.sh` refuses to run if `./config` already exists.
  To regenerate everything from scratch: `./scripts/init.sh -f` (or `--force`).
- Give it a minute after `docker compose up -d` for all services to become healthy:
  `docker compose ps` / `docker compose logs -f <service>`.

## 3. URLs

| App | URL | Notes |
|---|---|---|
| **Admin panel** | http://localhost:8082 | back-office / workflow designer |
| **Cabinet** | http://localhost:8081 | citizen/business personal cabinet |
| id-front (SSO/login) | http://localhost:8080 | you're bounced here to log in, then redirected back |
| admin-api | http://localhost:8102 | |
| cabinet-api | http://localhost:8101 | |
| id-api | http://localhost:8100 | |
| register | http://localhost:8103 | internal |
| external-reader | http://localhost:8104 | internal |
| filestorage | http://localhost:8105 | internal |
| pdf-generator | http://localhost:7007 | internal |

(Full port list is assigned in `scripts/init.sh` → written to `.env`.)

## 4. Login credentials

Login is via a **`.p12` private-key file signed in the browser** — not a username/password, and not an OS/browser-native certificate picker. No import into macOS Keychain or Chrome's certificate settings is needed; the login page has its own file-select + password form and does the signing client-side in JavaScript.

| User | File | Password |
|---|---|---|
| Admin | `config/admin.p12` | `admin` |
| Demo citizen | `config/demo.p12` | `demo` |

**How to log in:**
1. Navigate to the app URL (8082 for admin, 8081 for cabinet). It redirects to id-front (`localhost:8080`).
2. On the login screen, click **"Personal key"**.
3. In the form that appears:
   - **"File key"** — choose `config/admin.p12` (or `demo.p12`) from this repo.
   - **"Password"** — enter `admin` (or `demo`).
4. Click **"Sign"**. It signs a challenge in-browser and redirects you back in, authenticated.
5. **Log out before switching users** — admin and cabinet use separate keys/sessions.

**Need more test users?**
```bash
./scripts/generate-user.sh --first-name "Jane" --last-name "Doe" \
  --serial-number "1234567890" --password "jane" --output jane.p12
```
Full options: `./scripts/generate-user.sh --help`. Generated files land in `config/`.

## 5. Loading example content (registries + a real workflow)

The stack starts empty. To get an actual form/process to look at:

1. Log into **admin** (8082).
2. Go to **Registry** → http://localhost:8082/registry → **Import**:
   - `examples/register-100-100.dat` (students)
   - `examples/register-100-101.dat` (institutions)
   - `examples/register-100-102.dat` (groups)
3. Go to **Workflow** → http://localhost:8082/workflow → **Import** → `examples/workflow-1000.bpmn` (continue past the validation step).
4. Open the imported workflow: http://localhost:8082/workflow/1000
5. Log out, log into **cabinet** (8081) with the demo key.
6. Click **"Order a service"** → **"Student editing"** to see a live schema-driven form.

## 6. Running the Playwright test suite

```bash
cd test
npm run test          # headless
npm run test:headed   # see the browser
npm run test:ui       # Playwright UI mode
```

## 7. Running a frontend standalone (for fast UI iteration)

Instead of rebuilding the Docker image every time you tweak the UI, run the React app directly against the already-running backend from Compose:

```bash
cd components/admin-front     # or components/cabinet-front
npm install
npm start                     # craco start — hot reload, opens on :3000 by default
```
Point it at the Compose backend by editing `config-templates/admin-front/config.json` (or `cabinet-front/config.json`) `backendUrl` — it already defaults to `http://localhost:8102` / `:8101`, matching Compose.

## 8. Troubleshooting

- **Ports already in use**: check nothing else is bound to 8080–8105 / 7007 / 5432 / 5672, or edit `.env` after `init.sh` runs and re-run `docker compose up -d`.
- **`config` already exists**: `./scripts/init.sh -f` to wipe and regenerate (also deletes `.env` — you'll need to re-import certs).
- **"Invalid password" on the key form**: double-check you typed the file's password (`admin`/`demo`), not your Mac login password — this form has nothing to do with OS/browser certificate stores.
