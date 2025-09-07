#!/bin/bash

# Test Admin Role System
echo "🧪 Testing Admin Role System..."

# Login as admin
echo "1. Logging in as admin..."
ADMIN_TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"password123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Failed to get admin token"
  exit 1
fi

echo "✅ Admin token received: ${ADMIN_TOKEN:0:20}..."

# Test admin endpoints
echo ""
echo "2. Testing admin endpoints..."

# Get all users
echo "📋 Getting all users:"
curl -s -X GET http://localhost:5001/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool

echo ""
echo "👥 Getting users by role (admin):"
curl -s -X GET "http://localhost:5001/api/admin/users/role/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool

echo ""
echo "🎯 Role system test completed!"
