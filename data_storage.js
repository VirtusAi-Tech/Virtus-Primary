const { Pool } = require('pg');

class DataStorage {
  constructor(config) {
    this.pool = new Pool(config);
    this.setupTables();
  }

  async setupTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        agent_id VARCHAR(255),
        platform VARCHAR(50),
        user_id VARCHAR(255),
        message TEXT,
        response TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS agent_stats (
        agent_id VARCHAR(255) PRIMARY KEY,
        total_messages INT DEFAULT 0,
        successful_responses INT DEFAULT 0,
        average_response_time FLOAT DEFAULT 0,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async logConversation(agentId, platform, userId, message, response) {
    const query = `
      INSERT INTO conversations (agent_id, platform, user_id, message, response)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const values = [agentId, platform, userId, message, response];
    const result = await this.pool.query(query, values);
    return result.rows[0].id;
  }

  async updateStats(agentId, responseTime, successful) {
    const query = `
      UPDATE agent_stats
      SET 
        total_messages = total_messages + 1,
        successful_responses = successful_responses + $1,
        average_response_time = (average_response_time * total_messages + $2) / (total_messages + 1),
        last_active = CURRENT_TIMESTAMP
      WHERE agent_id = $3
    `;
    
    const values = [successful ? 1 : 0, responseTime, agentId];
    await this.pool.query(query, values);
  }
}

module.exports = DataStorage; 