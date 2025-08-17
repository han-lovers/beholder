#! /bin/zsh

response_1=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/web/login \
-H "Content-Type: application/json" \
-d '{"email": "barbosa@barbo.com", "password": "barbo"}'`

echo "Test 1: User does not exist"
echo $response_1

echo "\n---------------------------------------------\n"

response_2=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/web/login \
-H "Content-Type: application/json" \
-d '{"email": "barbo@barbo.com", "password": "barboo"}'`

echo "Test 2: Incorrect password"
echo $response_2

echo "\n---------------------------------------------\n"

response_3=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/web/login \
-H "Content-Type: application/json" \
-d '{"email": "barbo@barbo.com", "password": "barboo"}'`

echo "Test 3: Correct login"
echo $response_3