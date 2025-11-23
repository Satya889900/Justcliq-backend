import Admin from '../models/admin.model.js';

const seedAdminData = async () => {
  try {
    const admin = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gmail.com',
      phone: '1234567890',
      password: 'password', // Will be hashed by bcrypt in Admin schema
      userType: 'Admin',
      address: '123 Admin Street, City, Country',
    };
    await Admin.create(admin);
  } catch (error) {
    console.error('Error seeding Admin:', error);
  }
};

export default seedAdminData;