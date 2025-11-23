#!/usr/bin/env bash
set -euo pipefail

# Quick sanity check for the Advanced Commerce backend.
# Usage: ./scripts/commerce_health.sh [slug] [base_url]
# - slug: mini-app slug to use for the purchase test (default: tripspark)
# - base_url: override STUDIOB_COMMERCE_BACKEND_URL (default: https://studiob-nine.vercel.app)

SLUG="${1:-tripspark}"
BASE_URL="${2:-${STUDIOB_COMMERCE_BACKEND_URL:-https://studiob-nine.vercel.app}}"

echo "🔍 Hitting ${BASE_URL}"

echo "-> /healthz"
curl -sf "${BASE_URL}/healthz" || (echo "healthz failed" && exit 1)
echo

echo "-> /api/commerce/subscriptions"
curl -sf "${BASE_URL}/api/commerce/subscriptions" || (echo "subscriptions failed" && exit 1)
echo

echo "-> /api/commerce/purchase (slug=${SLUG})"
curl -sf -X POST "${BASE_URL}/api/commerce/purchase" \
  -H "Content-Type: application/json" \
  -d "{\"slug\":\"${SLUG}\"}" || (echo "purchase failed" && exit 1)
echo

echo "✅ Commerce backend reachable"
