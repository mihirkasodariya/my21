import {
    userValidation,
    userModel,
    userListQueryValidation,
    updateUserValidation,
    idValidation
} from "../models/userModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { generateJWToken } from "../middleware/auth.js";
import asyncHandler from "../middleware/asyncHandler.js";
import bcrypt from "bcrypt";

export const signUp = asyncHandler(async (req, res) => {
    // console.log(req.file.filename)
    const { email, password } = req.body;
    const { error } = userValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    console.log(req.body)
    const existingUser = await userModel.findOne({ email, isActive: true })
    if (existingUser) {
        return response.error(res, resStatusCode.CONFLICT, resMessage.USER_ALREADY_EXISTS, {});
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ email, password: hashedPassword });
    const resData = {
        _id: newUser._id,
        email: newUser.email,
    };
    return response.success(res, resStatusCode.CREATED, resMessage.USER_REGISTER, resData);
});

export const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { error } = userValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };

    const user = await userModel.findOne({ email, isActive: true })
    if (!user) {
        return response.error(res, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return response.error(res, resStatusCode.UNAUTHORISED, resMessage.INCORRECT_PASSWORD, {});
    };

    const tokenPayload = {
        _id: user._id,
        email: user.email,
    };
    const accessToken = await generateJWToken(tokenPayload);
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.LOGIN_SUCCESS, {
        _id: user._id,
        token: accessToken,
    });
});

export const getUsersList = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { error } = userListQueryValidation.validate(req.query);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };

    const totalUsers = await userModel.countDocuments({ isActive: true });

    const users = await userModel.find({ isActive: true }).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 });
    const resData = {
        records: users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
    };
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.LIST_FETCHED_SUCCESSFULLY, resData);
});

export const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    const user = await userModel.findById({ _id: userId }).select("-password");
    if (!user) {
        return response.error(res, resStatusCode.FORBIDDEN, resMessage.NO_DATA_FOUND);
    };
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.FETCHED_SUCCESSFULLY, user);
});

export const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    // const userId = req.user._id; // token user
    const { error } = updateUserValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    const { name, email, isActive } = req.body;

    const updateData = {};
    if (email) updateData.email = email;
    if (typeof isActive === "boolean") {
        updateData.isActive = isActive;
    };
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.UPDATED_SUCCESSFULLY, updatedUser);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { error } = idValidation.validate(id);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    const user = await userModel.findById({ _id: id });

    user.isActive = false;
    await user.save();
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.DELETED_SUCCESSFULLY, { _id: userId });
});



// exports.searchVehicle = async (req, res) => {
//   try {
//     const { ownerName } = req.query;

//     const vehicles = await Vehicle.find({
//       ownerName: { $regex: ownerName, $options: "i" }
//     });

//     res.json(vehicles);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getExpiredRC = async (req, res) => {
//   try {
//     const today = new Date();
//     const vehicles = await Vehicle.find({
//       rcExpiry: { $lt: today }
//     });

//     res.json({ expiredCount: vehicles.length, vehicles });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// *
// **
// ***
// ****
// for (let i = 1; i <= 4; i++) {
//   console.log("*".repeat(i));
// }


// ****
// ***
// **
// *
// for (let i = 4; i >= 1; i--) {
//   console.log("*".repeat(i));
// }


//    *
//   ***
//  *****
// let n = 3;
// for (let i = 1; i <= n; i++) {
//   console.log(" ".repeat(n - i) + "*".repeat(2 * i - 1));
// }

// const page = Number(req.query.page) || 1;
// const limit = 10;
// const skip = (page - 1) * limit;

// Model.find().skip(skip).limit(limit);


// const data = await User.aggregate([
//   // 1️⃣ Match (filter users)
//   {
//     $match: { isActive: true }
//   },

//   // 2️⃣ Lookup 1 — Join orders
//   {
//     $lookup: {
//       from: "orders",
//       localField: "_id",
//       foreignField: "userId",
//       as: "orders"
//     }
//   },

