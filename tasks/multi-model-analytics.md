---
title: "Multi-Model Analytics Learning Pipeline"
agent: "data-scientist"
status: "pending"
priority: "high"
dependencies: []
---

# Objective
Design the architecture for our local Llama3 instance to securely analyze the PostgreSQL database (`Analytics` and `LinkClick` tables) to provide personalized, localized growth advice to creators.

# Requirements
1. The script must query Prisma for the last 7 days of link clicks for a specific user.
2. The AI must aggregate this raw numerical data into a natural language prompt (e.g. "YouTube had 15 clicks, Instagram had 3.").
3. Pass the prompt to the local Ollama instance running `llama3` on port `11434`.
4. Parse the AI's natural language response and securely inject it as a message into the creator's `Message` table so they receive it in their Dashboard Inbox.
5. Provide the exact Cron job or Node script to manage this pipeline.
