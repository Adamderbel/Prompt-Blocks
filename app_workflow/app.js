// PromptBlocks Workflow Builder Application

// DOM Elements
const blockCheckboxes = document.querySelectorAll('input[name="block"]');
const sampleWorkflowSelect = document.getElementById('sampleWorkflow');
const inputText = document.getElementById('inputText');
const runWorkflowBtn = document.getElementById('runWorkflowBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const workflowResults = document.getElementById('workflowResults');
const resultsActions = document.getElementById('resultsActions');
const copyAllBtn = document.getElementById('copyAllBtn');
const exportBtn = document.getElementById('exportBtn');
const saveWorkflowBtn = document.getElementById('saveWorkflowBtn');
const loadWorkflowBtn = document.getElementById('loadWorkflowBtn');

// Sample Workflows
const sampleWorkflows = {
    'content-pipeline': {
        name: 'Content Pipeline',
        blocks: ['summarizeText', 'extractKeyPoints'],
        sampleInput: 'Artificial intelligence has transformed the way we interact with technology in our daily lives. From voice assistants like Siri and Alexa to recommendation systems on Netflix and Spotify, AI is everywhere. Machine learning algorithms analyze vast amounts of data to identify patterns and make predictions, enabling personalized experiences for users. Natural language processing allows computers to understand and generate human language, making chatbots and virtual assistants more conversational and helpful.'
    },
    'communication-pipeline': {
        name: 'Communication Pipeline',
        blocks: ['improveWritingQuality', 'rewriteAsEmail'],
        sampleInput: 'The company are planning to launch there new product next month but their still working on final testing. Its been a long development process with many challenge but the team is very excited about the results.'
    },
    'multilingual-workflow': {
        name: 'Multilingual Workflow',
        blocks: ['summarizeText', 'translateText'],
        sampleInput: 'Welcome to our platform! We are excited to have you here. Our mission is to make technology accessible to everyone. Whether you are a beginner or an expert, we have tools and resources to help you succeed. Please explore our features and let us know if you have any questions.'
    },
    'data-extraction': {
        name: 'Data Extraction',
        blocks: ['extractKeyPoints', 'convertToTable'],
        sampleInput: 'In our quarterly meeting, we discussed several important topics. First, the sales team reported a 15% increase in revenue compared to last quarter. Second, the product team announced the upcoming launch of three new features. Third, we reviewed the customer satisfaction scores which showed improvement in support response times.'
    }
};

// Initialize application
function init() {
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    sampleWorkflowSelect.addEventListener('change', handleSampleWorkflowSelection);
    runWorkflowBtn.addEventListener('click', handleRunWorkflow);
    copyAllBtn.addEventListener('click', handleCopyAll);
    exportBtn.addEventListener('click', handleExport);
    saveWorkflowBtn.addEventListener('click', handleSaveWorkflow);
    loadWorkflowBtn.addEventListener('click', handleLoadWorkflow);
}

// Handle sample workflow selection
function handleSampleWorkflowSelection(event) {
    const workflowId = event.target.value;
    
    if (!workflowId) {
        return;
    }
    
    const workflow = sampleWorkflows[workflowId];
    
    // Uncheck all checkboxes first
    blockCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Check the boxes for the selected workflow
    workflow.blocks.forEach(blockId => {
        const checkbox = document.querySelector(`input[value="${blockId}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Load sample input if available
    if (workflow.sampleInput) {
        inputText.value = workflow.sampleInput;
    }
    
    clearError();
    clearResults();
}

// Get selected block IDs from checkboxes
function getSelectedBlocks() {
    const selected = [];
    blockCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selected.push(checkbox.value);
        }
    });
    return selected;
}

// Handle "Run Workflow" button
async function handleRunWorkflow() {
    const selectedBlocks = getSelectedBlocks();
    
    // Validate block selection
    if (selectedBlocks.length === 0) {
        showError('Please select at least one block for the workflow.');
        return;
    }
    
    const input = inputText.value.trim();
    
    // Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
        showError(validation.error);
        return;
    }
    
    // Clear previous results and errors
    clearResults();
    clearError();
    
    // Show loading state
    showLoading();
    disableControls();
    
    try {
        // Execute workflow
        const result = await executeWorkflow(selectedBlocks, input);
        
        // Display results
        displayWorkflowResults(result);
    } catch (error) {
        // Display error
        showError(formatError(error));
        
        // If there are partial results, try to display them
        if (error.partialResults) {
            displayPartialResults(error.partialResults);
        }
    } finally {
        // Hide loading state
        hideLoading();
        enableControls();
    }
}

// Display workflow results
function displayWorkflowResults(result) {
    clearResults();
    
    // Display each step
    result.steps.forEach((step, index) => {
        const stepElement = createStepElement(step, index + 1);
        workflowResults.appendChild(stepElement);
    });
    
    // Show action buttons
    resultsActions.style.display = 'flex';
}

// Display partial results (when workflow fails mid-execution)
function displayPartialResults(steps) {
    clearResults();
    
    steps.forEach((step, index) => {
        const stepElement = createStepElement(step, index + 1);
        workflowResults.appendChild(stepElement);
    });
}

// Create step element
function createStepElement(step, stepNumber) {
    const stepDiv = document.createElement('div');
    stepDiv.className = `workflow-step ${step.success ? 'success' : 'error'}`;
    
    // Step header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'step-header';
    
    const numberSpan = document.createElement('span');
    numberSpan.className = 'step-number';
    numberSpan.textContent = stepNumber;
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'step-name';
    nameSpan.textContent = step.blockName;
    
    headerDiv.appendChild(numberSpan);
    headerDiv.appendChild(nameSpan);
    stepDiv.appendChild(headerDiv);
    
    // Step output or error
    if (step.success) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'step-output';
        outputDiv.textContent = sanitizeOutput(step.output);
        stepDiv.appendChild(outputDiv);
    } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'step-error';
        errorDiv.textContent = `Error: ${step.error}`;
        stepDiv.appendChild(errorDiv);
    }
    
    return stepDiv;
}

// Create final output element
function createFinalOutputElement(finalOutput) {
    const finalDiv = document.createElement('div');
    finalDiv.className = 'final-output';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'final-output-label';
    labelDiv.textContent = '✓ Final Output';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'final-output-text';
    textDiv.textContent = sanitizeOutput(finalOutput);
    
    finalDiv.appendChild(labelDiv);
    finalDiv.appendChild(textDiv);
    
    return finalDiv;
}

// Clear results
function clearResults() {
    workflowResults.innerHTML = '';
    resultsActions.style.display = 'none';
}

// Handle copy all results
async function handleCopyAll() {
    const steps = workflowResults.querySelectorAll('.step-output, .final-output-text');
    const allText = Array.from(steps).map(step => step.textContent).join('\n\n---\n\n');
    
    try {
        await navigator.clipboard.writeText(allText);
        
        // Show success feedback
        const originalText = copyAllBtn.textContent;
        copyAllBtn.textContent = '✓ Copied!';
        copyAllBtn.classList.add('success');
        
        setTimeout(() => {
            copyAllBtn.textContent = originalText;
            copyAllBtn.classList.remove('success');
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard.');
    }
}

// Handle export results
function handleExport() {
    const steps = workflowResults.querySelectorAll('.workflow-step');
    let exportText = '# Workflow Results\n\n';
    exportText += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    steps.forEach((step, index) => {
        const stepName = step.querySelector('.step-name').textContent;
        const stepOutput = step.querySelector('.step-output, .final-output-text');
        
        if (stepOutput) {
            exportText += `## ${stepName}\n\n${stepOutput.textContent}\n\n---\n\n`;
        }
    });
    
    // Create download
    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-results-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success feedback
    const originalText = exportBtn.textContent;
    exportBtn.textContent = '✓ Exported!';
    exportBtn.classList.add('success');
    
    setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.classList.remove('success');
    }, 2000);
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

