import { DatabaseConnection } from '../src/database/connection.js';
import { UserRepository } from '../src/repositories/user.repository.js';

const seedUsers = [
  {
    email: 'admin@logicore.com',
    password: 'admin123',
    first_name: 'System',
    last_name: 'Administrator',
    roles: ['admin']
  },
  {
    email: 'manager@logicore.com',
    password: 'manager123',
    first_name: 'John',
    last_name: 'Manager',
    roles: ['manager']
  },
  {
    email: 'driver@logicore.com',
    password: 'driver123',
    first_name: 'Bob',
    last_name: 'Driver',
    roles: ['driver']
  },
  {
    email: 'dispatcher@logicore.com',
    password: 'dispatcher123',
    first_name: 'Alice',
    last_name: 'Dispatcher',
    roles: ['dispatcher']
  },
  {
    email: 'customer@logicore.com',
    password: 'customer123',
    first_name: 'Jane',
    last_name: 'Customer',
    roles: ['customer']
  },
  {
    email: 'demo@example.com',
    password: 'demo123',
    first_name: 'Demo',
    last_name: 'User',
    roles: ['user', 'driver']
  }
];

async function seedDatabase() {
  const db = new DatabaseConnection();
  const userRepository = new UserRepository(db);
  
  try {
    console.log('Seeding database with initial users...');
    
    let created = 0;
    let skipped = 0;
    
    for (const userData of seedUsers) {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        console.log(`⏭️  Skipping existing user: ${userData.email}`);
        skipped++;
        continue;
      }
      
      // Create new user
      const user = await userRepository.createUser(userData);
      console.log(`✅ Created user: ${user.email} (${user.roles.join(', ')})`);
      created++;
    }
    
    console.log(`\n🎉 Database seeding completed!`);
    console.log(`   Created: ${created} users`);
    console.log(`   Skipped: ${skipped} users`);
    
    // Display login credentials
    console.log('\n🔐 Test Login Credentials:');
    seedUsers.forEach(user => {
      console.log(`   ${user.email} / ${user.password} (${user.roles.join(', ')})`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}