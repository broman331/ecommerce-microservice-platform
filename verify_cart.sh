#!/bin/bash

BASE_URL="http://localhost:3007"
CUSTOMER_ID="101"
PRODUCT_ID="1" 

echo "--- Verifying Cart Service ---"

# 1. Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/"
echo -e "\n"

# 2. Add Item to Cart
echo "2. Adding Item to Cart (Product ID: $PRODUCT_ID, Qty: 1)..."
# Note: This assumes Product 1 exists in Product/Inventory services.
# If fresh DB, might need to populate first. Assuming standard mock data exists.
RESPONSE=$(curl -s -X POST "$BASE_URL/cart/$CUSTOMER_ID/items" \
  -H "Content-Type: application/json" \
  -d "{\"productId\": \"$PRODUCT_ID\", \"quantity\": 1}")
echo "$RESPONSE"
echo -e "\n"

# 3. Get Cart
echo "3. Getting Cart..."
curl -s "$BASE_URL/cart/$CUSTOMER_ID"
echo -e "\n"

# 4. Update Quantity
echo "4. Updating Quantity (Qty: 2)..."
curl -s -X PUT "$BASE_URL/cart/$CUSTOMER_ID/items/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d "{\"quantity\": 2}"
echo -e "\n"

# 5. Checkout
echo "5. Checking out..."
curl -s -X POST "$BASE_URL/cart/$CUSTOMER_ID/checkout"
echo -e "\n"

# 6. Verify Cart Empty after Checkout
echo "6. Verifying Cart Empty after Checkout..."
curl -s "$BASE_URL/cart/$CUSTOMER_ID"
echo -e "\n"

echo "--- Verification Complete ---"
