import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { loadAgents, loadTasks } from './parser';
import { askOllama } from './ollama-client';

const COMPLETED_DIR = path.join(process.cwd(), 'completed-tasks');

async function runOrchestrator() {
  console.log(chalk.blue.bold('\n🚀 Starting GetProfile AI Team Orchestrator...\n'));

  // 1. Load the Org Chart
  const agents = loadAgents();
  const agentIds = Object.keys(agents);
  
  if (agentIds.length === 0) {
    console.log(chalk.red('❌ No agents found in agents/ directory!'));
    process.exit(1);
  }
  
  console.log(chalk.cyan(`✅ Loaded ${agentIds.length} Agents from Org Chart:`));
  agentIds.forEach(id => console.log(`   - ${chalk.yellow(agents[id].name)} (${agents[id].title})`));
  console.log('\n');

  // 2. Load Tasks
  const tasks = loadTasks();
  const pendingTasks = tasks.filter(t => t.status === 'approved' || (t.status !== 'done' && t.status !== 'awaiting_approval'));
  
  const awaitingApproval = tasks.filter(t => t.status === 'awaiting_approval');
  if (awaitingApproval.length > 0) {
    console.log(chalk.yellow(`⏳ ${awaitingApproval.length} tasks are parked awaiting human approval.`));
  }

  if (pendingTasks.length === 0) {
    console.log(chalk.green('🎉 No approved items in the queue. The workforce is on standby.'));
    process.exit(0);
  }

  console.log(chalk.cyan(`📥 Found ${pendingTasks.length} Pending Tasks in Inbox:`));
  
  // Create output directory for completed work
  if (!fs.existsSync(COMPLETED_DIR)) {
    fs.mkdirSync(COMPLETED_DIR);
  }

  // 3. Process Tasks Sequentially
  for (const task of pendingTasks) {
    console.log(chalk.magenta.bold(`\n📝 Assigning [${task.id}]...`));
    
    // Find the assigned agent (fallback to CEO)
    let agent = agents[task.assignee];
    if (!agent) {
      console.log(chalk.yellow(`⚠️ Assignee '${task.assignee}' not found. Escalating to CEO.`));
      agent = agents['ceo'];
    }

    console.log(chalk.white(`   ${chalk.yellow(agent.name)} is now working on: "${task.name}"`));
    console.log(chalk.gray(`   Connecting to local Llama3... please wait.\n`));

    try {
      // Send task to the custom AI employee
      const response = await askOllama(task.instructions, agent.systemPrompt);

      // Save the output
      const outputPath = path.join(COMPLETED_DIR, `${task.id}.md`);
      const outputContent = `# Output from ${agent.name} for ${task.id}\n\n${response}`;
      fs.writeFileSync(outputPath, outputContent);

      console.log(chalk.green(`✅ Done! Output saved to: ${outputPath}`));
      
      // Update the TASK.md status to done (optional enhancement for later)

    } catch (e: any) {
      console.log(chalk.red(`❌ Task failed: ${e.message}`));
    }
  }
  
  console.log(chalk.blue.bold('\n🏁 Orchestrator cycle complete.\n'));
}

runOrchestrator().catch(e => {
  console.error(chalk.red("Fatal Orchestrator Error:"), e);
});
