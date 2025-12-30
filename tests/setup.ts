// Global test setup
process.env.BREVO_API_KEY = process.env.BREVO_API_KEY || 'test-brevo-key';
process.env.MAIL_FROM = process.env.MAIL_FROM || 'test@example.com';
process.env.MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Test Sender';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/testdb';
