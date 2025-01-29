import axios from "axios";
import Cookies from "js-cookie";

export const isAuthenticated = async () => {
  const token = Cookies.get("token");
  if (!token) return false;

  try {
    const response = await axios.get("http://localhost:5000/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.valid;
  } catch (error) {
    console.log(error)
    return false;
  }
};
