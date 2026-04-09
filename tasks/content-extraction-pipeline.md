---
title: "Architect Content Extraction Pipeline"
agent: "lead-engineer"
status: "pending"
priority: "high"
dependencies: []
---

# Objective
Design and implement the "Content Extraction" architecture for our onboarding flow. When a user provides an Instagram or TikTok URL, the system MUST autonomously scrape and extract their bio, profile picture, and latest media links.

# Requirements
1. The script must accept a standard social URL.
2. The script must use `cheerio` or `puppeteer-core` to parse the `og:image` and `og:description` meta tags to gather the bio and avatar.
3. Once extracted, the data should automatically format into a Prisma `User` structure and update the database natively.
4. Provide the exact Node.js implementation script.
