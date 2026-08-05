const API_URL = "http://127.0.0.1:8000/api/v1/dashboard";

export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/stats`);

  if (!response.ok) {
    throw new Error("Failed to load dashboard data");
  }

  return await response.json();
}