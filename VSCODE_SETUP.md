# VSCode Development Setup Guide

This guide provides step-by-step instructions for setting up and running the Flow Motion application in Visual Studio Code with a local development server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [VSCode Setup](#vscode-setup)
- [Project Setup](#project-setup)
- [Running the Application](#running-the-application)
- [Debugging in VSCode](#debugging-in-vscode)
- [Browser Configuration](#browser-configuration)
- [Troubleshooting](#troubleshooting)
- [Useful Extensions](#useful-extensions)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/) (v20.x or later)
- [npm](https://www.npmjs.com/) (v9.x or later)
- [Git](https://git-scm.com/downloads)
- [Python](https://www.python.org/downloads/) (v3.11 or later, for backend services)

## VSCode Setup

1. **Install recommended extensions**:
   - JavaScript and TypeScript support:
     - ESLint
     - Prettier
     - TypeScript Vue Plugin
   - React support:
     - ES7+ React/Redux/React-Native snippets
   - Python support (for backend):
     - Python extension
     - Pylance

2. **Open VSCode settings** (File > Preferences > Settings or `Ctrl+,`) and add these configurations:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
     "typescript.tsdk": "node_modules/typescript/lib",
     "javascript.updateImportsOnFileMove.enabled": "always",
     "typescript.updateImportsOnFileMove.enabled": "always"
   }
   ```

3. **Create workspace file** (optional):
   - File > Save Workspace As... > `flow-motion.code-workspace`
   - Add the following configuration:
     ```json
     {
       "folders": [
         {
           "path": "."
         }
       ],
       "settings": {
         "editor.formatOnSave": true,
         "editor.codeActionsOnSave": {
           "source.fixAll.eslint": true
         }
       },
       "extensions": {
         "recommendations": [
           "dbaeumer.vscode-eslint",
           "esbenp.prettier-vscode",
           "ms-python.python",
           "ms-python.vscode-pylance"
         ]
       }
     }
     ```

## Project Setup

1. **Clone the repository**:
   - Open VSCode
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   - Type "Git: Clone" and press Enter
   - Enter the repository URL: `https://github.com/yourusername/daors-flow-motion.git`
   - Select a folder to clone into
   - Click "Open" when prompted to open the cloned repository

2. **Open the terminal in VSCode**:
   - Press `` Ctrl+` `` (backtick) or use Terminal > New Terminal from the menu

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file in VSCode and update with your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     VITE_API_BASE_URL=http://localhost:8080
     ```

## Running the Application

### Frontend Development Server

1. **Start the development server**:
   - In the VSCode terminal, run:
     ```bash
     npm run dev
     ```
   - This will start the Vite development server
   - The terminal will show the URL where the app is running (typically http://localhost:5173)

2. **Open in browser**:
   - The browser should open automatically (configured in vite.config.ts)
   - If it doesn't, click on the URL in the terminal or manually open http://localhost:5173 in your browser

### Backend Services (Optional)

If you need to run the backend services locally:

1. **Open a new terminal** in VSCode:
   - Click the "+" icon in the terminal panel or use Terminal > New Terminal

2. **Navigate to the API Gateway directory**:
   ```bash
   cd logi-core/apps/api-gateway
   npm install
   npm run dev
   ```

3. **Open another terminal for the User Service**:
   ```bash
   cd logi-core/services/user-service
   npm install
   npm run dev
   ```

4. **Open another terminal for the Inventory Service**:
   ```bash
   cd logi-core/services/inventory-service
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # source .venv/bin/activate  # On Unix/Linux
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

## Debugging in VSCode

### Frontend Debugging

1. **Create a launch configuration**:
   - Click on the Run and Debug icon in the sidebar (or press `Ctrl+Shift+D`)
   - Click "create a launch.json file"
   - Select "Web App (Chrome)"
   - VSCode will create a `.vscode/launch.json` file

2. **Update the launch configuration**:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Launch Chrome against localhost",
         "url": "http://localhost:5173",
         "webRoot": "${workspaceFolder}",
         "sourceMapPathOverrides": {
           "/@fs/*": "${webRoot}/*"
         }
       }
     ]
   }
   ```

3. **Start debugging**:
   - First, start the development server with `npm run dev`
   - Then click the green play button in the Debug panel or press F5
   - VSCode will launch Chrome and attach the debugger

4. **Set breakpoints**:
   - Click in the gutter (left margin) of any source file to set breakpoints
   - When the code hits a breakpoint, execution will pause and you can inspect variables

### Backend Debugging

For Node.js services:

1. **Add a Node.js configuration** to your launch.json:
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Debug API Gateway",
     "skipFiles": ["<node_internals>/**"],
     "program": "${workspaceFolder}/logi-core/apps/api-gateway/src/index.js",
     "outFiles": ["${workspaceFolder}/logi-core/apps/api-gateway/dist/**/*.js"],
     "runtimeExecutable": "node",
     "runtimeArgs": ["--inspect"],
     "env": {
       "PORT": "8080",
       "JWT_SECRET": "dev-secret",
       "USER_SERVICE_URL": "http://localhost:4001",
       "INVENTORY_SERVICE_URL": "http://localhost:8000"
     }
   }
   ```

For Python services:

1. **Add a Python configuration** to your launch.json:
   ```json
   {
     "name": "Python: FastAPI",
     "type": "python",
     "request": "launch",
     "module": "uvicorn",
     "args": [
       "main:app",
       "--reload",
       "--port",
       "8000"
     ],
     "cwd": "${workspaceFolder}/logi-core/services/inventory-service",
     "jinja": true,
     "justMyCode": true
   }
   ```

## Browser Configuration

### Chrome DevTools Setup

1. **Open Chrome DevTools**:
   - Right-click on the page and select "Inspect"
   - Or press `F12` or `Ctrl+Shift+I` (`Cmd+Option+I` on macOS)

2. **Enable source maps**:
   - Go to Settings (click the gear icon or press `F1`)
   - Under "Sources", ensure "Enable JavaScript source maps" is checked
   - Also check "Enable CSS source maps"

3. **Disable cache during development**:
   - Go to the Network tab
   - Check "Disable cache" (only when DevTools is open)

4. **Set up React DevTools**:
   - Install the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension
   - After installation, you'll see a new "Components" and "Profiler" tab in DevTools

### Firefox Developer Edition (Alternative)

If you prefer Firefox:

1. **Download [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)**

2. **Install React DevTools for Firefox**:
   - [React Developer Tools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

3. **Configure VSCode to use Firefox**:
   - Update your launch.json:
     ```json
     {
       "type": "firefox",
       "request": "launch",
       "name": "Launch Firefox against localhost",
       "url": "http://localhost:5173",
       "webRoot": "${workspaceFolder}",
       "pathMappings": [
         {
           "url": "http://localhost:5173/src",
           "path": "${workspaceFolder}/src"
         }
       ]
     }
     ```
   - Note: You'll need the [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) VSCode extension

## Troubleshooting

### Common Issues and Solutions

1. **"Cannot find module" errors**:
   - Ensure all dependencies are installed: `npm install`
   - Check for typos in import statements
   - Restart the TypeScript server: `Ctrl+Shift+P` > "TypeScript: Restart TS Server"

2. **Port already in use**:
   - Find the process using the port:
     ```bash
     # Windows
     netstat -ano | findstr "5173"
     taskkill /PID [PID] /F
     
     # Unix/Linux
     lsof -i :5173
     kill -9 [PID]
     ```
   - Or change the port in vite.config.ts:
     ```typescript
     server: {
       port: 3000,
       open: true
     }
     ```

3. **Hot reload not working**:
   - Check if you have any errors in the console
   - Ensure you're not using a production build
   - Try clearing the browser cache
   - Restart the development server

4. **TypeScript errors**:
   - Run `npx tsc --noEmit` to check for TypeScript errors
   - Update TypeScript: `npm install typescript@latest --save-dev`
   - Check tsconfig.json for proper configuration

5. **VSCode IntelliSense not working**:
   - Reload VSCode: `Ctrl+Shift+P` > "Developer: Reload Window"
   - Ensure TypeScript version is correct: `npm list typescript`
   - Check if you have conflicting extensions

## Useful Extensions

### Essential Extensions

1. **ESLint** - JavaScript linting
   - ID: dbaeumer.vscode-eslint
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

2. **Prettier** - Code formatting
   - ID: esbenp.prettier-vscode
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

3. **ES7+ React/Redux/React-Native snippets** - React code snippets
   - ID: dsznajder.es7-react-js-snippets
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

4. **Tailwind CSS IntelliSense** - Autocomplete for Tailwind
   - ID: bradlc.vscode-tailwindcss
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Additional Helpful Extensions

1. **GitLens** - Git integration
   - ID: eamodio.gitlens
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

2. **Import Cost** - Display import package sizes
   - ID: wix.vscode-import-cost
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

3. **Path Intellisense** - Autocomplete filenames
   - ID: christian-kohler.path-intellisense
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

4. **Error Lens** - Inline error messages
   - ID: usernamehw.errorlens
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

5. **REST Client** - Test API endpoints directly from VSCode
   - ID: humao.rest-client
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

6. **Docker** - Docker integration
   - ID: ms-azuretools.vscode-docker
   - [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

## Quick Start Commands

Here's a summary of the most common commands you'll use:

```bash
# Clone repository
git clone https://github.com/yourusername/daors-flow-motion.git
cd daors-flow-motion

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

Happy coding with VSCode and Flow Motion!