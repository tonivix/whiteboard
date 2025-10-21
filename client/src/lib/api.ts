import axios, { AxiosError } from "axios";

/**
 * API service using axios 0.21.1
 * 
 * This version has known security vulnerabilities:
 * - CVE-2021-3749: Regular Expression Denial of Service (ReDoS)
 * - CVE-2020-28168: Server-Side Request Forgery (SSRF)
 * 
 * Breaking changes from 0.x to 1.x that affect this code:
 * 
 * 1. Error structure changed - AxiosError is now a proper class constructor
 *    In 0.x: error.response, error.request, error.message are direct properties
 *    In 1.x: AxiosError class with different structure and methods
 * 
 * 2. Error.toJSON() method signature changed
 *    In 0.x: toJSON() returns different structure
 *    In 1.x: toJSON() returns standardized structure
 * 
 * 3. Type definitions changed significantly
 *    In 0.x: AxiosError is an interface
 *    In 1.x: AxiosError is a class with constructor
 */

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Custom error handler using 0.x structure
// This will break in 1.x because error handling was refactored
const handleAxiosError = (error: any) => {
  // In axios 0.x, we access error properties directly
  // In axios 1.x, AxiosError is a proper class and this structure changes
  if (error.response) {
    // Server responded with error status
    console.error("Response error:", {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
    
    // This error serialization works differently in 1.x
    const errorJSON = error.toJSON ? error.toJSON() : {};
    console.error("Error JSON:", errorJSON);
    
    throw new Error(`Server error: ${error.response.status}`);
  } else if (error.request) {
    // Request was made but no response received
    console.error("Request error:", error.request);
    throw new Error("No response from server");
  } else {
    // Something else happened
    console.error("Error:", error.message);
    throw error;
  }
};

export const saveWhiteboard = async (data: unknown) => {
  try {
    const response = await api.post("/whiteboard/save", data);
    return response.data;
  } catch (error) {
    // This error handling pattern works in 0.x but needs changes in 1.x
    // because AxiosError became a proper class constructor
    handleAxiosError(error);
  }
};

export const loadWhiteboard = async (id: string) => {
  try {
    const response = await api.get(`/whiteboard/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// This function uses axios 0.x error checking pattern
// In 1.x, you should use: error instanceof AxiosError
export const isNetworkError = (error: any): boolean => {
  // In 0.x: check if it's an axios error by checking properties
  // In 1.x: use instanceof AxiosError (proper class)
  return axios.isAxiosError(error) && !error.response;
};

// Example of using deprecated error properties
// These work in 0.x but may need adjustment in 1.x
export const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Accessing error.config works differently in 1.x
    const config = error.config;
    const method = config?.method?.toUpperCase();
    const url = config?.url;
    
    if (error.response) {
      return `${method} ${url} failed with status ${error.response.status}`;
    } else if (error.request) {
      return `${method} ${url} - No response received`;
    }
  }
  return error.message || "Unknown error";
};

export default api;

