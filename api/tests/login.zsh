#! /bin/zsh

response_1=`curl -s -X POST http://127.0.0.1:8000/v1/login \
-H "Content-Type: application/json" \
-d '{"email": "barbo@barbo.com", "password": "barbo", "password_confirmation": "barbo1"}'`

echo "Test 1: User does not exist"
echo $response_1