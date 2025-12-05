# Design Document

## Overview

PromptBlocks is a block-based text transformation system built on a shared skeleton engine. The architecture follows a modular design where a core engine provides block execution capabilities to two separate applications: PromptBlocks Personal (single-block) and PromptBlocks Workflow Builder (multi-block). All AI transformations are powered by OpenRouter using the free Qwen 2.5 7B model.

### Design Principles

- **Simplicity First**: Minimal UI, no authentication, immediate usability
- **Reusability**: Single skeleton engine powers both applications
- **Human-Readable Output**: No JSON or technical formats in UI
- **Zero Configuration**: Works out of the box with sample data
- **Free Tier**: Uses only free OpenRouter model

## Architecture

### System Structure

```
promptblocks/
├── skeleton/              # Shared engine (reusable core)
│   ├── block_registry.js  # Block definitions
│   ├── block_executor.js  # OpenRouter integration
│   ├── workflow_engine.js # Sequential execution
│   ├── sample_data.js     # Test data for blocks
│   └── utils.js           # Helper functions
├── app_personal/          # Single-block application
│   ├── index.html
│   ├── style.css
│   └── app.js
└── app_workflow/          # Multi-block application
    ├── index.html
    ├── style.css
    └── app.js
```

### Component Interaction Flow

**Single Block Execution (Personal App):**
```
User Input → Block Registry → Block Executor → OpenRouter API → Human-Readable Output
```

**Workflow Execution (Workflow Builder):**
```
User Input → Workflow Engine → Block 1 → Block 2 → ... → Block N → Final Output
                ↓
         Block Executor (for each block)
                ↓
         OpenRouter API
```

## Components and Interfaces

### 1. Block Registry (`skeleton/block_registry.js`)

**Purpose**: Central registry of all available blocks

**Interface**:
```javascript
{
  getBlock(blockId): Block,
  getAllBlocks(): Block[],
  registerBlock(block): void
}
```

**Block Structure**:
```javascript
{
  id: string,              // Unique identifier (e.g., "summarize")
  name: string,            // Display name (e.g., "Summarize")
  description: string,     // User-facing description
  prompt: string,          // System prompt for OpenRouter
  sampleInput: string      // Default test data
}
```

**Registered Blocks**:
1. **Summarize**: Condenses text to key points
2. **Rewrite to Email**: Converts text to professional email format
3. **Extract Key Points**: Identifies and lists main ideas
4. **Improve Writing**: Enhances clarity, grammar, and style
5. **Translate**: Converts text between languages (user specifies target)
6. **Convert to Table**: Structures text data as markdown table

### 2. Block Executor (`skeleton/block_executor.js`)

**Purpose**: Executes individual blocks using OpenRouter

**Interface**:
```javascript
{
  executeBlock(blockId, inputText, options): Promise<string>
}
```

**OpenRouter Configuration**:
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Model**: `qwen/qwen-2.5-7b-instruct:free`
- **Headers**: 
  - `Authorization: Bearer ${API_KEY}`
  - `Content-Type: application/json`
- **Request Body**:
  ```javascript
  {
    model: "qwen/qwen-2.5-7b-instruct:free",
    messages: [
      { role: "system", content: block.prompt },
      { role: "user", content: inputText }
    ]
  }
  ```

**Error Handling**:
- Network failures: Return user-friendly error message
- API errors: Parse and display readable error
- Timeout: 30-second limit with clear timeout message

**Output Processing**:
- Extract text from API response
- Strip any JSON formatting if present
- Return clean human-readable string

### 3. Workflow Engine (`skeleton/workflow_engine.js`)

**Purpose**: Executes multiple blocks sequentially

**Interface**:
```javascript
{
  executeWorkflow(blockIds, initialInput): Promise<WorkflowResult>
}
```

**WorkflowResult Structure**:
```javascript
{
  steps: [
    {
      blockId: string,
      blockName: string,
      input: string,
      output: string,
      success: boolean,
      error: string | null
    }
  ],
  finalOutput: string
}
```

**Execution Logic**:
1. Initialize with user input
2. For each block in sequence:
   - Execute block with current input
   - Store step result (input, output, status)
   - Pass output as input to next block
   - Stop on error and return partial results
