import express from "express";
import { users_db } from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { verifyToken, requireAdmin } from "../middleware/auth.mjs";

/*
enum AccountType {
  Vendor,
  Admin,
  General,
}
*/

const router = express.Router();

// Middleware to ensure only admins can access auth routes
router.use(['/authorize', '/deauthorize'], verifyToken, requireAdmin);

// Middleware to ensure only vendors can access their own routes
router.use(['/shop/create'], verifyToken, async (req, res, next) => {
    try {
        // const { vendor_id } = req.params;
        // if (req.user.id !== vendor_id) {
        //     return res.status(403).json({ success: false, message: "Access denied" });
        // }
        next();
    } catch (error) {
        console.error('Error in vendor auth middleware:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Authorize vendor
router.post("/authorize", async (req, res) => {
    try {
        // Assuming you're passing the hashed_email in the request body
        const { hashed_email } = req.body;

        if (!hashed_email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        console.log('Received vendor authorize request for hashed_email:', hashed_email);

        const collection = users_db.collection('user_login');  // replace YOUR_DB_NAME_HERE with your database name

        // Use the $set operator to update the account_type field, and upsert: false ensures we're only updating existing documents
        const result = await collection.updateOne({ hashed_email }, { $set: { account_type: 2 } });
        const customer = await users_db.collection('customer_info').findOne({ hashed_email });

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Account associated with email does not exist" });
        } else {
            const vendor_init = await users_db.collection('vendor_info').findOne({ vendor_id: customer._id });
            if (!vendor_init) {
                await users_db.collection('vendor_info').insertOne({ vendor_id: customer._id, vendor_account_initialized: false })
            }
            res.status(200).json({ success: true, message: "Vendor authorized successfully" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


// New endpoint with shop in the name
router.post("/shop/create/:vendor_id", async (req, res) => {
    try {
        // Assuming you're passing the hashed_email in the request body
        const { vendor_id } = req.params;
        const { brand_name, shop_now_link, title, intro } = req.body;

        if (!brand_name || !shop_now_link || !title || !intro) {
            return res.status(400).send("Incomplete shop page information");
        }

        const userDB = users_db.collection('customer_info');
        
        const users = await userDB.findOne({_id: new ObjectId(vendor_id)});
        const shopInfo = req.body;

        const userInfo = {...users,shop_info:{...shopInfo}};
        // Update user document
        const result = await userDB.updateOne(
            { _id: new ObjectId(vendor_id) },
            { $set: userInfo }
        );

        if(result.matchedCount){
            res.status(200).json({
                success: true,
                user: userInfo,
                message: "Shop page created successfully"
              });
        } else{
            res.status(400).send("Something went wrong");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Deauthorize vendor
router.post("/deauthorize", async (req, res) => {
    try {
        const { hashed_email } = req.body;

        if (!hashed_email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const collection = users_db.collection('user_login');
        
        // First check if user exists and is a vendor
        const user = await collection.findOne({ hashed_email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Account associated with email does not exist" });
        }
        
        if (user.account_type !== 2) { // 2 is vendor account type based on the enum comment at top
            return res.status(400).json({ success: false, message: "This user is not a Vendor. No need to deauthorize" });
        }

        const result = await collection.updateOne(
            { hashed_email }, 
            { $set: { account_type: 3 } } // Set back to general user
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Account associated with email does not exist" });
        }

        // Remove vendor info
        const customer = await users_db.collection('customer_info').findOne({ hashed_email });
        if (customer) {
            await users_db.collection('vendor_info').deleteOne({ vendor_id: customer._id });
        }

        res.status(200).json({ success: true, message: "Vendor deauthorized successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Get all vendors with shop info for the shop page (public endpoint)
router.get("/shop/all", async (req, res) => {
    try {
        console.log("GET /shop/all endpoint called");
        const userDB = users_db.collection('customer_info');
        
        // Find all users who are vendors (user_roles = 2) and have shop_info
        const query = { 
            user_roles: 2,
            shop_info: { $exists: true }  // Only include vendors who have set up their shop page
        };
        console.log("Query:", JSON.stringify(query));
        
        const vendors = await userDB.find(query).toArray();
        console.log(`Found ${vendors.length} vendors`);
        
        if (vendors.length > 0) {
            console.log("First vendor:", vendors[0]._id.toString());
        }
        
        res.status(200).json({ 
            success: true, 
            vendors: vendors 
        });
    } catch (err) {
        console.error("Error in /shop/all endpoint:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get("/shop/:vendor_id", async (req, res) => {
    try {
        const { vendor_id } = req.params;
        const collection = users_db.collection('vendor_info');
        const result = await collection.findOne({ vendor_id: new ObjectId(vendor_id) });
        if (!result) {
            res.status(400).send("Vendor does not exist");
        } else if (result.vendor_account_initialized == false) {
            return res.status(400).json({ success: false, message: "Vendor shop page uninitialized" });
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
