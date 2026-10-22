# Chess AI Search Lab: local setup

The demo uses two repositories and two local servers:

| Part | Repository | Default address |
| --- | --- | --- |
| Next.js frontend and 2D/3D board | [`3d-chess`](https://github.com/joshwrn/3d-chess) | `http://localhost:3000/demo` |
| Python search API | [`hw2_introAI`](https://github.com/HatakekkSheeshh/hw2_introAI) | `http://127.0.0.1:8000` |

The repositories are separate. Clone both into the same parent directory so the quick-start commands below work:

```sh
mkdir introai-chess-demo
cd introai-chess-demo
git clone https://github.com/joshwrn/3d-chess.git
git clone https://github.com/HatakekkSheeshh/hw2_introAI.git
```

## Prerequisites

- Node.js 18.17 or newer
- Corepack (bundled with supported Node.js releases) and Yarn 1.22.22, selected through the `packageManager` field
- Python 3.10 or newer
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- Git

Check the installed tools with:

```sh
node --version
corepack --version
python --version
uv --version
```

If Corepack is not enabled, run `corepack enable` once. On Windows, use PowerShell or a shell with Git installed.

## Start the backend

Open a terminal in `hw2_introAI`:

```sh
cd introai-chess-demo/hw2_introAI
uv sync
uv run chess-ai serve --host 127.0.0.1 --port 8000
```

`uv sync` creates the project environment and installs the versions pinned in `uv.lock`. Keep this terminal open. The server prints its address when ready.

## Start the frontend

Open a second terminal in `3d-chess`:

```sh
cd introai-chess-demo/3d-chess
corepack yarn install
yarn dev
```

The install command uses the committed `yarn.lock` and the Yarn version pinned in `package.json`. The `predev` script generates the ignored Tailwind stylesheet before Next.js starts; no separate CSS generation step is needed.

Open [http://localhost:3000/demo](http://localhost:3000/demo). Use **Bước tiếp** to advance one search move or **Tự động** to let the two selected agents play. The original multiplayer game remains available at [http://localhost:3000/](http://localhost:3000/).

## Build and run the frontend for production

Keep the backend running, then use a frontend terminal:

```sh
cd introai-chess-demo/3d-chess
corepack yarn install
yarn build
yarn start
```

The production frontend listens on port `3000` by default and still proxies the demo API to the backend.

## Backend URL and ports

The frontend proxies `/api/*` requests to `http://127.0.0.1:8000` by default. To run the backend on another address, start it with a matching host and port, then set `CHESS_AI_API_URL` before starting Next.js. Next.js reads this setting at startup, so restart the frontend after changing it.

PowerShell:

```powershell
# Backend terminal
uv run chess-ai serve --host 127.0.0.1 --port 8001

# Frontend terminal
$env:CHESS_AI_API_URL = "http://127.0.0.1:8001"
yarn dev
```

macOS/Linux:

```sh
# Backend terminal
uv run chess-ai serve --host 127.0.0.1 --port 8001

# Frontend terminal
CHESS_AI_API_URL=http://127.0.0.1:8001 yarn dev
```

If port `3000` is in use, Next.js will offer another frontend port. If the backend is unavailable, the page still loads but AI requests show a connection error. Confirm both servers are running and the configured API URL matches the backend address.

## Troubleshooting

### Demo page reports that it cannot connect to the AI server

Confirm `uv run chess-ai serve --host 127.0.0.1 --port 8000` is still running. Open `http://127.0.0.1:8000/api/config` directly; it should return the available agents as JSON. Restart `yarn dev` if you changed `CHESS_AI_API_URL`.

### Frontend dependencies fail to install

Check Node.js and Corepack versions, then run `corepack enable` and retry `corepack yarn install` from `3d-chess`.

### Tailwind styles are missing

Start the app using `yarn dev` or `yarn build`; these scripts run Tailwind's CSS generation first. If needed, regenerate manually with:

```sh
yarn tailwindcss -i src/styles/global.css -o src/styles/tailwind.generated.css --minify
```

The generated stylesheet is ignored by Git and does not need to be committed.
