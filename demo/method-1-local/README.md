# Method 1: Local Installation Demo

This demo demonstrates how to use the ADK Client Web Component after installing it via npm.

**Key Feature:** The component uses Shadow DOM with embedded Tailwind CSS styles - **no external CSS file needed**!

**Note:** This demo currently uses the local project code (`file:../../`) for development. For production, you would use the published npm package.

## Setup Instructions

### Prerequisites
First, build the parent project to generate the distribution files:

```bash
# From the project root (adk-chat/)
npm install
npm run build
```

### Then setup this demo:

1. **Install dependencies** in this demo directory:
   ```bash
   npm install
   ```

2. **Serve the demo** using a web server (required for ES modules):
   ```bash
   npm run serve
   # or
   npx serve
   # or
   python -m http.server 8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000` (or whatever port your server uses)

## What This Demo Shows

- **Widget Mode**: Chat widget fixed in bottom-right corner
- **Fullscreen Mode**: Full chat interface embedded in the page  
- **Shadow DOM**: Component with embedded styles, no external CSS needed
- **Local Installation**: Component loaded from `./node_modules/`

## Key Features Demonstrated

- Component initialization via HTML attributes
- Shadow DOM with embedded Tailwind CSS
- Both widget and fullscreen modes
- Streaming vs standard response modes
- Zero external CSS dependencies

## Important Notes

- **Must be served via web server** - Cannot open as `file://` due to ES module restrictions
- **No CSS file needed** - Component uses Shadow DOM with embedded styles
- **Relative paths** point to `./node_modules/adk-client-web-component/dist/`
- **Component auto-registers** when the standalone script is loaded

## Why No CSS File?

The component uses **Shadow DOM** which isolates its styles from the parent document. All Tailwind CSS utilities are compiled and embedded directly into the component's JavaScript bundle during the build process. This means:

✅ **No CSS conflicts** with your existing styles
✅ **Self-contained** - works without external stylesheets  
✅ **Portable** - copy anywhere and it just works

## Troubleshooting

- **404 errors**: Ensure you've run `npm run build` in the parent project first
- **No dist folder**: Run `npm run build` from the project root (adk-chat/)
- **CORS issues**: Make sure your ADK server allows requests from your domain
- **Component not loading**: Check browser console for ES module loading errors
- **No styles showing**: Ensure you've built the project - styles are embedded during the build process
