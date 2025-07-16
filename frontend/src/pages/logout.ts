// src/utils/logout.ts
import axios from "axios";

export const logout = async (): Promise<void> => {
  try {
    await axios.post("http://library.local:8000/api/method/logout", null, {
      withCredentials: true,
    });

    // Optional: Clear any local storage if used
    localStorage.clear();

    // Redirect to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed", error);
    alert("❌ Logout failed. Try again.");
  }
};
