// Block Registry - Central registry of all available blocks

const blocks = [
  {
    id: 'summarizeText',
    name: 'summarizeText',
    description: 'Condense text to key points',
    prompt: 'You are a summarization assistant. Provide a concise summary of the following text, highlighting the main points in clear, readable format. Return only the summary text without any JSON formatting.',
    sampleInput: 'Artificial intelligence has transformed the way we interact with technology in our daily lives. From voice assistants like Siri and Alexa to recommendation systems on Netflix and Spotify, AI is everywhere. Machine learning algorithms analyze vast amounts of data to identify patterns and make predictions, enabling personalized experiences for users. Natural language processing allows computers to understand and generate human language, making chatbots and virtual assistants more conversational and helpful. Computer vision enables machines to interpret and understand visual information from the world, powering applications like facial recognition and autonomous vehicles. Deep learning, a subset of machine learning inspired by the structure of the human brain, has achieved remarkable breakthroughs in image recognition, speech recognition, and game playing.'
  },
  {
    id: 'extractKeyPoints',
    name: 'extractKeyPoints',
    description: 'Identify and list main ideas',
    prompt: 'You are a key point extraction assistant. Identify and list the main ideas from the following text as clear bullet points. Return only the bullet points without any JSON formatting.',
    sampleInput: 'In our quarterly meeting, we discussed several important topics. First, the sales team reported a 15% increase in revenue compared to last quarter, primarily driven by new customer acquisitions in the enterprise segment. Second, the product team announced the upcoming launch of three new features based on customer feedback, scheduled for release in the next sprint. Third, we reviewed the customer satisfaction scores which showed improvement in support response times but identified areas for improvement in product documentation. Fourth, the marketing team presented their campaign results showing strong engagement on social media platforms.'
  },
  {
    id: 'improveWritingQuality',
    name: 'improveWritingQuality',
    description: 'Enhance clarity, grammar, and style',
    prompt: 'You are a writing improvement assistant. Enhance the following text by improving clarity, fixing grammar errors, and refining style while maintaining the original meaning. Return only the improved text without any JSON formatting.',
    sampleInput: 'The company are planning to launch there new product next month but their still working on final testing. Its been a long development process with many challenge but the team is very excited about the results. We believes this product will be game changer in the market and help us to compete better with our competitor.'
  },
  {
    id: 'rewriteAsEmail',
    name: 'rewriteAsEmail',
    description: 'Convert text to professional email format',
    prompt: 'You are an email writing assistant. Convert the following text into a professional email format with appropriate greeting, body, and closing. Return only the email text without any JSON formatting.',
    sampleInput: 'Hey, just wanted to let you know the project deadline got moved up to next Friday. We need to finish the design mockups and get feedback from the client before then. Can you prioritize this? Also the budget discussion needs to happen this week.'
  },
  {
    id: 'translateText',
    name: 'translateText',
    description: 'Convert text between languages',
    prompt: 'You are a translation assistant. Translate the following text to Spanish. Maintain the tone and meaning of the original text. Return only the translated text without any JSON formatting.',
    sampleInput: 'Welcome to our platform! We are excited to have you here. Our mission is to make technology accessible to everyone. Whether you are a beginner or an expert, we have tools and resources to help you succeed.'
  },
  {
    id: 'convertToTable',
    name: 'convertToTable',
    description: 'Structure text data as tabular format',
    prompt: 'You are a data structuring assistant. Convert the following text into a well-formatted markdown table. Identify the appropriate columns and organize the information clearly. Return only the markdown table without any JSON formatting.',
    sampleInput: 'Product: Laptop, Price: $999, Stock: 15 units, Category: Electronics. Product: Desk Chair, Price: $299, Stock: 8 units, Category: Furniture. Product: Monitor, Price: $449, Stock: 22 units, Category: Electronics.'
  }
];

// Get a specific block by ID
function getBlock(blockId) {
  return blocks.find(block => block.id === blockId);
}

// Get all available blocks
function getAllBlocks() {
  return [...blocks];
}

// Register a new block (for extensibility)
function registerBlock(block) {
  if (!block.id || !block.name || !block.description || !block.prompt) {
    throw new Error('Block must have id, name, description, and prompt properties');
  }
  
  const existingIndex = blocks.findIndex(b => b.id === block.id);
  if (existingIndex >= 0) {
    blocks[existingIndex] = block;
  } else {
    blocks.push(block);
  }
}

// Export for use in both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getBlock, getAllBlocks, registerBlock };
}