// Disable controls during processing
function disableControls() {
    blockCheckboxes.forEach(checkbox => checkbox.disabled = true);
    sampleWorkflowSelect.disabled = true;
    runWorkflowBtn.disabled = true;
}

// Enable controls after processing
function enableControls() {
    blockCheckboxes.forEach(checkbox => checkbox.disabled = false);
    sampleWorkflowSelect.disabled = false;
    runWorkflowBtn.disabled = false;
}

// Handle save workflow
function handleSaveWorkflow() {
    const selectedBlocks = getSelectedBlocks();
    
    if (selectedBlocks.length === 0) {
        showError('Please select at least one block to save.');
        return;
    }
    
    const workflowName = prompt('Enter a name for this workflow:');
    if (!workflowName) return;
    
    const workflow = {
        name: workflowName,
        blocks: selectedBlocks,
        savedAt: new Date().toISOString()
    };
    
    // Get existing workflows
    const savedWorkflows = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
    
    // Add new workflow
    savedWorkflows.push(workflow);
    
    // Save to localStorage
    localStorage.setItem('savedWorkflows', JSON.stringify(savedWorkflows));
    
    // Show success feedback
    const originalText = saveWorkflowBtn.textContent;
    saveWorkflowBtn.textContent = '✓ Saved!';
    saveWorkflowBtn.classList.add('success');
    
    setTimeout(() => {
        saveWorkflowBtn.textContent = originalText;
        saveWorkflowBtn.classList.remove('success');
    }, 2000);
    
    clearError();
}

// Handle load workflow
function handleLoadWorkflow() {
    const savedWorkflows = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
    
    if (savedWorkflows.length === 0) {
        showError('No saved workflows found. Create and save a workflow first.');
        return;
    }
    
    // Create selection dialog
    let message = 'Select a workflow to load:\n\n';
    savedWorkflows.forEach((workflow, index) => {
        const date = new Date(workflow.savedAt).toLocaleDateString();
        message += `${index + 1}. ${workflow.name} (${workflow.blocks.length} blocks, saved ${date})\n`;
    });
    message += '\nEnter the number of the workflow to load (or 0 to cancel):';
    
    const selection = prompt(message);
    if (!selection || selection === '0') return;
    
    const index = parseInt(selection) - 1;
    if (index < 0 || index >= savedWorkflows.length) {
        showError('Invalid selection.');
        return;
    }
    
    const workflow = savedWorkflows[index];
    
    // Uncheck all checkboxes first
    blockCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Check the boxes for the loaded workflow
    workflow.blocks.forEach(blockId => {
        const checkbox = document.querySelector(`input[value="${blockId}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Show success feedback
    const originalText = loadWorkflowBtn.textContent;
    loadWorkflowBtn.textContent = '✓ Loaded!';
    loadWorkflowBtn.classList.add('success');
    
    setTimeout(() => {
        loadWorkflowBtn.textContent = originalText;
        loadWorkflowBtn.classList.remove('success');
    }, 2000);
    
    clearError();
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
