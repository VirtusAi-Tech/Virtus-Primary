require('dotenv').config();
const VirtusAgent = require('./agent_controller');
const techExpertConfig = require('../agent_templates/tech_expert.json');

async function main() {
  try {
    // Create a new agent instance
    const techAgent = new VirtusAgent(techExpertConfig);

    // Start the agent
    await techAgent.start();

    // Example message processing
    const response = await techAgent.processMessage(
      "Can you explain how blockchain works?",
      "discord"
    );
    console.log('Agent response:', response);

    // Handle cleanup on process termination
    process.on('SIGINT', async () => {
      console.log('Shutting down agent...');
      await techAgent.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main(); 