3. Return complete workflow result

### 4. Sample Data (`skeleton/sample_data.js`)

**Purpose**: Provides test data for each block

**Interface**:
```javascript
{
  getSampleData(blockId): string
}
```

**Sample Data Examples**:
- **Summarize**: Long article or blog post (300+ words)
- **Rewrite to Email**: Casual message or notes
- **Extract Key Points**: Meeting notes or article
- **Improve Writing**: Text with grammar issues
- **Translate**: English text (default to Spanish)
- **Convert to Table**: List of items with attributes

### 5. Utilities (`skeleton/utils.js`)

**Purpose**: Helper functions for both applications

**Functions**:
- `validateInput(text)`: Ensures non-empty input
- `formatError(error)`: Converts errors to user-friendly messages
- `sanitizeOutput(text)`: Cleans API responses
- `getApiKey()`: Retrieves OpenRouter API key from environment/config

## Data Models

### Block Definition
```javascript
{
  id: "summarize",
  name: "Summarize",
  description: "Condense text to key points",
  prompt: "You are a summarization assistant. Provide a concise summary of the following text, highlighting the main points in clear, readable format.",
  sampleInput: "Long article text..."
}
```

### Execution Request
```javascript
{
  blockId: "summarize",
  inputText: "User provided text...",
  options: {
    // Optional parameters (e.g., target language for translate)
  }
}
```

### Execution Response
```javascript
{
  success: true,
  output: "Human-readable result text...",
  error: null
}
```

## Application Designs

### PromptBlocks Personal (`app_personal/`)

**Layout**:
```
┌─────────────────────────────────────┐
│  PromptBlocks Personal              │
│  Simple AI text transformations     │
├─────────────────────────────────────┤
│  Select a Block:                    │
│  [Summarize ▼]                      │
│                                     │
│  Input Text:                        │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  (text area)                │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  [Try Sample Data] [Transform]     │
│                                     │
│  Result:                            │
│  ┌─────────────────────────────┐   │
│  │  (output display)           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Features**:
- Dropdown to select block
- Large text area for input
- "Try Sample Data" button loads pre-defined test data
- "Transform" button executes selected block
- Output area shows human-readable result
- Loading indicator during API call
- Error messages displayed inline

**User Flow**:
1. User selects block from dropdown
2. User enters text OR clicks "Try Sample Data"
3. User clicks "Transform"
4. System shows loading state
5. System displays result or error

### PromptBlocks Workflow Builder (`app_workflow/`)

**Layout**:
```
┌─────────────────────────────────────┐
│  PromptBlocks Workflow Builder      │
│  Chain multiple transformations     │
├─────────────────────────────────────┤
│  Build Workflow:                    │
│  ☐ Summarize                        │
│  ☐ Extract Key Points               │
│  ☐ Improve Writing                  │
│  ☐ Rewrite to Email                 │
│  ☐ Translate                        │
│  ☐ Convert to Table                 │
│                                     │
│  [Load Sample Workflow ▼]           │
│                                     │
│  Input Text:                        │
│  ┌─────────────────────────────┐   │
│  │  (text area)                │   │
│  └─────────────────────────────┘   │
│  [Run Workflow]                     │
│                                     │
│  Workflow Results:                  │
│  Step 1: Summarize                  │
│  ┌─────────────────────────────┐   │
│  │  (output)                   │   │
│  └─────────────────────────────┘   │
│  Step 2: Extract Key Points         │
│  ┌─────────────────────────────┐   │
│  │  (output)                   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Features**:
- Checkboxes to select multiple blocks
- Blocks execute in selection order
- Sample workflow dropdown (pre-configured chains)
- Input text area
- "Run Workflow" button
- Step-by-step output display
- Each step shows block name and result
- Progress indicator during execution

**Sample Workflows**:
1. **Content Summary**: Summarize → Extract Key Points
2. **Email Draft**: Improve Writing → Rewrite to Email
3. **Translation Pipeline**: Summarize → Translate
4. **Data Extraction**: Extract Key Points → Convert to Table

