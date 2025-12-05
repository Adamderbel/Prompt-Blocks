// Workflow Engine - Executes multiple blocks sequentially

// Execute a workflow with multiple blocks in sequence
async function executeWorkflow(blockIds, initialInput) {
  // Load dependencies
  const { getBlock } = typeof module !== 'undefined' && module.exports 
    ? require('./block_registry.js')
    : window;
  
  const { executeBlock } = typeof module !== 'undefined' && module.exports
    ? require('./block_executor.js')
    : window;
  
  const { validateInput } = typeof module !== 'undefined' && module.exports
    ? require('./utils.js')
    : window;
  
  // Validate initial input
  const validation = validateInput(initialInput);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Validate block IDs
  if (!blockIds || !Array.isArray(blockIds) || blockIds.length === 0) {
    throw new Error('Please select at least one block for the workflow.');
  }
  
  // Verify all blocks exist
  for (const blockId of blockIds) {
    const block = getBlock(blockId);
    if (!block) {
      throw new Error(`Block not found: ${blockId}`);
    }
  }
  
  // Initialize workflow result
  const workflowResult = {
    steps: [],
    finalOutput: ''
  };
  
  let currentInput = validation.text;
  
  // Execute blocks sequentially
  for (let i = 0; i < blockIds.length; i++) {
    const blockId = blockIds[i];
    const block = getBlock(blockId);
    
    const stepResult = {
      blockId: blockId,
      blockName: block.name,
      input: currentInput,
      output: '',
      success: false,
      error: null
    };
    
    try {
      // Execute the block
      const output = await executeBlock(blockId, currentInput);
      
      stepResult.output = output;
      stepResult.success = true;
      
      // Use output as input for next block
      currentInput = output;
      
    } catch (error) {
      // Handle error - stop workflow and return partial results
      stepResult.success = false;
      stepResult.error = error.message || 'An error occurred during execution';
      
      workflowResult.steps.push(stepResult);
      
      // Return partial results with error
      throw new Error(`Workflow failed at step ${i + 1} (${block.name}): ${stepResult.error}`);
    }
    
    workflowResult.steps.push(stepResult);
  }
  
  // Set final output to the last successful step's output
  workflowResult.finalOutput = currentInput;
  
  return workflowResult;
}

// Export for use in both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { executeWorkflow };
}
