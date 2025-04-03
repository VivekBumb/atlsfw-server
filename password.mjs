// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Use environment variables or fallback to hardcoded values
const USERNAME = "atlsfw_app_user";
const PASSWORD = process.env.MONGO_PASSWORD || "georgiatech";

export default function getMongoPasscode() {
    return USERNAME + ":" + PASSWORD;
}
