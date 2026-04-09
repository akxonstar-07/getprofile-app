import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paths
const PROJECT_ROOT = process.cwd();
const AGENTS_DIR = path.join(PROJECT_ROOT, 'agents');
const TASKS_DIR = path.join(PROJECT_ROOT, 'tasks');

export interface Agent {
  id: string;
  name: string;
  title: string;
  reportsTo: string | null;
  systemPrompt: string;
}

export interface Task {
  id: string;
  name: string;
  assignee: string;
  status: string;
  instructions: string;
}

export function loadAgents(): Record<string, Agent> {
  const agents: Record<string, Agent> = {};
  
  if (!fs.existsSync(AGENTS_DIR)) return agents;

  const folders = fs.readdirSync(AGENTS_DIR);
  for (const folder of folders) {
    const agentPath = path.join(AGENTS_DIR, folder, 'AGENTS.md');
    if (fs.existsSync(agentPath)) {
      const fileContents = fs.readFileSync(agentPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      agents[folder] = {
        id: folder,
        name: data.name || folder,
        title: data.title || '',
        reportsTo: data.reportsTo || null,
        systemPrompt: content.trim(),
      };
    }
  }
  return agents;
}

export function loadTasks(): Task[] {
  const tasks: Task[] = [];
  
  if (!fs.existsSync(TASKS_DIR)) return tasks;

  const folders = fs.readdirSync(TASKS_DIR);
  for (const folder of folders) {
    const taskPath = path.join(TASKS_DIR, folder, 'TASK.md');
    if (fs.existsSync(taskPath)) {
      const fileContents = fs.readFileSync(taskPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      tasks.push({
        id: folder,
        name: data.name || folder,
        assignee: data.assignee || 'ceo',
        status: data.status || 'todo',
        instructions: content.trim(),
      });
    }
  }
  
  return tasks;
}
