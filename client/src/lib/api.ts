import axios from "axios";

/**
 * API service using axios 0.21.1
 * 
 * This version has known security vulnerabilities:
 * - CVE-2021-3749: Regular Expression Denial of Service (ReDoS)
 * - CVE-2020-28168: Server-Side Request Forgery (SSRF)
 * 
 * Breaking changes from 0.x to 1.x:
 * - Response data structure changed
 * - Error handling changed
 * - Config options renamed/removed
 * - TypeScript types updated
 * - Default timeout behavior changed
 */

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example API calls that would be affected by axios upgrade
export const saveWhiteboard = async (data: unknown) => {
  try {
    const response = await api.post("/whiteboard/save", data);
    return response.data;
  } catch (error) {
    // Error handling would need to change in axios 1.x
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.message);
      throw error;
    }
    throw error;
  }
};

export const loadWhiteboard = async (id: string) => {
  try {
    const response = await api.get(`/whiteboard/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.message);
      throw error;
    }
    throw error;
  }
};

export default api;

