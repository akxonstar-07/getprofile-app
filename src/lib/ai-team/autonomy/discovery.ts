import fs from 'fs';
import path from 'path';
import { loadAgents } from '../parser';
import { askOllama } from '../ollama-client';

const TASKS_DIR = path.join(process.cwd(), 'tasks');

/**
 * Autonomous Discovery Cycle:
 * - Picks a 'Discovery-capable' agent.
 * - Simulates a 'Platform Scan' (reading current trends/tasks).
 * - Generates a PROPOSED TASK for the user to approve.
 */
export async function runAutonomousDiscovery() {
  const agents = loadAgents();
  const discoveryAgents = ["trend-analyst", "ux-expert", "creative-director", "branding-expert"];
  const selectedId = discoveryAgents[Math.floor(Math.random() * discoveryAgents.length)];
  const agent = agents[selectedId];

  if (!agent) return;

  const discoveryPrompt = `
    You are in PROACTIVE DISCOVERY MODE. 
    Analyze the current state of "getprofile.link" (a high-end creator portfolio SaaS).
    
    Current trends: Bento Grids, Glassmorphism, Micro-interactions, AI-driven personalization.
    
    Based on your specialization as ${agent.title}, propose ONE high-impact feature or design improvement that will elevate the platform to a 10/10 elite standard.
    
    Structure your output as a NEW TASK definition:
    1. Name: (e.g. "Implement Glassmorphic Link Hover FX")
    2. Recipient: (Choose a relevant agent ID from our workforce)
    3. Detailed Instructions: (Clear steps for the agent to follow)
  `;

  try {
    const rawProposal = await askOllama(discoveryPrompt, agent.systemPrompt);
    
    // Parse proposal (Basic regex extraction)
    const nameMatch = rawProposal.match(/Name:\s*(.*)/i);
    const recipientMatch = rawProposal.match(/Recipient:\s*(.*)/i);
    const instructions = rawProposal.split("Instructions:")[1] || rawProposal;

    const taskName = nameMatch ? nameMatch[1].trim() : "Proactive Suggestion";
    const assignee = recipientMatch ? recipientMatch[1].trim().toLowerCase() : "lead-engineer";

    const taskId = `proactive-${Date.now()}`;
    const taskDir = path.join(TASKS_DIR, taskId);
    
    if (!fs.existsSync(taskDir)) fs.mkdirSync(taskDir, { recursive: true });

    const taskContent = `---
name: ${taskName}
assignee: ${assignee}
status: awaiting_approval
source: autonomous-discovery
agent: ${agent.id}
---

# ${taskName}
**Proactive Suggestion from ${agent.name} (${agent.title})**

${instructions.trim()}
`;

    fs.writeFileSync(path.join(taskDir, "TASK.md"), taskContent);
    return { success: true, taskId, suggestion: taskName };
  } catch (error) {
    console.error("Discovery Error:", error);
    return { success: false, error };
  }
}
