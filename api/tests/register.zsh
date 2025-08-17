#! /bin/zsh

response_1=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/web/register \
-H "Content-Type: application/json" \
-d '{"email": "barbo@barbo.com", "password": "barbo", "password_confirmation": "barbo1"}'`

echo "Test 1: Not matching passwords"
echo $response_1

response_2=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/web/register \
-H "Content-Type: application/json" \
-d '{"email": "barbo@barbo.com", "password": "barbo", "password_confirmation": "barbo"}'`

echo "\n---------------------------------------------\n"

echo "Test 2: User already exists"
echo $response_2

echo "\n---------------------------------------------\n"

response_3=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/web/register \
-H "Content-Type: application/json" \
-d '{"email": "barbonia@barbo.com", "password": "barbo", "password_confirmation": "barbo"}'`

echo "Test 3: Correct User Registration"
echo $response_3