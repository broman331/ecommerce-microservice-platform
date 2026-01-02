#!/bin/bash
# Generate a token (using node)
# Ensure we are in a dir with jsonwebtoken or use global? 
# customer-service has jsonwebtoken.
cd ../services/customer || exit

TOKEN=$(node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({ userId: 'user123', email: 'test@test.com', role: 'customer' }, 'secret'));")
echo "Token: $TOKEN"

# 1. Add item
echo "--- Adding item prod1 ---"
curl -s -X POST http://localhost:3005/customers/me/wishlist \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "prod1"}'
echo ""

# 2. Get My Wishlist
echo "--- Getting My Wishlist ---"
curl -s -X GET http://localhost:3005/customers/me/wishlist \
  -H "Authorization: Bearer $TOKEN"
echo ""

# 3. Get Customer Details (Admin)
# This requires User Service to return user123 details, which might fail if user123 doesn't exist in User Service DB/Mock.
# However, CustomerService's getCustomerDetails calls User Service FIRST.
# I'll try to just check the wishlist via admin route if possible, but the route logic is:
# getUser -> getOrders -> getWishlist.
# If getUser fails (404), the whole thing fails.
# So I should check if user123 exists. If not, I'll skip this or mock it? 
# I'll rely on the /me/wishlist mainly.
echo "--- (Skip Admin View for random user user123) ---"

# 4. Remove item
echo "--- Removing item prod1 ---"
curl -s -X DELETE http://localhost:3005/customers/me/wishlist/prod1 \
  -H "Authorization: Bearer $TOKEN"
echo ""

# 5. Get My Wishlist again
echo "--- Getting My Wishlist again (should be empty/removed) ---"
curl -s -X GET http://localhost:3005/customers/me/wishlist \
  -H "Authorization: Bearer $TOKEN"
echo ""
