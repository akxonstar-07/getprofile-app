const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

const routesToTest = [
  '/',
  '/login',
  '/signup',
  '/api/profile', // Expected 401 without auth, but should resolve
  '/api/l/fake-id', // Expected redirect or 404
];

async function runSmokeTests() {
  console.log(`🚀 Running GETPROFILE Smoke Tests on ${BASE_URL}...`);
  let passed = 0;
  let failed = 0;

  for (const route of routesToTest) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      // As long as it doesn't throw a catastrophic 500
      if (res.status >= 500) {
        console.error(`❌ ${route} - FAILED (Status: ${res.status})`);
        failed++;
      } else {
        console.log(`✅ ${route} - OK (Status: ${res.status})`);
        passed++;
      }
    } catch (error) {
      console.error(`❌ ${route} - FAILED (Network Error: ${error.message})`);
      failed++;
    }
  }

  console.log("\n--- SMOKE TEST RESULTS ---");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.error("❌ Smoke tests failed.");
    process.exit(1);
  } else {
    console.log("✅ All smoke tests passed. Ready for deployment!");
    process.exit(0);
  }
}

// Wait for server to be up
setTimeout(runSmokeTests, 2000);
