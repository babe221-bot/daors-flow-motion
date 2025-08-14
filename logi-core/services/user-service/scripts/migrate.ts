import { DatabaseConnection } from '../src/database/connection.js';

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    roles TEXT[] DEFAULT ARRAY['user'],
    permissions TEXT[] DEFAULT ARRAY['read'],
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
  CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);
  CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

  -- Trigger to automatically update updated_at
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  DROP TRIGGER IF EXISTS update_users_updated_at ON users;
  CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

async function runMigration() {
  const db = new DatabaseConnection();
  
  try {
    console.log('Running database migrations...');
    
    await db.query(createUsersTable);
    
    console.log('✅ Database migrations completed successfully');
    console.log('📋 Created tables:');
    console.log('   - users');
    console.log('📊 Created indexes:');
    console.log('   - idx_users_email');
    console.log('   - idx_users_active');
    console.log('   - idx_users_roles');
    console.log('   - idx_users_created_at');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}