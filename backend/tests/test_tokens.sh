#!/bin/bash

# Variables
BASE_URL="http://localhost:8000"
EMAIL="admin@pretalouer.fr"
PASSWORD="root"
USER_ID=""
ACCESS_TOKEN=""
REFRESH_TOKEN=""

# Endpoints
CREATE_USER_ENDPOINT="$BASE_URL/api/create_user/"
LOGIN_ENDPOINT="$BASE_URL/api/login"
REFRESH_TOKEN_ENDPOINT="$BASE_URL/api/refresh_token"
DELETE_USER_ENDPOINT="$BASE_URL/api/delete_user/"
GET_USER_ENDPOINT="$BASE_URL/api/get_user/"

# JSON Data for user creation
USER_JSON=$(cat <<EOF
{
  "name": "admin",
  "first_name": "admin",
  "age": 22,
  "email": "$EMAIL",
  "main_activity": "Ingénieur DevOps",
  "status": "Etudiant",
  "phone_number": "0612345678",
  "password": "$PASSWORD",
  "city": "Toulouse",
  "reservations": []
}
EOF
)

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Step 1: Create user
echo "Creating user..."
create_response=$(curl -s -X POST "$CREATE_USER_ENDPOINT" -H "Content-Type: application/json" -d "$USER_JSON") || handle_error "Failed to create user."
echo "Create Response: $create_response"

# Step 2: Get user ID from database
echo "Getting user ID..."
USER_ID=$(curl -s -X GET "$GET_USER_ENDPOINT?email=$EMAIL" | jq -r '._id') || handle_error "Failed to get user ID."
echo "User ID: $USER_ID"

# Step 3: Login to get tokens
echo "Logging in..."
login_response=$(curl -s -X POST "$LOGIN_ENDPOINT" -H "Content-Type: application/json" -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}") || handle_error "Failed to login."
echo "Login Response: $login_response"

# Extract access and refresh tokens
ACCESS_TOKEN=$(echo $login_response | jq -r '.access_token') || handle_error "Failed to extract access token."
REFRESH_TOKEN=$(echo $login_response | jq -r '.refresh_token') || handle_error "Failed to extract refresh token."

# Step 4: Use refresh token to get a new access token
echo "Refreshing token..."
refresh_response=$(curl -s -X POST "$REFRESH_TOKEN_ENDPOINT?refresh_token=$REFRESH_TOKEN" -H "Content-Type: application/json") || handle_error "Failed to refresh token."
echo "Refresh Response: $refresh_response"

# Extract new access token
NEW_ACCESS_TOKEN=$(echo $refresh_response | jq -r '.access_token') || handle_error "Failed to extract new access token."

# Step 5: Delete user
echo "Deleting user..."
if [ -z "$USER_ID" ]; then
    handle_error "User ID is empty or not found."
fi

# Output user ID to delete
echo "User ID to delete: $USER_ID"

# Output delete user URL
DELETE_USER_URL="$DELETE_USER_ENDPOINT$USER_ID"
echo "Delete User URL: $DELETE_USER_URL"

# Make the call to delete the user
delete_response=$(curl -s -X DELETE "$DELETE_USER_URL" -H "Authorization: Bearer $NEW_ACCESS_TOKEN") || handle_error "Failed to delete user."
echo "Delete Response: $delete_response"
