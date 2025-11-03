# Method 2: CDN Usage Demo

This demo demonstrates how to use the ADK Client Web Component directly from CDN without any npm installation.

**Key Feature:** The component uses Shadow DOM with embedded Tailwind CSS styles - **no external CSS file needed**!

## Setup Instructions

1. **Simply open the HTML file** in your browser:
   ```bash
   # From the demo/method-2-cdn directory
   open index.html
   # or serve it with any web server
   npx serve
   ```

2. **No installation required** - everything is loaded from CDN

## What This Demo Shows

- **CDN Loading**: Component loaded from unpkg.com
- **Zero Installation**: Works without any npm packages or CSS files
- **Shadow DOM**: Component with embedded styles
- **Widget Mode**: Chat widget in bottom-right corner
- **Fullscreen Mode**: Full chat interface embedded in page
- **Loading Status**: Visual feedback for CDN loading
- **Version Pinning**: Example of production-ready version locking

## Key Features Demonstrated

- Component initialization via HTML attributes
- ES module import from CDN
- Shadow DOM with embedded Tailwind CSS
- Loading status detection
- Production configuration examples
- Zero dependencies

## CDN URLs Used

```html
<!-- JavaScript only - no CSS needed! -->
<script type="module">
  import 'https://unpkg.com/adk-client-web-component/dist/adk-client-standalone.js';
</script>
```

## Advantages of CDN Method

- **No build step required**
- **No CSS file needed** - Shadow DOM with embedded styles
- **Works with any static hosting**
- **Easy integration into existing websites**
- **Automatic updates** (when not version-pinned)
- **Reduced setup time** - just add a script tag

## Production Recommendations

1. **Pin to specific version** for stability:
   ```html
   <script type="module">
     import 'https://unpkg.com/adk-client-web-component@0.0.3/dist/adk-client-standalone.js';
   </script>
   ```
   
   **Note:** Version 0.0.3 is the latest published version. Version 0.0.4 with improved embedded styles is in development.

2. **Configure CORS** on your ADK server for your domain

3. **Monitor CDN availability** for production deployments

## Why No CSS File?

The component uses **Shadow DOM** which isolates its styles. All Tailwind CSS is embedded in the JavaScript bundle:

✅ **Single file** - just import the JS, no CSS needed
✅ **No conflicts** - styles are isolated from your page
✅ **Self-contained** - works anywhere instantly

## Troubleshooting

- **Component not loading**: Check internet connection and CDN availability
- **CORS errors**: Ensure your ADK server allows requests from your domain
- **No styles showing**: Version 0.0.3 may have styling issues. For best results, use the local build (see Method 1) or wait for version 0.0.4 to be published.
- **Browser compatibility**: Ensure modern browser with ES module support
