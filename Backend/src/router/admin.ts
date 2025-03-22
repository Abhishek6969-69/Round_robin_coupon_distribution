// Backend/src/routes/adminRouter.ts
import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import  bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { stringify } from "querystring";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use .env

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err:any, user:any) => {
    if (err) return res.sendStatus(403);
    req.user = user as { id: number; username: string }; // Define user type
    next();
  });
};

// Admin Login
router.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt:", email);
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      console.log("Admin not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      console.log("Wrong password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id, username: admin.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/coupons", authenticateToken, async (req: any, res: any) => {
   const { code, isActive } = req.body; // Fixed: Destructure directly
   console.log("Received POST request for new coupon:", { code, isActive }); // Debugging log
   try {
     if (!code || typeof isActive !== "boolean") {
       return res.status(400).json({ error: "Code and isActive are required" });
     }
     const coupon = await prisma.coupon.create({
       data: {
         code,
         isActive,
         createdAt: new Date(),
         updatedAt: new Date(),
       },
     });
     res.status(201).json(coupon);
   } catch (error) {
     console.error("Error creating coupon:", error);
     res.status(500).json({ error: "Server error" });
   }
 });
// Get All Coupons (Protected)
router.get("/coupons", authenticateToken, async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Toggle Coupon Status (Protected)
router.patch("/coupons/:id", authenticateToken, async (req: any, res: any) => {
   const { id } = req.params;
   const { code, isActive } = req.body;
   console.log("Received PATCH request for ID:", id, "with data:", { code, isActive });
 
   try {
     const coupon = await prisma.coupon.findUnique({
       where: { id },
     });
 
     if (!coupon) {
       console.log("Coupon not found:", id);
       return res.status(404).json({ error: "Coupon not found" });
     }
 
     const updatedCoupon = await prisma.coupon.update({
       where: { id },
       data: {
         code: code !== undefined ? code : coupon.code, // Only update if provided
         isActive: isActive !== undefined ? isActive : coupon.isActive, // Only update if provided
         updatedAt: new Date(),
       },
     });
     res.json(updatedCoupon);
   } catch (error) {
     console.error("Error updating coupon:", error);
     res.status(500).json({ error: "Server error" });
   }
 });
 router.get("/claimhistory", authenticateToken, async (req: Request, res: Response) => {
   try {
     const claims = await prisma.claim.findMany({
       include: { coupon: { select: { code: true  } } }, // Include coupon code
       orderBy: { timestamp: "desc" },
     });
     res.json(claims);
   } catch (error) {
     console.error("Error fetching claims:", error);
     res.status(500).json({ error: "Server error" });
   }
 });
 
 
export default router;