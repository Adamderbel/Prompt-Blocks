// Sample Data - Provides test data for each block

const sampleData = {
  'summarizeText': 'Artificial intelligence has transformed the way we interact with technology in our daily lives. From voice assistants like Siri and Alexa to recommendation systems on Netflix and Spotify, AI is everywhere. Machine learning algorithms analyze vast amounts of data to identify patterns and make predictions, enabling personalized experiences for users. Natural language processing allows computers to understand and generate human language, making chatbots and virtual assistants more conversational and helpful. Computer vision enables machines to interpret and understand visual information from the world, powering applications like facial recognition and autonomous vehicles.',
  
  'extractKeyPoints': 'In our quarterly meeting, we discussed several important topics. First, the sales team reported a 15% increase in revenue compared to last quarter, primarily driven by new customer acquisitions in the enterprise segment. Second, the product team announced the upcoming launch of three new features based on customer feedback, scheduled for release in the next sprint. Third, we reviewed the customer satisfaction scores which showed improvement in support response times but identified areas for improvement in product documentation. Fourth, the marketing team presented their campaign results showing strong engagement on social media platforms.',
  
  'improveWritingQuality': 'The company are planning to launch there new product next month but their still working on final testing. Its been a long development process with many challenge but the team is very excited about the results. We believes this product will be game changer in the market and help us to compete better with our competitor.',
  
  'rewriteAsEmail': 'Hey, just wanted to let you know the project deadline got moved up to next Friday. We need to finish the design mockups and get feedback from the client before then. Can you prioritize this? Also the budget discussion needs to happen this week.',
  
  'translateText': 'Welcome to our platform! We are excited to have you here. Our mission is to make technology accessible to everyone. Whether you are a beginner or an expert, we have tools and resources to help you succeed.',
  
  'convertToTable': 'Product: Laptop, Price: $999, Stock: 15 units, Category: Electronics. Product: Desk Chair, Price: $299, Stock: 8 units, Category: Furniture. Product: Monitor, Price: $449, Stock: 22 units, Category: Electronics.'
};

// Get sample data for a specific block
function getSampleData(blockId) {
  return sampleData[blockId] || '';
}

// Export for use in both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getSampleData };
}
