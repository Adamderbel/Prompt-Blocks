// PromptBlocks Personal Application

// DOM Elements
const blockSelect = document.getElementById('blockSelect');
const blockDescription = document.getElementById('blockDescription');
const inputText = document.getElementById('inputText');
const sampleDataBtn = document.getElementById('sampleDataBtn');
const transformBtn = document.getElementById('transformBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const outputText = document.getElementById('outputText');
const copyBtn = document.getElementById('copyBtn');

// State
let selectedBlockId = null;

// Initialize application
function init() {
    populateBlockSelector();
    attachEventListeners();
}

// Populate block selector dropdown
function populateBlockSelector() {
    const blocks = getAllBlocks();
    
    blocks.forEach(block => {
        const option = document.createElement('option');
        option.value = block.id;
        option.textContent = block.name;
        blockSelect.appendChild(option);
    });
}

// Attach event listeners
function attachEventListeners() {
    blockSelect.addEventListener('change', handleBlockSelection);
    sampleDataBtn.addEventListener('click', handleSampleData);
    transformBtn.addEventListener('click', handleTransform);
    copyBtn.addEventListener('click', handleCopy);
}

// Handle block selection
function handleBlockSelection(event) {
    selectedBlockId = event.target.value;
    
    if (selectedBlockId) {
        const block = getBlock(selectedBlockId);
        blockDescription.textContent = block.description;
        sampleDataBtn.disabled = false;
        transformBtn.disabled = false;
    } else {
        blockDescription.textContent = '';
        sampleDataBtn.disabled = true;
        transformBtn.disabled = true;
    }
    
    // Clear previous output and errors
    clearOutput();
    clearError();
}

// Handle "Try Sample Data" button
function handleSampleData() {
    if (!selectedBlockId) {
        showError('Please select a block first.');
        return;
    }
    
    const sampleData = getSampleData(selectedBlockId);
    inputText.value = sampleData;
    clearError();
}

// Handle "Transform" button
async function handleTransform() {
    if (!selectedBlockId) {
        showError('Please select a block first.');
        return;
    }
    
    const input = inputText.value.trim();
    
    // Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
        showError(validation.error);
        return;
    }
    
    // Clear previous output and errors
    clearOutput();
    clearError();
    
    // Show loading state
    showLoading();
    disableButtons();
    
    try {
        // Execute block
        const result = await executeBlock(selectedBlockId, input);
        
        // Display result
        displayOutput(result);
    } catch (error) {
        // Display error
        showError(formatError(error));
    } finally {
        // Hide loading state
        hideLoading();
        enableButtons();
    }
}

// Display output
function displayOutput(text) {
    // Sanitize output to ensure human-readable format
    const sanitized = sanitizeOutput(text);
    outputText.textContent = sanitized;
    copyBtn.style.display = 'inline-block';
}

// Handle copy to clipboard
async function handleCopy() {
    const text = outputText.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Show success feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('success');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('success');
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard. Please try selecting and copying manually.');
    }
}

// Clear output
function clearOutput() {
    outputText.textContent = '';
    copyBtn.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Clear error message
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// Show loading indicator
function showLoading() {
    loadingIndicator.classList.add('show');
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.classList.remove('show');
}

// Disable buttons during processing
function disableButtons() {
    sampleDataBtn.disabled = true;
    transformBtn.disabled = true;
}

// Enable buttons after processing
function enableButtons() {
    if (selectedBlockId) {
        sampleDataBtn.disabled = false;
        transformBtn.disabled = false;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
