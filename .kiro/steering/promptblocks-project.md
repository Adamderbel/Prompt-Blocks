# PromptBlocks Project Steering Document

## Project Overview

PromptBlocks is a block-based text transformation system powered by AI. It consists of two applications built on a shared skeleton engine:

- **PromptBlocks Personal**: Single text transformation execution
- **PromptBlocks Workflow Builder**: Chain multiple transformations sequentially

## Architecture Principles

### Skeleton Crew Pattern

This project follows the **Skeleton Crew** architecture pattern - a reusable foundation for building AI-powered applications.

**Core Principle**: All core functionality lives in the `skeleton/` directory and is shared between applications. Applications only contain UI-specific logic.

### Directory Structure

```
promptblocks/
├── skeleton/              # Shared engine (DO NOT DUPLICATE)
│   ├── block_registry.js  # Block definitions
│   ├── block_executor.js  # OpenRouter API integration
│   ├── workflow_engine.js # Sequential execution logic
│   ├── sample_data.js     # Test data for blocks
│   └── utils.js           # Helper functions
├── app_personal/          # Single-block application
│   ├── index.html
│   ├── style.css
│   └── app.js             # UI logic only
├── app_workflow/          # Multi-block application
│   ├── index.html
│   ├── style.css
│   └── app.js             # UI logic only
├── config.example.js      # API key template
└── config.js              # User's API key (gitignored)
```

## Development Guidelines

### 1. Code Organization

- **Skeleton files**: Core functionality, API integration, business logic
- **App files**: UI interactions, DOM manipulation, event handlers only
- **Never duplicate**: If functionality exists in skeleton, use it from apps

### 2. Adding New Blocks

When adding a new block to the system:

1. Add block definition to `skeleton/block_registry.js`:
   ```javascript
   {
     id: 'block-id',
     name: 'Block Name',
     description: 'What the block does',
     prompt: 'System prompt for AI model',
     sampleInput: 'Example text for testing'
   }
   ```

2. Add sample data to `skeleton/sample_data.js`:
   ```javascript
   'block-id': 'Sample text for this block...'
   ```

3. Update both app UIs if needed (checkboxes in workflow, dropdown in personal)

### 3. API Configuration

- **Model**: Currently using `mistralai/mistral-7b-instruct:free` via OpenRouter
- **Configuration**: `skeleton/block_executor.js` contains API settings
- **Rate Limiting**: Automatic retry with exponential backoff (2s, 4s, 8s)
- **API Key**: Must use `var` (not `const`) in config.js for global scope

### 4. HTML Script Loading Order

Always load scripts in this order:
```html
<!-- Configuration -->
<script src="../config.js"></script>

<!-- Skeleton Engine Scripts -->
<script src="../skeleton/utils.js"></script>
<script src="../skeleton/block_registry.js"></script>
<script src="../skeleton/sample_data.js"></script>
<script src="../skeleton/block_executor.js"></script>
<script src="../skeleton/workflow_engine.js"></script> <!-- workflow app only -->

<!-- Application Script -->
<script src="app.js"></script>
```

### 5. Output Formatting

- **Always human-readable**: No JSON in UI
- **Use sanitizeOutput()**: Strips JSON formatting, markdown code blocks
- **Display as text**: Use `textContent` not `innerHTML` for security

### 6. Error Handling

Standard error messages:
- API key issues: "API key invalid. Please configure OpenRouter API key."
- Rate limits: "Too many requests. Please wait a moment and try again."
- Network issues: "Unable to connect to AI service. Please check your connection."
- Timeouts: "Request timed out. Please try again with shorter text."

### 7. Testing

- Test all blocks with sample data
- Test all 4 sample workflows
- Verify human-readable output (no JSON)
- Test error scenarios (invalid key, rate limits, network errors)
- Verify skeleton engine changes affect both apps

## Common Tasks

### Changing AI Model

Edit `skeleton/block_executor.js`:
```javascript
const MODEL = 'provider/model-name:free';
```

Update README.md to reflect the new model name.

### Adding a Sample Workflow

Edit `app_workflow/app.js` and add to `sampleWorkflows` object:
```javascript
'workflow-id': {
  name: 'Workflow Name',
  blocks: ['block-1', 'block-2'],
  sampleInput: 'Sample text...'
}
```

### Adjusting Rate Limit Retry

Edit `skeleton/block_executor.js`:
```javascript
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // milliseconds
```

## Important Notes

### DO NOT:
- Duplicate skeleton functionality in app files
- Use `const` for OPENROUTER_API_KEY (breaks global scope)
- Display JSON in the UI
- Forget to load config.js before skeleton scripts
- Modify skeleton files without testing both apps

### DO:
- Keep apps lightweight (UI logic only)
- Use skeleton functions from apps
- Test changes in both applications
- Maintain human-readable output
- Follow the Skeleton Crew pattern

## Browser Compatibility

- Modern browsers with ES6+ support
- JavaScript enabled
- Fetch API support
- No build process required

## Security

- API key stored locally in browser
- No server-side storage
- All processing via OpenRouter API
- Use `textContent` to prevent XSS

## Future Enhancements

Potential improvements:
- Add more blocks (sentiment analysis, code generation, etc.)
- Custom block creation UI
- Workflow saving/loading
- Export results to file
- Dark mode
- Mobile-responsive design improvements
