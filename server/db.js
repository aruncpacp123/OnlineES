const sql = require('mssql');

const dbConfig = {
    server: 'ARUN-CP\\SQLSERVER2019',       // Your server and instance name
    database: 'AdvancedOnlineExam',         // Your database name
    options: {
      encrypt: false,                       // No encryption for local dev
      trustServerCertificate: true,
      connectTimeout: 30000          // Trust self-signed certs for local dev
    },
    authentication: {
      type: 'ntlm',                        // Windows Authentication
      options: {
        userName: 'aruncp',                // Username portion
        domain: 'NALASHAA'                 // Domain portion
      }
    },
    trustedConnection: true                // Enable Windows Authentication
  };
async function connectToDatabase() {
  try {
    console.log("Attempting to connect...");
    const pool = await sql.connect(dbConfig);
    console.log('Connected to MSSQL');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

// Test the connection
connectToDatabase().then(() => console.log('Connection successful')).catch(err => console.error('Failed:', err));

module.exports = { connectToDatabase, sql };