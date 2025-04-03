#!/bin/bash

# Get public IP address using icanhazip service (you can use other services as needed)
IP_ADDRESS=$(ifconfig en0 | grep "inet " | awk '{print $2}')

# Port number
PORT=5050

# URL
URL="http://${IP_ADDRESS}:${PORT}" # Replace '/endpoint' with the correct endpoint path if needed

# Send POST request
# curl -X POST \
#      -H "Content-Type: application/json" \
#      -d '{ "hashed_email": "testCat8", "hashed_password": "tested", "encrypted_email": "catTest", "first_name": "cat", "last_name": "x", "account_type": 3, "username": "catUser", "birthday": "aha", "gender": "who knows", "subscribed_to_news": false }' \
#      $URL/signup


# curl -X POST \
#      -H "Content-Type: application/json" \
#      -d '{ "hashed_email": "30499c65794929be3df9f4647a2c4ed874f98312e81193a98102d73125077be3" }' \
#      $URL/vendor

# curl -X POST \
#      -H "Content-Type: application/json" \
#      -d '{ "hashed_email": "testCat6", "hashed_password": "tested" }' \
#      $URL

curl -X POST \
     -H "Content-Type: application/json" \
     -d '{ "brand_name": "Aysegul", "shop_now_link": "https://ayseguliknadesigns.com/", "title": "Designer/Owner", "intro": "Aysegul is a designer from Istanbul, Turkey.  She studed at Savannah College of Art & Design (SCAD) in Atlanta, GA  and focuses on garment construction using sustainable textiles, using recycled deadstock fabrics." }' \
     $URL/discover/create/655b7f350ca73bc904150388

curl $URL/discover/655b7f350ca73bc904150388

# Send GET request
# curl -X POST \
#      -H "Content-Type: application/json" \
#      -d '{"article_title":"Vogue’s ultimate guide to sustainable fashion","article_preview_image":"https://assets.vogue.in/photos/60741d6e0b2bcf72ead1c129/2:3/w_2240,c_limit/Vogue-Sustainability-Guide-credit-Justin-Polkey.jpg","article_link":"https://www.vogue.in/fashion/content/vogues-ultimate-guide-to-sustainable-fashion","author_id": 20,"author_name":"Emily Chan","author_pfp_link":"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?fit=crop&w=700&q=60","tags":["innovation","environment"]}' \
#      "$URL/posts/create"