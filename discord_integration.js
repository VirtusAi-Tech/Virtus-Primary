const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

class VirtusDiscordBot {
  constructor(agentConfig) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.agentConfig = agentConfig;
  }

  async start() {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}`);
    });

    this.client.on('messageCreate', async message => {
      if (message.author.bot) return;
      
      if (message.content.startsWith('!virtus')) {
        const command = message.content.slice(7).trim();
        await this.handleCommand(message, command);
      }
    });

    await this.client.login(process.env.DISCORD_TOKEN);
  }

  async handleCommand(message, command) {
    try {
      // Add AI response logic here
      const response = `Responding to: ${command}`;
      await message.reply(response);
    } catch (error) {
      console.error('Error handling command:', error);
      await message.reply('Sorry, I encountered an error processing your request.');
    }
  }
}

module.exports = VirtusDiscordBot; 