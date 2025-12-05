# Implementation Plan

- [x] 1. Set up project structure and configuration
  - Create root directory structure with skeleton/, app_personal/, and app_workflow/ folders
  - Create .gitignore file to exclude config.js and .env files
  - Create config.example.js template with placeholder for OpenRouter API key
  - Create README.md with project overview and setup instructions
  - _Requirements: 6.4_

- [x] 2. Implement skeleton engine core components
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2.1 Create block registry with all block definitions
  - Implement skeleton/block_registry.js with getBlock(), getAllBlocks(), and registerBlock() functions
  - Define all 6 blocks (Summarize, Rewrite to Email, Extract Key Points, Improve Writing, Translate, Convert to Table) with id, name, description, prompt, and sampleInput properties
  - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 2.2 Create sample data module
  - Implement skeleton/sample_data.js with getSampleData() function
  - Add sample input text for each of the 6 blocks (300+ words for summarize, casual text for email, meeting notes, text with errors, English text for translate, list data for table)
  - _Requirements: 6.5_

- [x] 2.3 Create utility functions
  - Implement skeleton/utils.js with validateInput(), formatError(), sanitizeOutput(), and getApiKey() functions
  - Add input validation for empty text and length limits (10,000 characters max)
  - Add error message formatting for user-friendly display
  - _Requirements: 6.4_

- [x] 2.4 Implement block executor with OpenRouter integration
  - Implement skeleton/block_executor.js with executeBlock() function
  - Configure OpenRouter API endpoint (https://openrouter.ai/api/v1/chat/completions)
  - Set model to qwen/qwen-2.5-7b-instruct:free with temperature 0.7 and max_tokens 1000
  - Implement API request with proper headers (Authorization, Content-Type) and message structure (system prompt + user input)
  - Add error handling for network failures, authentication errors, rate limits, and timeouts (30 second limit)
  - Implement output sanitization to ensure human-readable text without JSON formatting
  - _Requirements: 3.2, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3_

- [x] 2.5 Implement workflow engine for sequential execution
  - Implement skeleton/workflow_engine.js with executeWorkflow() function
  - Add sequential block execution logic that passes output from one block as input to the next
  - Store step results with blockId, blockName, input, output, success, and error fields
  - Implement error handling to stop workflow on failure and return partial results
  - Return WorkflowResult object with steps array and finalOutput
  - _Requirements: 3.3, 2.3_

- [ ]* 2.6 Write unit tests for skeleton engine
  - Create test file for block registry validating all 6 blocks are registered with correct structure
  - Create test file for block executor with mocked OpenRouter API responses
  - Create test file for workflow engine testing single-block, multi-block, and error scenarios
  - Test output sanitization removes JSON formatting
  - _Requirements: 8.1, 8.4, 8.5_

- [x] 3. Build PromptBlocks Personal application
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3_

- [x] 3.1 Create HTML structure for Personal app
  - Create app_personal/index.html with page title, intro section, block selector dropdown, input textarea, "Try Sample Data" and "Transform" buttons, output display area, and loading indicator
  - Link to style.css and app.js files
  - Include skeleton engine scripts (block_registry.js, block_executor.js, sample_data.js, utils.js)
  - _Requirements: 1.1, 6.2, 6.4_

- [x] 3.2 Create CSS styling for Personal app
  - Create app_personal/style.css with minimal, clean design
  - Style block selector, input/output areas, buttons, loading states, and error messages
  - Ensure responsive layout for different screen sizes
  - Use clear visual hierarchy with readable fonts and spacing
  - _Requirements: 6.2_

- [x] 3.3 Implement Personal app JavaScript logic
  - Create app_personal/app.js with block selection handler, "Try Sample Data" button handler, and "Transform" button handler
  - Implement block execution using skeleton engine's executeBlock() function
  - Display human-readable output in output area (no JSON formatting)
  - Show loading indicator during API calls
  - Display error messages inline in red text below buttons
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.2, 7.3_

- [x] 3.4 Test Personal app with all blocks
  - Test each of the 6 blocks with sample data to verify successful execution
  - Test custom input for each block
  - Verify output is always human-readable without JSON
  - Test "Try Sample Data" button loads correct data for each block
  - Test error handling with invalid API key
  - Test loading states display correctly
  - _Requirements: 8.1, 8.4_

- [x] 4. Build PromptBlocks Workflow Builder application
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3, 6.4, 7.4, 7.5_

- [x] 4.1 Create HTML structure for Workflow Builder app
  - Create app_workflow/index.html with page title, intro section, block checkboxes for all 6 blocks, sample workflow dropdown, input textarea, "Run Workflow" button, and step-by-step output display area
  - Link to style.css and app.js files
  - Include skeleton engine scripts (block_registry.js, block_executor.js, workflow_engine.js, sample_data.js, utils.js)
  - _Requirements: 2.1, 2.5, 6.2, 6.4_

- [x] 4.2 Create CSS styling for Workflow Builder app
  - Create app_workflow/style.css with minimal, clean design
  - Style checkboxes, sample workflow dropdown, input area, buttons, and step-by-step output display
  - Add visual distinction for each workflow step (borders, spacing, step labels)
  - Ensure responsive layout and clear visual hierarchy
  - _Requirements: 6.2, 7.5_

- [x] 4.3 Implement Workflow Builder JavaScript logic
  - Create app_workflow/app.js with checkbox selection handlers, sample workflow loader, and "Run Workflow" button handler
  - Define 4 sample workflows: Content Summary (Summarize → Extract Key Points), Email Draft (Improve Writing → Rewrite to Email), Translation Pipeline (Summarize → Translate), Data Extraction (Extract Key Points → Convert to Table)
  - Implement workflow execution using skeleton engine's executeWorkflow() function
  - Display step-by-step results with block name and output for each step
  - Show progress indicator during execution
  - Display final output after all steps complete
  - Handle partial failures by showing successful steps and error at failure point
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.4, 7.5_

- [x] 4.4 Test Workflow Builder with sample workflows
  - Test each of the 4 sample workflows end-to-end
  - Verify blocks execute in correct sequential order
  - Test custom workflows with 2, 3, and 4 blocks
  - Verify step-by-step output displays correctly with human-readable text
  - Test error recovery in multi-step workflows
  - Verify "No blocks selected" error displays when no checkboxes are checked
  - _Requirements: 8.2, 8.5_

- [x] 5. Final integration and documentation
  - _Requirements: 6.4_

- [x] 5.1 Create comprehensive README
  - Write README.md with project overview, features list, setup instructions (API key configuration), usage guide for both apps, and troubleshooting section
  - Include screenshots or descriptions of both applications
  - Document OpenRouter API key setup process
  - Add section explaining the free Qwen 2.5 7B model usage
  - _Requirements: 6.4_

- [x] 5.2 Verify skeleton engine reusability
  - Confirm both applications use identical skeleton engine files without modifications
  - Test that changes to skeleton engine affect both apps consistently
  - Verify no code duplication between apps for core functionality
  - _Requirements: 3.5_

- [x] 5.3 Run full system integration tests
  - Test all 6 blocks in Personal app with sample and custom data
  - Test all 4 sample workflows in Workflow Builder
  - Verify human-readable output in all scenarios (no JSON in UI)
  - Test error handling across both applications
  - Verify API key configuration works correctly
  - Test with actual OpenRouter API to confirm Qwen 2.5 7B model integration
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
