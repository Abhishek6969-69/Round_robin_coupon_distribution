// admin-frontend/src/components/CouponList/CouponTable.tsx
import React from "react";
import CouponRow from "./Couponrow"; // Fixed casing

interface Coupon {
  id: number;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CouponTableProps {
  coupons: Coupon[];
  onUpdate: (updatedCoupon: Coupon) => void;
  token: string | null;
  setError: (error: string) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({ coupons, onUpdate, token, setError }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">ID</th>
          <th className="p-2 border">Code</th>
          <th className="p-2 border">Active</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {coupons.map((coupon) => (
          <CouponRow
            key={coupon.id}
            coupon={coupon}
            onUpdate={onUpdate}
            token={token}
            setError={setError}
          />
        ))}
      </tbody>
    </table>
  );
};

export default CouponTable;