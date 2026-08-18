export class CoreAgent {
  constructor(name, role, capabilities) {
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
    this.logs = [];
  }

  async processTask(taskInput, context = {}) {
    this.logAction(`Started task: ${taskInput.type}`);
    try {
      const result = await this.executeMockAI(taskInput, context);
      this.logAction(`Completed task: ${taskInput.type}`, 'SUCCESS');
      return result;
    } catch (error) {
      this.logAction(`Failed task: ${taskInput.type} - ${error.message}`, 'ERROR');
      throw error;
    }
  }

  executeMockAI(taskInput, context) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          decision: `Processed by ${this.name}`,
          confidence: Math.random().toFixed(2),
          timestamp: new Date().toISOString()
        });
      }, 800);
    });
  }

  logAction(message, level = 'INFO') {
    const entry = { timestamp: new Date().toISOString(), level, message };
    this.logs.push(entry);
    console.log(`[${this.name}] ${level}: ${message}`);
  }

  getLogs() {
    return this.logs;
  }
}
