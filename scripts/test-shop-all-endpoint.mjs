import fetch from 'node-fetch';
import MY_IP_ADDRESS from '../../client/environment_variables.mjs';
import { users_db } from "../db/conn.mjs";

async function testShopAllEndpoint() {
  try {
    console.log("Testing /vendor/shop/all endpoint...");
    
    // First check the database directly
    const userDB = users_db.collection('customer_info');
    const dbVendors = await userDB.find({ 
      user_roles: 2,
      shop_info: { $exists: true } 
    }).toArray();
    
    console.log(`Database query found ${dbVendors.length} vendors with user_roles = 2 and shop_info`);
    
    if (dbVendors.length > 0) {
      console.log("First vendor from DB:", JSON.stringify(dbVendors[0], null, 2));
    }
    
    // Now test the API endpoint
    console.log("\nTesting API endpoint...");
    const response = await fetch(`http://${MY_IP_ADDRESS}:5050/vendor/shop/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));
    
    if (data.vendors && data.vendors.length > 0) {
      console.log(`Found ${data.vendors.length} vendors from API`);
      console.log("First vendor from API:", JSON.stringify(data.vendors[0], null, 2));
    } else {
      console.log("No vendors found from API");
    }
    
  } catch (error) {
    console.error("Error testing endpoint:", error);
  }
}

testShopAllEndpoint();
