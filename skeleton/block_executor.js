// Block Executor - Executes individual blocks using OpenRouter

// OpenRouter API configuration
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nousresearch/hermes-3-llama-3.1-70b';
const TEMPERATURE = 0.7;
const MAX_TOKENS = 1000;
const TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRIES = 3; // Number of retry attempts for rate limits
const INITIAL_RETRY_DELAY = 2000; // Initial delay in ms (2 seconds)

// Execute a single block with the given input
async function executeBlock(blockId, inputText, options = {}) {
  // Load dependencies
  const { getBlock } = typeof module !== 'undefined' && module.exports 
    ? require('./block_registry.js')
    : window;
  
  const { validateInput, formatError, sanitizeOutput, getApiKey } = typeof module !== 'undefined' && module.exports
    ? require('./utils.js')
    : window;
  
  // Validate input
  const validation = validateInput(inputText);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Get block definition
  const block = getBlock(blockId);
  if (!block) {
    throw new Error(`Block not found: ${blockId}`);
  }
  
  // Get API key
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key invalid. Please configure OpenRouter API key.');
  }
  
  // Prepare API request
  const requestBody = {
    model: MODEL,
    messages: [
      { role: 'system', content: block.prompt },
      { role: 'user', content: validation.text }
    ],
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS
  };
  
  // Retry logic with exponential backoff for rate limits
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      // Make API request
      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key invalid. Please configure OpenRouter API key.');
        }
        if (response.status === 429) {
          // Rate limit - retry with exponential backoff
          if (attempt < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
            console.log(`Rate limited. Retrying in ${delay/1000} seconds... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue; // Retry
          }
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
      
      // Parse response
      const data = await response.json();
      
      // Extract text from response
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Unexpected response from AI service. Please try again.');
      }
      
      const outputText = data.choices[0].message.content;
      
      // Sanitize output to ensure human-readable text
      const sanitized = sanitizeOutput(outputText);
      
      return sanitized;
      
    } catch (error) {
      lastError = error;
      
      // Handle timeout
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again with shorter text.');
      }
      
      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new Error('Unable to connect to AI service. Please check your connection.');
      }
      
      // If it's not a rate limit error, throw immediately
      if (!error.message.includes('Too many requests')) {
        throw new Error(formatError(error));
      }
      
      // If we've exhausted retries, throw the error
      if (attempt >= MAX_RETRIES) {
        throw new Error(formatError(error));
      }
    }
  }
  
  // If we get here, throw the last error
  throw new Error(formatError(lastError));

}

// Export for use in both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { executeBlock };
}
