import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Next.js config to force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AITeamDashboard() {
  const PROJECT_ROOT = process.cwd();
  const AGENTS_DIR = path.join(PROJECT_ROOT, "agents");
  const COMPLETED_DIR = path.join(PROJECT_ROOT, "completed-tasks");

  // Load Agents
  let agents: Record<string, any> = {};
  if (fs.existsSync(AGENTS_DIR)) {
    const folders = fs.readdirSync(AGENTS_DIR);
    for (const folder of folders) {
      const agentPath = path.join(AGENTS_DIR, folder, "AGENTS.md");
      if (fs.existsSync(agentPath)) {
        const fileContents = fs.readFileSync(agentPath, "utf8");
        const { data } = matter(fileContents);
        agents[folder] = {
          id: folder,
          name: data.name || folder,
          title: data.title || "Specialist",
        };
      }
    }
  }

  // Load Completed Tasks
  let completedTasks: { filename: string; content: string }[] = [];
  if (fs.existsSync(COMPLETED_DIR)) {
    const taskFiles = fs.readdirSync(COMPLETED_DIR).filter(f => f.endsWith('.md'));
    for (const file of taskFiles) {
      const content = fs.readFileSync(path.join(COMPLETED_DIR, file), "utf8");
      completedTasks.push({
        filename: file.replace('.md', ''),
        content: content.trim()
      });
    }
  }

  return (
    <div className="min-h-screen p-8 text-white relative flex flex-col space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">GetProfile AI Core</h1>
        <p className="text-gray-400">Live feed of your autonomous virtual workforce.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Total Active Agents</h3>
            <p className="text-4xl font-black text-[#5E5CE6]">{Object.keys(agents).length}</p>
         </div>
         <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Tasks Completed</h3>
            <p className="text-4xl font-black text-[#34C759]">{completedTasks.length}</p>
         </div>
         <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col justify-center">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#34C759]"></span>
              </span>
              <span className="text-lg font-bold">Orchestrator Online</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Org Chart */}
        <div className="xl:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
             👥 Organization Chart
          </h2>
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.values(agents).map((agent: any) => (
              <div key={agent.id} className="p-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5E5CE6] to-[#0A84FF] flex items-center justify-center font-bold text-lg shadow-lg">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{agent.name}</h4>
                  <p className="text-xs text-gray-400">{agent.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live Inbox */}
        <div className="xl:col-span-2 space-y-6">
           <h2 className="text-2xl font-bold flex items-center gap-2">
             📥 Completed Tasks Feed
           </h2>
           {completedTasks.length === 0 ? (
             <div className="p-12 border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center text-gray-500">
                <div className="text-4xl mb-4">💤</div>
                <h3 className="text-lg font-bold mb-1">Inbox Zero</h3>
                <p>The AI agents are currently deploying and processing tasks. Refresh soon.</p>
             </div>
           ) : (
             <div className="space-y-6">
                {completedTasks.map((task) => (
                  <div key={task.filename} className="bg-[#121212] overflow-hidden border border-white/10 rounded-3xl shadow-xl flex flex-col">
                    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                       <h3 className="font-bold text-lg tracking-tight">Task ID: <span className="text-[#0A84FF]">{task.filename}</span></h3>
                       <span className="px-3 py-1 bg-[#34C759]/20 text-[#34C759] text-xs font-bold rounded-full uppercase tracking-wider">
                         Delivered
                       </span>
                    </div>
                    <div className="p-6 bg-[#000000]/50 overflow-x-auto">
                       <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                         {task.content}
                       </pre>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

      </div>

    </div>
  );
}
