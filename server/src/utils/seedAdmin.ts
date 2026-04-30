import User from '../models/User.model';

/**
 * Automatically checks if a superadmin or admin exists in the database.
 * If not, creates a superadmin using ADMIN_EMAIL and ADMIN_PASSWORD from env.
 * This runs on every server startup.
 */
const ensureSuperAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      role: { $in: ['admin', 'superadmin'] }
    });

    if (!adminExists) {
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;

      if (!email || !password) {
        console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in env. Skipping superadmin creation.');
        return;
      }

      await User.create({
        name: 'Super Admin',
        email,
        password,
        role: 'superadmin',
      });

      console.log('✅ No admin found — Superadmin created automatically.');
      console.log(`   Email: ${email}`);
      console.log('   Password: [from ADMIN_PASSWORD env variable]');
    } else {
      console.log(`✅ Admin found (${adminExists.email}) — skipping auto-creation.`);
    }
  } catch (error) {
    console.error('❌ Error during superadmin check:', (error as Error).message);
  }
};

export default ensureSuperAdmin;
