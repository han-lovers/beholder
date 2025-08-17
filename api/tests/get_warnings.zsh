#! /bin/zsh

response_1=`curl -s https://api-257470668223.us-central1.run.app/v1/key_logger/warning/68a1b876d73af603c80e7f58`

echo "Test 1: Invalid user ID"
echo $response_1

echo "\n---------------------------------------------\n"

response_2=`curl -s https://api-257470668223.us-central1.run.app/v1/key_logger/warning/68a1b876d73af60380e7f58`

echo "Test 2: Valid user ID"
echo $response_2

echo "\n---------------------------------------------\n"