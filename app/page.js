"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const API_BASE_URL = "https://blog-backend-next.onrender.com/api"
const API_BASE_URL_I = "https://blog-backend-next.onrender.com"

// Mock data for reading list and featured series
const readingList = [
  {
    date: "Wednesday, December 06",
    title: "The State of Computer Vision in 2023: Advancements, Challenges, and Future Directions",
  },
  { date: "Monday", title: "Top 5 AI data management platforms: Selection guide for enterprises" },
  { date: "Tuesday", title: "Understanding RAG: The AI innovation bridging language models with enterprise data" },
  { date: "Wednesday", title: "Top 8 AI image annotation tools for machine learning projects" },
]

const featuredSeries = [
  {
    title: "Deep Learning Leaders",
    description: "Interviews with experts who are pushing the boundaries of AI technology",
  },
  {
    title: "AI After Hours",
    description: "Exploring the societal impacts of artificial intelligence beyond the workplace",
  },
  {
    title: "Research Reports",
    description: "In-depth analysis of the latest advancements in computer vision and machine learning",
  },
]

export default function HomePage() {
  const searchParams = useSearchParams()
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const limit = 8

  const [allPosts, setAllPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState(["All"])
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const toggleCategory = (cat) => {
    if (cat === "All") {
      // If clicking "All", select only "All"
      setSelectedCategories(["All"])
    } else {
      // If clicking another category
      let newCategories = selectedCategories.filter((c) => c !== "All")

      if (newCategories.includes(cat)) {
        // If category is already selected, deselect it
        newCategories = newCategories.filter((c) => c !== cat)
      } else {
        // If category is not selected, add it
        newCategories = [...newCategories, cat]
      }

      // If no categories are selected, default to "All"
      if (newCategories.length === 0) {
        setSelectedCategories(["All"])
      } else {
        setSelectedCategories(newCategories)
      }
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`)
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        const categoryNames = data.map((cat) => cat.name)
        setCategories(["All", ...categoryNames])
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([
          "All",
          "Agents",
          "Audio",
        ])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts`)
        if (!response.ok) throw new Error("Failed to fetch posts")
        const data = await response.json()
        setAllPosts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching posts:", error)
        setAllPosts(mockPosts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllPosts()
  }, [])

  useEffect(() => {
    const filtered = allPosts.slice(1).filter((post) => {
      const matchesSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategories.includes("All") || selectedCategories.includes(post.category?.name)

      return matchesSearch && matchesCategory
    })

    setFilteredPosts(filtered)
  }, [allPosts, searchQuery, selectedCategories])

  const totalPages = Math.ceil(filteredPosts.length / limit)
  const startIdx = (currentPage - 1) * limit
  const endIdx = startIdx + limit
  const paginatedPosts = filteredPosts.slice(startIdx, endIdx)

  const featuredPost = allPosts[0]
  const regularPosts = paginatedPosts

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-50">
        <div className="text-sm text-gray-600">
          MyBlog •{" "}
          <span className="text-gray-500">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/admin/register"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="bg-white border-b py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">MyBlog</h1>
          <p className="text-gray-600">Discover insightful articles and stories</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {featuredPost && (
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <div className="rounded-lg overflow-hidden h-96 relative cursor-pointer group">
                    <img
                      src={
                        featuredPost.thumbnailUrl
                          ? `${API_BASE_URL_I}${featuredPost.thumbnailUrl}`
                          : "https://placehold.co/600x400/EEE/31343C"
                      }
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h2 className="text-white text-3xl font-bold mb-3">{featuredPost.title}</h2>
                      <p className="text-gray-200 text-sm">
                        By {featuredPost.author?.username || "Admin"} •{" "}
                        {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()} • 6 min read
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm">
                    Dummy Reading List At MyBlog:
                  </h3>
                  <div className="space-y-3">
                    {readingList.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="text-gray-500 font-medium">{item.date}</p>
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm line-clamp-2">
                          {item.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{filteredPosts.length}</span> of {allPosts.length}{" "}
                    articles
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>

        <div className="mb-12 pb-8 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`text-xs px-3 py-2 rounded-full border transition-colors ${
                  selectedCategories.includes(cat)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {selectedCategories.length > 0 && !selectedCategories.includes("All") && (
            <button
              onClick={() => setSelectedCategories(["All"])}
              className="text-xs text-indigo-600 hover:text-indigo-700 mt-4 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {regularPosts.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, idx) => {
                const isNew = idx === 0
                const isFeatured = idx === 1
                const snippet = post.contentMarkdown
                  ? post.contentMarkdown.replace(/<[^>]*>/g, "").substring(0, 80) + "..."
                  : ""

                return (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-lg hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col border border-gray-100">
                      {isFeatured && (
                        <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-200">
                          <span className="text-xs font-bold text-indigo-600">FEATURED</span>
                        </div>
                      )}
                      {isNew && (
                        <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                          <span className="text-xs font-bold text-red-600">NEW</span>
                        </div>
                      )}
                      <img
                        src={
                          post.thumbnailUrl
                            ? `${API_BASE_URL_I}${post.thumbnailUrl}`
                            : "https://placehold.co/600x400?text=No+Image"
                        }
                        alt={post.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{snippet}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {post.author?.username || "Admin"}</span>
                          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {regularPosts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found. Try adjusting your search or filters.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 my-12 pb-8">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/?page=${page}`}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  page === currentPage ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}

        <div className="my-16 py-12 border-t border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Dummy Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSeries.map((series, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-bold text-gray-900 mb-2">{series.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{series.description}</p>
                <a href="#" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                  View all →
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-12 text-center text-white my-16">
          <h2 className="text-3xl font-bold mb-4">Software To Help You Turn Your Data Into AI</h2>
          <p className="text-indigo-100 mb-6">
            Accelerate your AI journey with our comprehensive data annotation and model training solutions
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Learn More
          </button>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2025 MyBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const mockPosts = [
  {
    _id: "1",
    title: "Encord Releases New Physical AI Suite with LIDAR Support",
    slug: "encord-physical-ai-lidar",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quis ipsum sit amet nibh varius hendrerit in quis massa.",
    author: { username: "John Smith" },
    createdAt: new Date("2023-12-07"),
    category: { name: "Physical AI" },
    thumbnailUrl: null,
  },
]
