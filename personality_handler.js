class PersonalityHandler {
  constructor(agentConfig) {
    this.personality = agentConfig.personality;
    this.responseSettings = agentConfig.response_config;
    this.name = agentConfig.name;
  }

  generateSystemPrompt() {
    return `You are ${this.name}, an AI with the following traits: 
    ${this.personality.traits.join(', ')}. 
    Your background: ${this.personality.background}
    Communication style: ${this.personality.communication_style}
    Expertise level: ${this.personality.expertise_level}
    
    Always maintain this personality and background in your responses.`;
  }

  formatResponse(response, platform) {
    switch (platform) {
      case 'twitter':
        return this.formatTwitterResponse(response);
      case 'discord':
        return this.formatDiscordResponse(response);
      case 'telegram':
        return this.formatTelegramResponse(response);
      default:
        return response;
    }
  }

  formatTwitterResponse(response) {
    // Ensure response fits Twitter's character limit
    if (response.length > 280) {
      return response.substring(0, 277) + '...';
    }
    return response;
  }

  formatDiscordResponse(response) {
    // Add Discord-specific formatting
    return {
      content: response,
      embeds: [{
        title: `Response from ${this.name}`,
        description: response,
        color: 0x0099ff
      }]
    };
  }

  formatTelegramResponse(response) {
    // Add Telegram-specific formatting
    return {
      text: response,
      parse_mode: 'Markdown'
    };
  }
}

module.exports = PersonalityHandler; 