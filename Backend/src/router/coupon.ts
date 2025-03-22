// Backend/src/routes/couponRouter.ts
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const couponRouter = express.Router();
const prisma = new PrismaClient();

couponRouter.post("/claim", async (req: any, res: any) => {
  console.log("Received /claim request");
  const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip;
  const cookieId = req.cookies.coupon_session || Math.random().toString(36).substring(2);
  console.log("IP:", ipAddress, "Cookie ID:", cookieId);

  try {
    // Check recent claim by IP
    console.log("Checking recent claim...");
    const recentClaim = await prisma.claim.findFirst({
      where: {
        ipaddress:ipAddress, // Fixed: `ipaddress` to `ipAddress`
        timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if (recentClaim) {
      console.log("Recent claim found:", recentClaim);
      return res.status(429).json({ message: "You have already claimed a coupon in the last 24 hours" });
    }

    // Check session claim
    console.log("Checking session claim...");
    if (req.cookies.coupon_session) {
      const existingClaim = await prisma.claim.findFirst({
        where: { cookieId: req.cookies.coupon_session },
      });
      if (existingClaim) {
        console.log("Session claim found:", existingClaim);
        const coupon = await prisma.coupon.findUnique({ where: { id: existingClaim.couponId } });
        return res.status(429).json({ message: `You’ve already claimed ${coupon?.code} in this session` });
      }
    }

    // Fetch active coupons
    console.log("Fetching active coupons...");
    const coupons = await prisma.coupon.findMany({
      where: { isActive: true },
    });
    console.log("Coupons found:", coupons);
    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ message: "No available coupons" });
    }

    // Round-robin logic (use coupons directly, no transformation)
    console.log("Determining next coupon...");
    const lastClaim = await prisma.claim.findFirst({ orderBy: { id: "desc" } });
    const lastIndex = lastClaim ? coupons.findIndex((coupon) => coupon.id === lastClaim.couponId) : -1;
    const nextIndex = (lastIndex + 1) % coupons.length;
    const nextCoupon = coupons[nextIndex];
    console.log("Next coupon:", nextCoupon);

    if (!nextCoupon) {
      return res.status(500).json({ message: "Error determining next coupon" });
    }

    // Create claim
    console.log("Creating claim...");
    await prisma.claim.create({
      data: {
        couponId: nextCoupon.id, // Keep as number, per Prisma schema
        ipaddress:ipAddress, // Fixed: `ipaddress` to `ipAddress`
        cookieId,
        timestamp: new Date(),
      },
    });

    // Set cookie and send response
    console.log("Setting cookie and sending response...");
    res.cookie("coupon_session", cookieId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json({ message: `You’ve claimed ${nextCoupon.code}!` });
  } catch (error) {
    console.error("Error in /claim:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    await prisma.$disconnect();
  }
});

export default couponRouter;