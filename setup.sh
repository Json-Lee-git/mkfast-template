#!/usr/bin/env bash
# Quick customization script for new sites cloned from template
# Usage: bash setup.sh "My Site Name" "my-site"
# This replaces the AI Search Readiness branding with your site's identity.

set -e

SITE_NAME="${1:?Usage: bash setup.sh \"Site Name\" \"site-slug\"}"
SITE_SLUG="${2:?Usage: bash setup.sh \"Site Name\" \"site-slug\"}"

echo "Customizing site: $SITE_NAME ($SITE_SLUG)"

# Config files
sed -i "s/AI Search Readiness Tools/$SITE_NAME/g" src/config/website.ts
sed -i "s/ai-search-readiness/$SITE_SLUG/g" .cta.json

# AGENTS.md / CLAUDE.md
sed -i "s/AI Search Readiness Tools/$SITE_NAME/g" AGENTS.md CLAUDE.md

# README
sed -i "s/AI Search Readiness Tools/$SITE_NAME/g" README.md
sed -i "s/ai-search-readiness/$SITE_SLUG/g" README.md

echo "Done! Next steps:"
echo "1. Update src/config/website.ts with your domain and social links"
echo "2. Replace content/blog/ with your articles"
echo "3. Replace content/glossary/ with your glossary terms"
echo "4. Update .env with your Cloudflare credentials"
echo "5. pnpm build && pnpm deploy"
