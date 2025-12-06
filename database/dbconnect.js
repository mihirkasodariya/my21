import { connect } from 'mongoose';

const dbConnect = async () => {
    try {
        const conn = await connect(process.env.MONGOURL, {});
        console.debug(`MongoDB Database: ${conn.connection.name} Connected Successfully`);
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    };
};

export default dbConnect;


// npm install mysql2
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();

// // ===============================
// // CREATE CONNECTION POOL (Best Practice)
// // ===============================
// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST || "localhost",
//   user: process.env.MYSQL_USER || "root",
//   password: process.env.MYSQL_PASSWORD || "",
//   database: process.env.MYSQL_DATABASE || "testdb",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // ===============================
// // TEST CONNECTION
// // ===============================
// export const connectMySQL = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("✔ MySQL Connected Successfully");
//     connection.release();
//   } catch (err) {
//     console.error("❌ MySQL Connection Failed:", err.message);
//   }
// };

// export default pool;

