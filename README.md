# 3D Chess

A multiplayer 3D chess game built with Next.js, React Three Fiber, and Socket.IO. The project also includes a classroom demo for the [`hw2_introAI`](https://github.com/HatakekkSheeshh/hw2_introAI) chess-search project.

## Chess AI Search Lab

The `/demo` page visualizes Alpha-Beta and Monte-Carlo Tree Search playing chess, with 2D/3D boards, search traces, and move-by-move results. Its Python API is provided by the separate `hw2_introAI` repository.

See **[Chess AI demo setup](docs/chess-ai-demo.md)** for prerequisites, cloning both repositories, installing dependencies, starting the backend and frontend, optional API configuration, and troubleshooting.

### Quick start

Run these in two terminals after cloning both repositories next to each other:

```sh
# Terminal 1: Python backend
cd hw2_introAI
uv sync
uv run chess-ai serve --host 127.0.0.1 --port 8000
```

```sh
# Terminal 2: Next.js frontend
cd 3d-chess
corepack yarn install
yarn dev
```

Open [http://localhost:3000/demo](http://localhost:3000/demo). The Next.js app proxies `/api/*` to `http://127.0.0.1:8000` by default. The original multiplayer game remains at `/`.

## Requirements

- Node.js 18.17 or newer, with Corepack enabled
- Python 3.10 or newer
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- Git

## Existing multiplayer game

```sh
corepack yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The multiplayer game uses Socket.IO and does not require the Python chess-search server.

Live demo: https://chess-in-3d.herokuapp.com/

![3D Chess screenshot](https://i.imgur.com/r9tBfim.png)
