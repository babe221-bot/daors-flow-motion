# Quick Start: Running Flow Motion in Browser from VSCode

This guide provides simple, step-by-step instructions for launching the Flow Motion application in a browser directly from Visual Studio Code.

## Prerequisites

- Visual Studio Code installed
- Node.js (v20.x or later) installed
- Git installed

## Step 1: Open the Project in VSCode

1. **Launch VSCode**

2. **Open the Flow Motion project**:
   - If you haven't cloned it yet:
     - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
     - Type "Git: Clone" and press Enter
     - Enter: `https://github.com/yourusername/daors-flow-motion.git`
     - Select a folder to clone into
   - If already cloned:
     - Go to File > Open Folder
     - Navigate to the daors-flow-motion directory
     - Click "Select Folder"

## Step 2: Install Dependencies

1. **Open the terminal in VSCode**:
   - Press `` Ctrl+` `` (backtick) or use Terminal > New Terminal from the menu

2. **Install project dependencies**:
   ```bash
   npm install
   ```

   ![Terminal with npm install](https://i.imgur.com/example1.png)

## Step 3: Set Up Environment Variables

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file**:
   - The file will open automatically in VSCode
   - Update the Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_API_BASE_URL=http://localhost:8080
   ```

## Step 4: Start the Development Server

1. **Run the development server**:
   ```bash
   npm run dev
   ```

   ![Terminal with npm run dev](https://i.imgur.com/example2.png)

2. **Wait for the server to start**:
   - You'll see a message like:
   ```
   VITE v5.4.19  ready in 1234 ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h to show help
   ```

3. **Browser will open automatically**:
   - The browser should launch automatically with the application
   - This is configured in the vite.config.ts file with `server: { open: true }`

   ![Browser with application](https://i.imgur.com/example3.png)

## Step 5: Manual Browser Launch (if needed)

If the browser doesn't open automatically:

1. **Click the link in the terminal**:
   - In most terminals, you can click the http://localhost:5173/ URL

2. **Or open your browser manually**:
   - Launch your preferred browser
   - Enter the URL: `http://localhost:5173/`

## Step 6: Using VSCode's Built-in Browser (Alternative)

VSCode has a built-in Simple Browser extension:

1. **Install Simple Browser extension**:
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Simple Browser"
   - Install the one by Microsoft

2. **Open Simple Browser**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   - Type "Simple Browser: Show"
   - Enter the URL: `http://localhost:5173/`

   ![VSCode Simple Browser](https://i.imgur.com/example4.png)

## Step 7: Debugging in Browser

1. **Open Developer Tools**:
   - Right-click on the page and select "Inspect"
   - Or press `F12` or `Ctrl+Shift+I` (`Cmd+Option+I` on macOS)

2. **View console output**:
   - Click on the "Console" tab
   - Check for any errors or warnings

   ![Browser Developer Tools](https://i.imgur.com/example5.png)

## Troubleshooting

### Browser Doesn't Open Automatically

1. **Check vite.config.ts**:
   - Make sure it contains:
   ```typescript
   server: {
     open: true
   }
   ```

2. **Try manually opening the URL**:
   - Copy the URL from the terminal
   - Paste it into your browser

### Port Already in Use

If you see an error like "Port 5173 is already in use":

1. **Find and kill the process**:
   ```bash
   # Windows
   netstat -ano | findstr "5173"
   taskkill /PID [PID] /F
   
   # Unix/Linux
   lsof -i :5173
   kill -9 [PID]
   ```

2. **Or change the port**:
   - Edit vite.config.ts:
   ```typescript
   server: {
     port: 3000,  // Change to any available port
     open: true
   }
   ```

### White Screen or Loading Issues

1. **Check the console for errors**:
   - Open browser developer tools (F12)
   - Look for error messages in the Console tab

2. **Verify environment variables**:
   - Make sure your .env file has the correct values
   - Restart the development server after changing .env

3. **Clear browser cache**:
   - Press `Ctrl+Shift+Delete` in your browser
   - Select "Cached images and files"
   - Click "Clear data"

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start on a different port
npm run dev -- --port=3000

# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps

Once the application is running in your browser:

1. **Sign in** using the test credentials or create a new account
2. **Explore the dashboard** and available features
3. **Make code changes** in VSCode and see them instantly in the browser (hot reload)

Happy coding with Flow Motion!