//   // 3️⃣ Unwind orders (optional)
//   {
//     $unwind: "$orders"
//   },

//   // 4️⃣ Match orders where status = completed
//   {
//     $match: { "orders.status": "completed" }
//   },

//   // 5️⃣ Lookup 2 — Join payments
//   {
//     $lookup: {
//       from: "payments",
//       localField: "orders._id",
//       foreignField: "orderId",
//       as: "payments"
//     }
//   },

//   // 6️⃣ Unwind payments (optional)
//   {
//     $unwind: "$payments"
//   },

//   // 7️⃣ Group by user
//   {
//     $group: {
//       _id: "$_id",
//       name: { $first: "$name" },
//       email: { $first: "$email" },
//       totalOrders: { $sum: 1 },
//       totalPayment: { $sum: "$payments.amount" }
//     }
//   },

//   // 8️⃣ Project final output
//   {
//     $project: {
//       _id: 0,
//       userId: "$_id",
//       name: 1,
//       email: 1,
//       totalOrders: 1,
//       totalPayment: 1
//     }
//   },

//   // 9️⃣ Sort by highest paying users
//   {
//     $sort: { totalPayment: -1 }
//   }
// ]);


// import pool from "./db.js";

// export const getUsers = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM users");
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// const { name, email } = req.body;

// const [result] = await pool.query(
//   "INSERT INTO users (name, email) VALUES (?, ?)",
//   [name, email]
// );

// res.json({ id: result.insertId, name, email });


// await pool.query("DELETE FROM users WHERE id = ?", [id]);


// const [rows] = await pool.query(`
//   SELECT users.name, orders.amount 
//   FROM users 
//   JOIN orders ON users.id = orders.userId
// `);


// router.get("/users", asyncHandler(async (req, res) => {
//   const [rows] = await pool.query("SELECT * FROM users");
//   res.json(rows);
// }));

// // Web Scraping
// // npm i puppeteer
// const puppeteer = require('puppeteer');

// (async () => {
//     // Browser launch karein
//     const browser = await puppeteer.launch({ headless: false }); // Headless: false taaki browser dikhe
//     const page = await browser.newPage();
    
//     // Kisi dummy vehicle info site par jayein
//     await page.goto('https://example-vehicle-info-site.com');

//     // 1. Input box me gaadi number type karein
//     await page.type('#vehicleInput', 'GJ05AB1234');

//     // 2. Search button par click karein
//     await page.click('#searchBtn');

//     // 3. Result load hone ka wait karein
//     await page.waitForSelector('.owner-name');

//     // 4. Data extract karein
//     const ownerName = await page.$eval('.owner-name', el => el.innerText);
    
//     console.log("Vehicle Owner:", ownerName);

//     await browser.close();
// })();

// function isValidVehicleNumber(number) {
//     // Format: GJ05AB1234 or GJ05A1234
//     // ^[A-Z]{2} : Pehle 2 letters (State e.g., GJ)
//     // [0-9]{2}  : RTO Code (05)
//     // [A-Z]{1,2}: Series (A or AB)
//     // [0-9]{4}  : Number (1234)
//     const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    
//     return regex.test(number);
// }

// console.log(isValidVehicleNumber("GJ05AB1234")); // true
// console.log(isValidVehicleNumber("GJ5AB123"));   // false



// const axios = require('axios');

// async function getVehicleDetails(vehicleNo) {
//     try {
//         const response = await axios.get(`https://api.example.com/vehicle/${vehicleNo}`, {
//             headers: {
//                 'Authorization': 'Bearer YOUR_API_KEY' // Agar key chahiye ho
//             }
//         });
        
//         console.log("Challan Details:", response.data);
//     } catch (error) {
//         console.log("Error fetching data:", error.message);
//     }
// }

// getVehicleDetails('MH02CL5050');
