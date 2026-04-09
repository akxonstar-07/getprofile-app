import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const TASKS_DIR = path.join(process.cwd(), "tasks");

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "AGENCY"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, assignee, instructions } = await request.json();
    const taskId = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
    const taskDir = path.join(TASKS_DIR, taskId);

    if (!fs.existsSync(taskDir)) {
      fs.mkdirSync(taskDir, { recursive: true });
    }

    const taskContent = `---
name: ${name}
assignee: ${assignee}
status: awaiting_approval
createdAt: ${new Date().toISOString()}
---

# ${name}
${instructions}
`;

    fs.writeFileSync(path.join(taskDir, "TASK.md"), taskContent);

    return NextResponse.json({ success: true, taskId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "AGENCY"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskId, status } = await request.json();
    const taskPath = path.join(TASKS_DIR, taskId, "TASK.md");

    if (!fs.existsSync(taskPath)) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const fileContents = fs.readFileSync(taskPath, "utf8");
    const { data, content } = matter(fileContents);
    
    const updatedContent = matter.stringify(content, {
      ...data,
      status
    });

    fs.writeFileSync(taskPath, updatedContent);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
