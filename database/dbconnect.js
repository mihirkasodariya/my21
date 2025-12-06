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

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "testdb",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default pool;
