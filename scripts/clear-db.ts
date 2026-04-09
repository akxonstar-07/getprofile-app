import { prisma } from '../src/lib/prisma';

async function clearDB() {
  console.log('Clearing all testing users from the database...');
  
  // Due to foreign key constraints, Prisma usually cascades or we can just delete from User 
  // if cascading is set up. Let's delete users and clean up.
  await prisma.user.deleteMany({});
  
  console.log('✅ Successfully removed all user accounts. Database is clean for fresh signup testing.');
}

clearDB()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
