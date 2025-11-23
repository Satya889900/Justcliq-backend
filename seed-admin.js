import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import seedAdminData from './src/seeders/admin.seeder.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    await seedAdminData();
    console.log('Admin seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin(); 