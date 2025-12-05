// Utility Functions - Helper functions for validation, error handling, and configuration

const MAX_INPUT_LENGTH = 10000;

// Validate input text
function validateInput(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Please enter some text to transform.' };
  }
  
  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return { valid: false, error: 'Please enter some text to transform.' };
  }
  
  if (trimmedText.length > MAX_INPUT_LENGTH) {
    return { valid: false, error: `Input text exceeds maximum length (${MAX_INPUT_LENGTH.toLocaleString()} characters).` };
  }
  
  return { valid: true, text: trimmedText };
}

// Format error messages for user-friendly display
function formatError(error) {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    // Handle common API errors
    if (error.message.includes('fetch')) {
      return 'Unable to connect to AI service. Please check your connection.';
    }
    if (error.message.includes('401') || error.message.includes('authentication')) {
      return 'API key invalid. Please configure OpenRouter API key.';
    }
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again with shorter text.';
    }
    
    return error.message;
  }
  
  return 'Unexpected response from AI service. Please try again.';
}

// Sanitize output to ensure human-readable text
function sanitizeOutput(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  let sanitized = text.trim();
  
  // Remove JSON formatting if present
  try {
    // Check if the text looks like JSON
    if ((sanitized.startsWith('{') && sanitized.endsWith('}')) || 
        (sanitized.startsWith('[') && sanitized.endsWith(']'))) {
      const parsed = JSON.parse(sanitized);
      
      // If it's an object with common response fields, extract the text
      if (parsed.text) {
        sanitized = parsed.text;
      } else if (parsed.content) {
        sanitized = parsed.content;
      } else if (parsed.output) {
        sanitized = parsed.output;
      } else if (parsed.result) {
        sanitized = parsed.result;
      } else if (Array.isArray(parsed)) {
        sanitized = parsed.join('\n');
      } else {
        // If it's a simple object, convert to readable format
        sanitized = JSON.stringify(parsed, null, 2);
      }
    }
  } catch (e) {
    // Not JSON, keep as is
  }
  
  // Remove markdown code blocks if present
  sanitized = sanitized.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  return sanitized.trim();
}

// Get API key from configuration
function getApiKey() {
  // Try to get from config.js (browser environment)
  if (typeof OPENROUTER_API_KEY !== 'undefined') {
    return OPENROUTER_API_KEY;
  }
  
  // Try to get from environment variable (Node.js environment)
  if (typeof process !== 'undefined' && process.env && process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }
  
  return null;
}

// Export for use in both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateInput, formatError, sanitizeOutput, getApiKey };
}
