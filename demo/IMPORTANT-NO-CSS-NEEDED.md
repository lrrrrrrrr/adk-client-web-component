# ⚠️ IMPORTANT: No External CSS File Needed!

## Development Setup (Using Local Code)

**First, build the parent project:**

```bash
# From the project root (adk-chat/)
npm install
npm run build
```

This generates the distribution files with embedded styles that the demos will use.

## The Fix for Missing Styles

If you're seeing the component render without styles (like in the screenshot), **don't add a CSS file**. The issue is likely with the npm package version.

## Why No CSS File?

The ADK Client Web Component uses **Shadow DOM with embedded Tailwind CSS styles**. This means:

✅ **All styles are bundled in the JavaScript file**
✅ **No external CSS file required**
✅ **Zero style conflicts with your existing CSS**  
✅ **Self-contained and portable**

## Correct Usage

### ✅ DO THIS (No CSS link):

```html
<!DOCTYPE html>
<html>
<body>
  <adk-client
    api-url="http://localhost:8000"
    app-name="my_sample_agent">
  </adk-client>

  <script type="module" src="./node_modules/adk-client-web-component/dist/adk-client-standalone.js"></script>
</body>
</html>
```

### ❌ DON'T DO THIS (CSS link not needed):

```html
<!-- ❌ THIS IS NOT NEEDED -->
<link rel="stylesheet" href="./node_modules/adk-client-web-component/dist/adk-client-web-component.css">
```

## If Styles Are Missing

The component should have styles embedded. If you're seeing unstyled components:

1. **Check the npm package version**: Use **v1.0.3** or later
   ```bash
   npm install adk-client-web-component@latest
   ```

2. **Verify the component loaded**: Check browser console for errors

3. **Check if Shadow DOM is supported**: Modern browsers only (Chrome, Firefox, Safari, Edge)

## How It Works

The component:
1. Uses **Shadow DOM** to isolate styles
2. **Embeds compiled Tailwind CSS** directly in the JavaScript bundle (via `compiledStyles.ts`)
3. **Injects styles** into the Shadow DOM on mount
4. **Includes fallback styles** for critical UI elements

This happens automatically - you don't need to do anything!

## Build Process

When the package is built:
1. Tailwind CSS is compiled to `dist/adk-client-web-component.css`
2. The `embed-styles.js` script reads that CSS
3. It writes the CSS into `src/web-component/compiledStyles.ts`
4. The component imports and injects these styles into Shadow DOM

## For Package Maintainers

If you're publishing the package, ensure the build runs in this order:
```bash
npm run build:lib          # Builds library and generates CSS
npm run build:embed-styles # Embeds CSS into compiledStyles.ts  
npm run build:standalone   # Builds standalone with embedded styles
```

The `npm run build` script handles this automatically.
