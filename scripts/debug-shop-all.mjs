import { users_db } from "../db/conn.mjs";

async function debugShopAll() {
  try {
    console.log("Debugging /shop/all endpoint...");
    
    const userDB = users_db.collection('customer_info');
    
    // Check for users with user_roles = 2 and shop_info
    const vendors = await userDB.find({ 
      user_roles: 2,
      shop_info: { $exists: true } 
    }).toArray();
    
    console.log(`Found ${vendors.length} users with user_roles = 2 and shop_info`);
    
    if (vendors.length > 0) {
      console.log("Vendors with shop_info:");
      vendors.forEach(vendor => {
        console.log(`- ${vendor.first_name} ${vendor.last_name} (${vendor._id})`);
        console.log(`  shop_info: ${JSON.stringify(vendor.shop_info)}`);
      });
    }
    
    // Check for users with user_roles = 2
    const allVendors = await userDB.find({ 
      user_roles: 2
    }).toArray();
    
    console.log(`\nFound ${allVendors.length} users with user_roles = 2`);
    
    if (allVendors.length > 0) {
      console.log("All vendors:");
      allVendors.forEach(vendor => {
        console.log(`- ${vendor.first_name} ${vendor.last_name} (${vendor._id})`);
        console.log(`  Has shop_info: ${vendor.shop_info ? 'Yes' : 'No'}`);
        if (vendor.shop_info) {
          console.log(`  shop_info: ${JSON.stringify(vendor.shop_info)}`);
        }
      });
    }
    
    // Check for users with shop_info
    const usersWithShopInfo = await userDB.find({ 
      shop_info: { $exists: true } 
    }).toArray();
    
    console.log(`\nFound ${usersWithShopInfo.length} users with shop_info`);
    
    if (usersWithShopInfo.length > 0) {
      console.log("Users with shop_info:");
      usersWithShopInfo.forEach(user => {
        console.log(`- ${user.first_name} ${user.last_name} (${user._id})`);
        console.log(`  user_roles: ${user.user_roles}`);
        console.log(`  shop_info: ${JSON.stringify(user.shop_info)}`);
      });
    }
    
  } catch (error) {
    console.error("Error debugging shop all:", error);
  } finally {
    process.exit(0);
  }
}

debugShopAll();
