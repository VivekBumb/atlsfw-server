import { users_db } from "../db/conn.mjs";

async function checkShopInfo() {
  try {
    console.log("Checking shop_info in the database...");
    
    // Check for users with shop_info
    const userDB = users_db.collection('customer_info');
    const usersWithShopInfo = await userDB.find({ 
      shop_info: { $exists: true } 
    }).toArray();
    
    console.log(`Found ${usersWithShopInfo.length} users with shop_info`);
    
    if (usersWithShopInfo.length > 0) {
      console.log("Sample user with shop_info:");
      console.log(JSON.stringify(usersWithShopInfo[0], null, 2));
    }
    
    // Check for users with discovery_info
    const usersWithDiscoveryInfo = await userDB.find({ 
      discovery_info: { $exists: true } 
    }).toArray();
    
    console.log(`Found ${usersWithDiscoveryInfo.length} users with discovery_info`);
    
    if (usersWithDiscoveryInfo.length > 0) {
      console.log("Sample user with discovery_info:");
      console.log(JSON.stringify(usersWithDiscoveryInfo[0], null, 2));
    }
    
    // Check vendor_info collection
    const vendorDB = users_db.collection('vendor_info');
    const vendorInfo = await vendorDB.find({}).toArray();
    
    console.log(`Found ${vendorInfo.length} entries in vendor_info collection`);
    
    if (vendorInfo.length > 0) {
      console.log("Sample vendor_info:");
      console.log(JSON.stringify(vendorInfo[0], null, 2));
    }
    
  } catch (error) {
    console.error("Error checking shop info:", error);
  } finally {
    process.exit(0);
  }
}

checkShopInfo();
