const { Telegraf } = require('telegraf');
require('dotenv').config();

class VirtusTelegramBot {
  constructor(agentConfig) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    this.agentConfig = agentConfig;
  }

  async start() {
    // Handle start command
    this.bot.command('start', async (ctx) => {
      await ctx.reply(`Hello! I'm ${this.agentConfig.name}, your Virtus AI assistant.`);
    });

    // Handle direct messages
    this.bot.on('text', async (ctx) => {
      if (ctx.message.text.startsWith('/')) return; // Skip commands
      
      try {
        // Add AI response logic here
        const response = `Processing your message: ${ctx.message.text}`;
        await ctx.reply(response);
      } catch (error) {
        console.error('Error processing message:', error);
        await ctx.reply('Sorry, I encountered an error processing your request.');
      }
    });

    // Error handling
    this.bot.catch((err, ctx) => {
      console.error('Telegram bot error:', err);
      ctx.reply('An error occurred while processing your request.');
    });

    // Start bot
    await this.bot.launch();
    console.log('Telegram bot started');

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}

module.exports = VirtusTelegramBot; 