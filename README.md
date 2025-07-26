# Deceptive Pattern Detector for Figma

**Detect and analyze deceptive (dark) UX patterns in Figma designs using OpenAI GPT-4.**

## Features

- Select frames in Figma and extract all visible text.
- Analyze UI content for deceptive patterns (e.g., Roach Motel, Confirmshaming).
- Get detailed evidence, UX path analysis, and ethical redesign suggestions.
- Secure backend proxy for OpenAI API (API key never exposed to client or repo).

## How It Works

1. **Figma Plugin UI:**  
   - Select frames, review content, and trigger analysis.
2. **Backend Server:**  
   - Receives analysis requests, securely calls OpenAI, and returns results.
3. **Security:**  
   - API key is stored only in `/server/.env` (never pushed to GitHub).

## Setup

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/figma-deceptive-pattern-detector.git
cd figma-deceptive-pattern-detector
```

### 2. Install Dependencies

#### Plugin (root folder)
```sh
npm install
```

#### Backend Server
```sh
cd server
npm install
```

### 3. Add Your OpenAI API Key

Create `/server/.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

> **Note:** `/server/.env` is in `.gitignore` and will never be pushed to GitHub.

### 4. Start the Backend Server

```sh
cd server
npm start
```

### 5. Run the Figma Plugin

- Load the plugin in Figma (see [Figma plugin docs](https://www.figma.com/plugin-docs/setup/)).
- Select frames and click “Analyze”.

## Development

- **Localhost access:**  
  Manifest is configured for development (`devAllowedDomains`).
- **Production:**  
  For deployment, add your production backend URL to `allowedDomains`.

## Security

- **API key is never exposed**:  
  Only stored in `/server/.env`, never in client code or repo.
- **.gitignore**:  
  Ensures secrets and build artifacts are not tracked.

## Contributing

Pull requests and issues are welcome!  
Please open an issue for feature requests or bug reports.

## License

MIT
