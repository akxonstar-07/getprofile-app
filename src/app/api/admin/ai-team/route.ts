import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Constants for workforce directories
const AGENTS_DIR = path.join(process.cwd(), "agents");
const TASKS_DIR = path.join(process.cwd(), "tasks");

export async function GET() {
  const session = await getServerSession(authOptions);
  
  const allowedRoles = ["ADMIN", "AGENCY"];
  if (!session?.user || !allowedRoles.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agents: any[] = [];
    const tasks: any[] = [];

    // 1. Load Agents
    if (fs.existsSync(AGENTS_DIR)) {
      const folders = fs.readdirSync(AGENTS_DIR);
      for (const folder of folders) {
        const agentPath = path.join(AGENTS_DIR, folder, "AGENTS.md");
        if (fs.existsSync(agentPath)) {
          const { data } = matter(fs.readFileSync(agentPath, "utf8"));
          agents.push({
            id: folder,
            name: data.name || folder,
            title: data.title || "Agent",
            status: "Active", // Mocking live status for now
          });
        }
      }
    }

    // 2. Load Tasks (Pending/Done)
    if (fs.existsSync(TASKS_DIR)) {
      const folders = fs.readdirSync(TASKS_DIR);
      for (const folder of folders) {
        const taskPath = path.join(TASKS_DIR, folder, "TASK.md");
        if (fs.existsSync(taskPath)) {
          const { data } = matter(fs.readFileSync(taskPath, "utf8"));
          tasks.push({
            id: folder,
            name: data.name || folder,
            assignee: data.assignee || "ceo",
            status: data.status || "todo",
          });
        }
      }
    }

    return NextResponse.json({
      agents,
      tasks,
      timestamp: new Date().toISOString(),
      workforceStatus: "Optimal",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
