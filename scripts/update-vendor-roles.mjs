import { users_db } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

async function updateVendorRoles() {
  try {
    console.log("Updating vendor roles...");
    
    // Get the vendor with shop_info
    const userDB = users_db.collection('customer_info');
    const vendorWithShopInfo = await userDB.findOne({ 
      shop_info: { $exists: true } 
    });
    
    if (!vendorWithShopInfo) {
      console.log("No vendor with shop_info found");
      return;
    }
    
    console.log(`Found vendor with shop_info: ${vendorWithShopInfo.first_name} ${vendorWithShopInfo.last_name} (${vendorWithShopInfo._id})`);
    console.log(`Current user_roles: ${vendorWithShopInfo.user_roles}`);
    
    // Update the user_roles to 2 (vendor)
    const result = await userDB.updateOne(
      { _id: vendorWithShopInfo._id },
      { $set: { user_roles: 2 } }
    );
    
    console.log(`Update result: ${JSON.stringify(result)}`);
    
    // Verify the update
    const updatedVendor = await userDB.findOne({ _id: vendorWithShopInfo._id });
    console.log(`Updated user_roles: ${updatedVendor.user_roles}`);
    
    // Check if the vendor appears in the query used by the /shop/all endpoint
    const vendors = await userDB.find({ 
      user_roles: 2,
      shop_info: { $exists: true } 
    }).toArray();
    
    console.log(`Found ${vendors.length} vendors with user_roles = 2 and shop_info`);
    
    if (vendors.length > 0) {
      console.log("Vendors that should appear in /shop/all:");
      vendors.forEach(vendor => {
        console.log(`- ${vendor.first_name} ${vendor.last_name} (${vendor._id})`);
        console.log(`  user_roles: ${vendor.user_roles}`);
        console.log(`  Has shop_info: ${vendor.shop_info ? 'Yes' : 'No'}`);
      });
    }
    
  } catch (error) {
    console.error("Error updating vendor roles:", error);
  } finally {
    process.exit(0);
  }
}

updateVendorRoles();
