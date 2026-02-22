const sql = require('mssql');
require('dotenv').config();

const config = {
  server:   'BETÜŞ',
  database: process.env.DB_NAME,
  options: {
    trustedConnection:      true,
    trustServerCertificate: true,
    enableArithAbort:       true,
    instanceName:           'SQLEXPRESS',
  },
  pool: {
    max:               10,
    min:               0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('✅ MSSQL bağlantısı kuruldu:', process.env.DB_NAME);
  }
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('🔌 MSSQL bağlantısı kapatıldı.');
  }
}

module.exports = { sql, getPool, closePool };
