import { users_db } from "../db/conn.mjs";

async function checkVendorUsers() {
  try {
    console.log("Checking vendor users in the database...");
    
    // Check customer_info collection for vendors
    const userDB = users_db.collection('customer_info');
    const vendorUsers = await userDB.find({ user_roles: 2 }).toArray();
    
    console.log(`Found ${vendorUsers.length} users with user_roles = 2 (vendors)`);
    
    if (vendorUsers.length > 0) {
      console.log("Vendor users:");
      vendorUsers.forEach(user => {
        console.log(`- ${user.first_name} ${user.last_name} (${user._id})`);
        console.log(`  Has shop_info: ${user.shop_info ? 'Yes' : 'No'}`);
        console.log(`  Has discovery_info: ${user.discovery_info ? 'Yes' : 'No'}`);
      });
    }
    
    // Check for users with shop_info regardless of user_roles
    const usersWithShopInfo = await userDB.find({ 
      shop_info: { $exists: true } 
    }).toArray();
    
    console.log(`\nFound ${usersWithShopInfo.length} users with shop_info (regardless of user_roles)`);
    
    if (usersWithShopInfo.length > 0) {
      console.log("Users with shop_info:");
      for (const user of usersWithShopInfo) {
        console.log(`- ${user.first_name} ${user.last_name} (${user._id})`);
        console.log(`  User roles: ${user.user_roles}`);
        console.log(`  Is vendor (user_roles = 2): ${user.user_roles === 2 ? 'Yes' : 'No'}`);
      }
    }
    
  } catch (error) {
    console.error("Error checking vendor users:", error);
  } finally {
    process.exit(0);
  }
}

checkVendorUsers();
