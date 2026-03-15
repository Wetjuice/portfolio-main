# Job Discovery System

Automated job curation and verification system for Mr. Berman.

## Features

- **Curated Discovery**: 10 new verified jobs delivered 1-2x daily
- **Active Verification**: Each posting checked for:
  - Post date (reject if >30 days old)
  - Company validation
  - URL liveness
  - Duplicate detection
- **Simple Workflow**: Interested / Not Interested → auto-archive rejections
- **Target**: $200K+ roles across gaming, tech, and transferable skill industries

## Industries Covered

- Gaming (Sony, Epic, Riot, Roblox, Netflix Games)
- Tech/Social (Discord, Meta, Stripe)
- EdTech (Duolingo)
- FinTech (Stripe)
- Healthcare Tech (Oscar Health)
- Entertainment/Streaming (Spotify, Netflix)

## Data Storage

All decisions stored in browser localStorage:
- Jobs data
- User decisions (interested/archived)
- Persistent across sessions

## Deployment

Live at: https://wetjuice.github.io/mberman-portfolio/job-discovery/

Updated via GitHub Pages (auto-deploy on push to main).

## Future Enhancements

- Daily cron job for automated job collection
- Multi-source aggregation (LinkedIn, Indeed, Greenhouse, Lever)
- Transferable skills mapping
- Telegram notifications (topic 760)