**User Flow**:
1. User selects blocks via checkboxes OR loads sample workflow
2. User enters input text
3. User clicks "Run Workflow"
4. System executes blocks sequentially
5. System displays each step result as it completes
6. System shows final output

## Error Handling

### API Errors
- **Network Failure**: "Unable to connect to AI service. Please check your connection."
- **Authentication Error**: "API key invalid. Please configure OpenRouter API key."
- **Rate Limit**: "Too many requests. Please wait a moment and try again."
- **Timeout**: "Request timed out. Please try again with shorter text."
- **Invalid Response**: "Unexpected response from AI service. Please try again."

### Input Validation
- **Empty Input**: "Please enter some text to transform."
- **Text Too Long**: "Input text exceeds maximum length (10,000 characters)."

### Workflow Errors
- **No Blocks Selected**: "Please select at least one block for the workflow."
- **Partial Failure**: Display successful steps, show error at failure point, allow retry

### Error Display
- Errors shown in red text below action buttons
- Clear error messages without technical jargon
- Retry button for recoverable errors

## Testing Strategy

### Unit Tests

**Block Registry Tests**:
- Verify all 6 blocks are registered
- Validate block structure (id, name, description, prompt, sampleInput)
- Test getBlock() returns correct block
- Test getAllBlocks() returns complete list

**Block Executor Tests**:
- Mock OpenRouter API responses
- Test successful execution returns string
- Test error handling for various failure modes
- Verify API request format (model, messages structure)
- Test output sanitization (removes JSON formatting)

**Workflow Engine Tests**:
- Test single-block workflow
- Test multi-block sequential execution
- Test output passing between blocks
- Test partial failure handling
- Verify step results structure

### Integration Tests

**PromptBlocks Personal**:
- Test each block with sample data
- Verify human-readable output (no JSON)
- Test "Try Sample Data" button functionality
- Test error display for invalid API key
- Test loading states

**PromptBlocks Workflow Builder**:
- Test each sample workflow end-to-end
- Verify sequential execution order
- Test step-by-step output display
- Test workflow with 2, 3, and 4 blocks
- Test error recovery in multi-step workflows

### Manual Testing Checklist

**Functional Testing**:
- [ ] All blocks execute successfully with sample data
- [ ] Custom input works for all blocks
- [ ] Workflow chains execute in correct order
- [ ] Output is always human-readable
- [ ] Errors display clearly

**UI/UX Testing**:
- [ ] Interface is intuitive for non-technical users
- [ ] Loading states are visible
- [ ] Sample data loads correctly
- [ ] Workflow builder checkboxes work
- [ ] Sample workflows load properly

**API Testing**:
- [ ] OpenRouter API key configuration works
- [ ] Qwen 2.5 7B model is used for all requests
- [ ] API errors are handled gracefully
- [ ] Timeout handling works correctly

## Configuration

### API Key Management

**Development**:
- Store API key in `config.js` (gitignored)
- Format: `const OPENROUTER_API_KEY = "sk-or-v1-...";`

**Production**:
- Environment variable: `OPENROUTER_API_KEY`
- Fallback to config file if env var not set

**Security**:
- Never commit API keys to repository
- Include `.env` and `config.js` in `.gitignore`
- Provide `config.example.js` template

### Model Configuration

**Fixed Settings** (not user-configurable):
- Provider: OpenRouter
- Model: `qwen/qwen-2.5-7b-instruct:free`
- Temperature: 0.7 (balanced creativity/consistency)
- Max Tokens: 1000 (sufficient for most transformations)

## Deployment Considerations

### Static Hosting
- All files are static (HTML, CSS, JS)
- Can be hosted on GitHub Pages, Netlify, Vercel
- No server-side code required

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- Fetch API for HTTP requests
- No polyfills needed for target browsers

### Performance
- Lazy load skeleton engine
- Cache block registry in memory
- Debounce API calls (prevent rapid-fire requests)
- Show loading indicators for API calls (typically 2-5 seconds)

## Future Enhancements (Out of Scope)

- User accounts and saved workflows
- Custom block creation
- Multiple AI model support
- Batch processing
- Export results to file
- Workflow templates library
- Real-time collaboration
