# Demo Setup Guide

This guide explains how to set up and run the integration demos using the local project code.

## Quick Setup

Run these commands from the **project root** (`adk-chat/`):

```bash
# 1. Install dependencies
npm install

# 2. Build the project (this generates dist/ with embedded styles)
npm run build

# 3. Navigate to demo folder
cd demo

# 4. Set up all demos
npm run setup:all

# 5. Run a specific demo
npm run serve:method1   # Method 1: Local Installation
npm run dev:method3     # Method 3: React Component
```

## Step-by-Step Explanation

### 1. Build the Parent Project

The demos use `file:../../` to reference the local project, which means they need the built distribution files:

```bash
# From project root (adk-chat/)
npm install
npm run build
```

This creates:
- `dist/adk-client-standalone.js` - Standalone bundle with React and all styles embedded
- `dist/adk-client.es.js` - ES module version
- `dist/adk-client.umd.js` - UMD version
- `dist/adk-client-web-component.css` - Compiled Tailwind CSS
- `src/web-component/compiledStyles.ts` - Embedded CSS for Shadow DOM

### 2. Install Demo Dependencies

Each demo needs to install its own dependencies:

```bash
# Method 1: Local Installation
cd demo/method-1-local
npm install

# Method 3: React Component  
cd demo/method-3-react
npm install
```

Or use the convenience script from the demo folder:

```bash
cd demo
npm run setup:all
```

### 3. Run the Demos

**Method 1: Local Installation**
```bash
cd demo/method-1-local
npm run serve
# Open http://localhost:3000
```

**Method 2: CDN Usage**
```bash
cd demo/method-2-cdn
open index.html
# or: npx serve
```

**Method 3: React Component**
```bash
cd demo/method-3-react
npm run dev
# Open http://localhost:5173
```

**Method 4: Programmatic**
```bash
cd demo/method-4-programmatic
open index.html
# or: npx serve
```

## Important Notes

### About `file:../../` Dependencies

The demos use `"adk-client-web-component": "file:../../"` in their `package.json`. This:

✅ **Uses local code** for development and testing
✅ **Requires building the parent project first**
✅ **Allows testing changes immediately**

When the package is published to npm, users would change this to:
```json
"adk-client-web-component": "^1.0.3"
```

### About Embedded Styles

The component uses Shadow DOM with embedded Tailwind CSS. The build process:

1. Compiles Tailwind CSS to `dist/adk-client-web-component.css`
2. Runs `scripts/embed-styles.js` to read the CSS
3. Writes it to `src/web-component/compiledStyles.ts`
4. The component imports and injects these styles into Shadow DOM

This means **no external CSS file is needed**!

### If You Make Changes

If you modify the source code:

```bash
# Rebuild from project root
npm run build

# Then restart the demo (no need to npm install again)
cd demo/method-1-local
npm run serve
```

## Troubleshooting

**"Cannot find module" errors**
- Run `npm run build` from the project root
- Ensure `dist/` folder exists with built files

**"No styles showing"**
- Verify the build completed successfully
- Check that `src/web-component/compiledStyles.ts` exists and has content
- Ensure you're not trying to load an external CSS file

**"Module not found: adk-client-web-component"**
- Run `npm install` in the demo directory
- Ensure the parent project has a `package.json` (it does)

**Demo server won't start**
- Check if port is already in use
- Try a different port: `npx serve -p 3001`

## CDN Demos (Method 2 & 4)

These demos use the published npm package from CDN (unpkg.com):
- Method 2 uses version 1.0.3 (latest published)
- Method 4 uses latest version automatically

They don't need the local build and work independently.
