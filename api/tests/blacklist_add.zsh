#! /bin/zsh

response_1=`curl -s -X POST https://api-257470668223.us-central1.run.app/v1/web/blacklist/add \
-H "Content-Type: application/json" \
-d '{"name_tag": "birbo", "app": "roblox", "descripcion": "se besukio a mi hijo", "image_base64": "imageaskda"}'`

echo "Test 1: Invalid User ID format"
echo $response_1

echo "\n---------------------------------------------\n"