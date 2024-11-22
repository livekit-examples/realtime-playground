# LiveKit + OpenAI Realtime Playground

This project is an interactive playground that demonstrates the capabilities of OpenAI's Realtime API, allowing users to experiment with the API directly in their browser. It's built on top of LiveKit Agents.

See it in action at [realtime-playground.livekit.io](https://realtime-playground.livekit.io)

## Repository Structure

### /agent

This directory contains the agent implementation in build on the LiveKit [Python Agents framework](https://github.com/livekit/agents).

### /web

This directory houses the web frontend, built with Next.js.

## Prerequisites

- Node.js and pnpm (for web frontend and Node.js agent)
- Python 3.9 or higher (for Python agent)
- pip (Python package installer)
- LiveKit Cloud or self-hosted LiveKit server

## Getting Started

### Agent Setup

1. Navigate to the `/agent` directory
2. Copy the sample environment file: `cp .env.sample .env.local`
3. Open `.env.local` in a text editor and enter your LiveKit credentials
1. Create a virtual environment: `python -m venv .venv`
2. Activate the virtual environment:
   - On macOS and Linux: `source .venv/bin/activate`
   - On Windows: `.venv\Scripts\activate`
3. Load the environment variables:
   - On macOS and Linux: `source .env.local`
   - On Windows: `set -a; . .env.local; set +a`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the agent in development mode: `python main.py dev`

### Web Frontend Setup

1. Navigate to the `/web` directory
2. Copy the sample environment file: `cp .env.sample .env.local`
3. Open `.env.local` in a text editor and enter your LiveKit credentials:
4. Install dependencies: `pnpm install`
5. Run the development server: `pnpm dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The agent can be deployed in a variety of ways: [Deployment & Scaling Guide](https://docs.livekit.io/agents/deployment/)

The web frontend can be deployed using your preferred Next.js hosting solution, such as [Vercel](https://vercel.com/).

## Troubleshooting

Ensure the following:

- Both web and agent are running
- Environment variables are set up correctly
- Correct versions of Python and pnpm are installed

## Additional Resources

For more information or support, please refer to [LiveKit docs](https://docs.livekit.io/).

## License

Apache 2.0
