"use client"

export function MessageBox({ message, isError }) {
  if (!message) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white transition-opacity duration-300 ${
        isError ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {message}
    </div>
  )
}
