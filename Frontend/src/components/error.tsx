import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500 animate-bounce">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Oops! You're Lost...</h2>
      <p className="mt-2 text-gray-300 text-lg text-center px-6">
        It looks like you've wandered into the unknown. <br />
        Maybe you're not logged in or don’t have access to this page.
      </p>
      
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md"
        >
          Go to Home 🏠
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md"
        >
          Login 🔐
        </button>
      </div>

      <p className="mt-8 text-gray-400 text-sm">
        If you believe this is an error, contact support. 📩
      </p>
    </div>
  );
};

export default NotFound;
