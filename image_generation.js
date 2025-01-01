const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

class VirtusImageGen {
  constructor(apiKey) {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: apiKey
      })
    );
  }

  async generateImage(prompt, size = '1024x1024', n = 1) {
    try {
      const response = await this.openai.createImage({
        prompt,
        n,
        size,
        response_format: 'url'
      });

      return response.data.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  async generateVariation(imageBuffer, n = 1) {
    try {
      const response = await this.openai.createImageVariation({
        image: imageBuffer,
        n,
        size: '1024x1024'
      });

      return response.data.data[0].url;
    } catch (error) {
      console.error('Error generating variation:', error);
      throw error;
    }
  }
}

module.exports = VirtusImageGen; 