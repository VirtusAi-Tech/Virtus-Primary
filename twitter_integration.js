const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

class VirtusTwitterBot {
  constructor(agentConfig) {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    this.agentConfig = agentConfig;
  }

  async tweet(content) {
    try {
      const tweet = await this.client.v2.tweet(content);
      console.log('Tweet posted:', tweet.data.id);
      return tweet;
    } catch (error) {
      console.error('Error posting tweet:', error);
      throw error;
    }
  }

  async respondToMention(mentionId, content) {
    try {
      const reply = await this.client.v2.reply(content, mentionId);
      console.log('Reply posted:', reply.data.id);
      return reply;
    } catch (error) {
      console.error('Error posting reply:', error);
      throw error;
    }
  }

  async startStream() {
    const rules = await this.client.v2.streamRules();
    if (rules.data?.length) {
      await this.client.v2.updateStreamRules({
        delete: { ids: rules.data.map(rule => rule.id) },
      });
    }

    await this.client.v2.updateStreamRules({
      add: [{ value: `@${this.agentConfig.twitter_username}` }],
    });

    const stream = await this.client.v2.searchStream({
      'tweet.fields': ['referenced_tweets', 'author_id'],
    });

    stream.on('data', async tweet => {
      // Handle incoming tweets
      console.log('New mention:', tweet);
      // Add AI response logic here
    });
  }
}

module.exports = VirtusTwitterBot; 