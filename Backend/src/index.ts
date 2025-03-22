import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminrouter from "./router/admin.js";
// import router from "./router/admin.js";
import couponrouter from "./router/coupon.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;
app.set("trust proxy", true);


app.use(
  cors({
    origin: "https://round-robin-coupon-distribution-one.vercel.app", // ✅ Use frontend URL
    // origin:[ "http://localhost:3000" , "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true, // ✅ Allow cookies & auth tokens
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/coupon", couponrouter);
app.use("/api/admin", adminrouter);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// npg_PoYI4rjGVt8B