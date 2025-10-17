const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://blog-backend-next.onrender.com/api"

export async function fetchApi(endpoint, method = "GET", body = null, token = null) {
  const url = `${API_URL}${endpoint}`
  const isFormData = body instanceof FormData

  const headers = {}
  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  }

  try {
    const response = await fetch(url, config)

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        window.location.href = "/admin/login"
      }
      return null
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Server error" }))
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`)
    }

    if (response.status === 204) return {}

    return await response.json()
  } catch (error) {
    console.error("API Error:", error.message)
    throw error
  }
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export function setAuthToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}
