"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi, setAuthToken } from "@/lib/api"
import { MessageBox } from "@/components/message-box"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await fetchApi("/auth/login", "POST", { email, password })

      if (data && data.token) {
        setAuthToken(data.token)
        setMessage("Login successful! Redirecting...")
        setIsError(false)
        setTimeout(() => router.push("/admin"), 1000)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8 min-h-screen bg-gray-50">
      <MessageBox message={message} isError={isError} />
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-8">Sign in to access your dashboard.</p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blog-purple-dark focus:border-blog-purple-dark transition duration-150"
                placeholder="user@example.com"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blog-purple-dark focus:border-blog-purple-dark transition duration-150"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blog-purple-dark hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-150 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <a href="/" className="text-sm text-center text-blog-purple-dark font-semi-bold hover:text-purple-700">
              Home
            </a>&nbsp;|&nbsp;
            Don't have an account?{" "}
            <a href="/admin/register" className="font-medium text-blog-purple-dark hover:text-purple-700">
              Register here
            </a>
          </p>
          <p>

          </p>
        </div>
      </div>
    </div>
  )
}
