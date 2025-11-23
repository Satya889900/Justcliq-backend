import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import seedAdminData from "../seeders/admin.seeder.js";
import dotenv from "dotenv";
dotenv.config();
console.log(
  "🚀 ~ connectDB ~ process.env.MONGODB_URI:",
  // process.env.MONGODB_URI
);
const connectDB = async () => {
  try {
    // console.log("------", process.env.MONGODB_URI);
    // console.log("------", process.env.DB_NAME);
    console.log("in try mongodb_uri and db_name");
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    const date=new Date();
    console.log(
      `MongoDB connected! DB Host:`
      +date.getHours()+":"+date.getMinutes()
      //  ${connectionInstance.connection.host}`
    );

    const existingAdmin = await Admin.findOne({ userType: "Admin" });
    if (!existingAdmin) {
      await seedAdminData();
      console.log("Admin seeded successfully");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
