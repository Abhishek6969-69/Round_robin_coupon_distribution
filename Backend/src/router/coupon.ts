// Backend/src/routes/couponRouter.ts
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const couponRouter = express.Router();
const prisma = new PrismaClient();

couponRouter.post("/claim", async (req: any, res: any) => {
  // Handle X-Forwarded-For header properly
  const forwardedFor = req.headers["x-forwarded-for"];
  const ipAddress = forwardedFor
    ? (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(",")[0]).trim()
    : req.ip;
  const cookieId = req.cookies.coupon_session || Math.random().toString(36).substring(2);

  console.log("Detected IP:", ipAddress); // Debug log

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log("Checking claims since:", twentyFourHoursAgo); // Debug log
    const recentClaim = await prisma.claim.findFirst({
      where: {
        ipaddress: ipAddress,
        timestamp: { gte: twentyFourHoursAgo },
      },
    });
    if (recentClaim) {
      console.log("Found recent claim:", recentClaim); // Debug log
      return res.status(429).json({ message: "You have already claimed a coupon in the last 24 hours" });
    }

    if (req.cookies.coupon_session) {
      const existingClaim = await prisma.claim.findFirst({
        where: { cookieId: req.cookies.coupon_session },
      });
      if (existingClaim) {
        const coupon = await prisma.coupon.findUnique({ where: { id: existingClaim.couponId } });
        return res.status(429).json({ message: `You’ve already claimed ${coupon?.code} in this session` });
      }
    }

    const coupons = await prisma.coupon.findMany({ where: { isActive: true } });
    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ message: "No available coupons" });
    }

    const lastClaim = await prisma.claim.findFirst({ orderBy: { id: "desc" } });
    const lastIndex = lastClaim ? coupons.findIndex((coupon) => coupon.id === lastClaim.couponId) : -1;
    const nextIndex = (lastIndex + 1) % coupons.length;
    const nextCoupon = coupons[nextIndex];

    await prisma.claim.create({
      data: {
        couponId: nextCoupon.id,
        ipaddress:ipAddress,
        cookieId,
        timestamp: new Date(),
      },
    });

    res.cookie("coupon_session", cookieId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json({ message: `You’ve claimed ${nextCoupon.code}!` });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default couponRouter;