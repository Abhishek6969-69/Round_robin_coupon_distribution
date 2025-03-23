// admin-frontend/src/components/ClaimHistory.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface Claim {
  id: number;
  couponId: number;
  coupon: { code: string };
  ipAddress: string;
  cookieId: string;
  timestamp: string;
}

const ClaimHistory: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchClaims();
  }, [token, navigate]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/admin/claimhistory`, { // Fixed endpoint
        headers: { Authorization: `Bearer ${token}` },
      });
      setClaims(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching claims:", error);
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        setError("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to fetch claim history.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Claim History</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/coupons")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Back to Coupons
            </button>
            <button
              onClick={fetchClaims}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !claims.length && (
          <div className="text-center text-gray-600">Loading claims...</div>
        )}

        {/* Claims Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Coupon Code</th>
                {/* <th className="p-4 text-left font-semibold">IP Address</th> */}
                <th className="p-4 text-left font-semibold">Session ID</th>
                <th className="p-4 text-left font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No claims found.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-4 text-gray-800">{claim.id}</td>
                    <td className="p-4 text-gray-800">{claim.coupon.code}</td>
                    {/* <td className="p-4 text-gray-800">{claim.ipAddress}</td> */}
                    <td className="p-4 text-gray-800">{claim.cookieId}</td>
                    <td className="p-4 text-gray-800">
                      {new Date(claim.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClaimHistory;