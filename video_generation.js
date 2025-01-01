const axios = require('axios');
require('dotenv').config();

class VirtusVideoGen {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.runwayml.com/v1';
  }

  async generateVideo(prompt, settings = {}) {
    const defaultSettings = {
      duration: 4,
      fps: 30,
      style: 'cinematic',
      quality: 'standard'
    };

    const finalSettings = { ...defaultSettings, ...settings };

    try {
      const response = await axios.post(
        `${this.baseUrl}/generate`,
        {
          prompt,
          ...finalSettings
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  async interpolateFrames(startFrame, endFrame, settings = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/interpolate`,
        {
          start_frame: startFrame,
          end_frame: endFrame,
          ...settings
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error interpolating frames:', error);
      throw error;
    }
  }
}

module.exports = VirtusVideoGen; 