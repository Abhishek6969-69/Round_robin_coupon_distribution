// admin-frontend/src/components/CouponList/CouponRow.tsx
import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Coupon {
  id: number;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CouponRowProps {
  coupon: Coupon;
  onUpdate: (updatedCoupon: Coupon) => void;
  token: string | null;
  setError: (error: string) => void;
}

const CouponRow: React.FC<CouponRowProps> = ({ coupon, onUpdate, token, setError }) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ code: coupon.code, isActive: coupon.isActive });

  const startEditing = () => {
    setEditing(true);
    setEditForm({ code: coupon.code, isActive: coupon.isActive });
  };

  const updateCoupon = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/coupons/${coupon.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(response.data);
      setEditing(false);
      setError("");
    } catch (error) {
      console.error("Error updating coupon:", error);
      setError("Failed to update coupon.");
    }
  };

  const toggleCoupon = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/coupons/${coupon.id}`,
        { isActive: !coupon.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(response.data);
      setError("");
    } catch (error) {
      console.error("Error toggling coupon:", error);
      setError("Failed to toggle coupon status.");
    }
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="p-2 border">{coupon.id}</td>
      <td className="p-2 border">
        {editing ? (
          <input
            type="text"
            value={editForm.code}
            onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
            className="p-1 border rounded w-full"
          />
        ) : (
          coupon.code
        )}
      </td>
      <td className="p-2 border">
        {editing ? (
          <select
            value={editForm.isActive.toString()}
            onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
            className="p-1 border rounded"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ) : coupon.isActive ? (
          "Yes"
        ) : (
          "No"
        )}
      </td>
      <td className="p-2 border">
        {editing ? (
          <button
            onClick={updateCoupon}
            className="bg-green-500 text-white p-1 rounded mr-2"
          >
            Save
          </button>
        ) : (
          <button
            onClick={startEditing}
            className="bg-yellow-500 text-white p-1 rounded mr-2"
          >
            Edit
          </button>
        )}
        <button
          onClick={toggleCoupon}
          className={`p-1 rounded text-white ${coupon.isActive ? "bg-red-500" : "bg-green-500"}`}
        >
          {coupon.isActive ? "Disable" : "Enable"}
        </button>
      </td>
    </tr>
  );
};

export default CouponRow;