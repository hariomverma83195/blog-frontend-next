"use client"

import { useState, useEffect } from "react"
import { getAuthToken } from "./api"

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    setIsLoggedIn(!!token)
    setIsLoading(false)
  }, [])

  return { isLoggedIn, isLoading }
}

export function useMessage() {
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const showMessage = (text, error = false) => {
    setMessage(text)
    setIsError(error)
    setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  return { message, isError, showMessage }
}
