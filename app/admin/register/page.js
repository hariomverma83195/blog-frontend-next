"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi, setAuthToken } from "@/lib/api"
import { MessageBox } from "@/components/message-box"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await fetchApi("/auth/register", "POST", { username, email, password })

      if (data && data.token) {
        setAuthToken(data.token)
        setMessage("Registration successful! Redirecting to dashboard...")
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
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Create Account</h2>
          <p className="text-gray-500 text-center mb-8">Start contributing to MyBlog</p>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blog-purple-dark focus:border-blog-purple-dark transition duration-150"
                placeholder="johndoe"
              />
            </div>
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
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/admin/login" className="font-medium text-blog-purple-dark hover:text-purple-700">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
