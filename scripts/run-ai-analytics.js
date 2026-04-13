/**
 * run-ai-analytics.js
 * 
 * This is a manual trigger mechanism for the Multi-Model Data Analytics Cron Route.
 * Run this via: `node scripts/run-ai-analytics.js`
 * 
 * Ensure your Next.js server is running and local Ollama is active on port 11434 before execution!
 */

const fetch = require('node-fetch');

// If you change your local dev port or host this online, change this URL.
const API_URL = "http://localhost:3000/api/cron/analytics-ai";
const CRON_SECRET = process.env.CRON_SECRET || "";

async function triggerCron() {
  console.log("🚀 Initializing Multi-Model Analytics Pipeline...");
  console.log(`📡 Target endpoint: ${API_URL}`);

  try {
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CRON_SECRET}` 
      }
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.error("❌ Pipeline execution failed with status:", response.status);
      console.error("Details:", data);
      process.exit(1);
    }

    console.log(`\n✅ Pipeline Completed Sequence in ${duration}ms.\n`);
    console.log(`🧠 Processed Users: ${data.processedUsers || 0}`);
    
    if (data.reports && data.reports.length > 0) {
       console.log("\n📊 Execution Reports:");
       data.reports.forEach((report, index) => {
          if (report.status === "success") {
             console.log(`   [User: ${report.userId}] -> Insight Generated: "${report.generatedAdvice}"`);
          } else {
             console.log(`   [User: ${report.userId}] -> FAILED: ${report.reason}`);
          }
       });
    } else {
       console.log("   (No data was processed. Either DB is empty or users haven't generated events in the last 7 days.)");
    }

  } catch (error) {
    console.error("\n❌ CRITICAL PIPELINE ERROR:");
    console.error("Could not reach the server endpoint. Is the Next.js server running on port 3000?");
    console.error(error.message);
    process.exit(1);
  }
}

triggerCron();
