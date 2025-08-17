#! /bin/zsh

response_1=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/key_logger/connect \
-H "Content-Type: application/json" \
-d '{"id": "1", "mac": "02:4e:8f:d4:3f:22"}'`

echo "Test 1: Invalid User ID format"
echo $response_1

echo "\n---------------------------------------------\n"

response_2=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/key_logger/connect \
-H "Content-Type: application/json" \
-d '{"id": "68a122d28f0b03ddddc0e8f8", "mac": "02:4e:8f:d4:3f:22"}'`

echo "Test 2: Invalid User ID"
echo $response_2

echo "\n---------------------------------------------\n"

response_3=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/key_logger/connect \
-H "Content-Type: application/json" \
-d '{"id": "68a122d28f0b03ddddc0e8f9", "mac": "02:4e:8f:d4:3f:22"}'`

echo "Test 3: Correct connection"
echo $response_3

echo "\n---------------------------------------------\n"