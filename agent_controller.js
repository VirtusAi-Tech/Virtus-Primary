const VirtusTwitterBot = require('./twitter_integration');
const VirtusDiscordBot = require('./discord_integration');
const VirtusTelegramBot = require('./telegram_integration');
const VirtusVoiceGen = require('./voice_generation');
const VirtusImageGen = require('./image_generation');
const VirtusVideoGen = require('./video_generation');

class VirtusAgent {
  constructor(config) {
    this.config = config;
    this.integrations = {};
    
    // Initialize enabled integrations
    if (config.integrations.twitter) {
      this.integrations.twitter = new VirtusTwitterBot(config);
    }
    if (config.integrations.discord) {
      this.integrations.discord = new VirtusDiscordBot(config);
    }
    if (config.integrations.telegram) {
      this.integrations.telegram = new VirtusTelegramBot(config);
    }
    if (config.integrations.voice) {
      this.integrations.voice = new VirtusVoiceGen(process.env.ELEVENLABS_API_KEY);
    }
    if (config.integrations.image_gen) {
      this.integrations.image = new VirtusImageGen(process.env.OPENAI_API_KEY);
    }
    if (config.integrations.video_gen) {
      this.integrations.video = new VirtusVideoGen(process.env.RUNWAY_API_KEY);
    }
  }

  async start() {
    try {
      // Start social media bots
      if (this.integrations.twitter) {
        await this.integrations.twitter.startStream();
      }
      if (this.integrations.discord) {
        await this.integrations.discord.start();
      }
      if (this.integrations.telegram) {
        await this.integrations.telegram.start();
      }

      console.log(`${this.config.name} is now active across all platforms`);
    } catch (error) {
      console.error('Error starting agent:', error);
      throw error;
    }
  }

  async processMessage(message, platform) {
    try {
      // Add AI processing logic here
      const response = `Response from ${this.config.name}: ${message}`;

      // Generate additional content if needed
      if (this.config.response_config.include_visuals) {
        const imageUrl = await this.integrations.image.generateImage(message);
        response.imageUrl = imageUrl;
      }

      if (this.config.response_config.include_voice) {
        const audioBuffer = await this.integrations.voice.generateVoice(response);
        response.audioBuffer = audioBuffer;
      }

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  async stop() {
    // Cleanup and shutdown integrations
    Object.values(this.integrations).forEach(integration => {
      if (integration.stop) {
        integration.stop();
      }
    });
    console.log(`${this.config.name} has been stopped`);
  }
}

module.exports = VirtusAgent; 