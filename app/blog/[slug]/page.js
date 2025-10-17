"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

const API_BASE_URL = "https://blog-backend-next.onrender.com/api"
const API_BASE_URL_I = "https://blog-backend-next.onrender.com"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug

  const [post, setPost] = useState(null)
  // State now stores ONLY APPROVED comments
  const [approvedComments, setApprovedComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [commentForm, setCommentForm] = useState({ authorName: "", content: "" })
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentMessage, setCommentMessage] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = window.scrollY
      const progress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts/${slug}`)
        if (!response.ok) throw new Error("Post not found")
        const data = await response.json()
        setPost(data.post || data)
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug])

// ... (rest of the component imports and state setup)

  // ... (useEffect for post fetching is unchanged)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // The backend now correctly filters for status: 'approved'
        const response = await fetch(`${API_BASE_URL}/posts/${slug}/comments?page=1&limit=10`)
        if (!response.ok) throw new Error("Failed to fetch comments")
        const data = await response.json()

        // --- CORRECTED CHANGE: The backend already filtered. Just use the data. ---
        // We can rename 'comments' to 'approvedComments' to reflect what they are.
        setApprovedComments(data.comments || []) 
      } catch (error) {
        console.error("Error fetching comments:", error)
        setApprovedComments([])
      }
    }

    if (slug) {
      fetchComments()
    }
  }, [slug])

// ... (handleCommentSubmit and rendering logic remain the same as the final version)

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    if (!commentForm.authorName.trim() || !commentForm.content.trim()) {
      setCommentMessage("Please fill in all fields")
      return
    }

    setIsSubmittingComment(true)
    setCommentMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: commentForm.authorName,
          content: commentForm.content,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit comment")

      // --- CORRECTED CHANGE 2: Do NOT add the comment to the approved list. ---
      // The submitted comment will default to 'pending' status based on your schema.
      // We show a message instead of adding it to the visible list.

      setCommentMessage("Comment submitted successfully and is awaiting approval!")
      setCommentForm({ authorName: "", content: "" })

    } catch (error) {
      console.error("Error submitting comment:", error)
      setCommentMessage("Error submitting comment. Please try again.")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
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

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            <strong className="font-bold">Error!</strong>
            <p className="block sm:inline">Post not found.</p>
            <Link href="/" className="mt-4 block text-indigo-600 hover:text-indigo-800 font-semibold">
              Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // --- Logic to check scroll position and set visibility ---
  useEffect(() => {
    // Function to handle the scroll event
    const toggleVisibility = () => {
      // Show button if page is scrolled down more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Empty dependency array ensures this runs once after initial render

  // --- Function to perform smooth scroll to top ---
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // This provides the smooth scrolling animation
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={scrollToTop}
        // Tailwind classes for styling:
        // Conditional opacity and pointer events based on isVisible state
        className={`
          bg-indigo-600 
          hover:bg-indigo-700 
          text-white 
          p-4 
          rounded-full 
          shadow-lg 
          transition-opacity 
          duration-300 
          ease-in-out
          focus:outline-none 
          focus:ring-2 
          focus:ring-indigo-500 
          focus:ring-offset-2
          transform hover:scale-105
          ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
        aria-label="Scroll back to top"
      >
        <svg 
          className="w-5 h-5" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="12 19 12 5"></polyline>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </div>
  );
};

  const authorUsername = post.author?.username || "Unknown Author"
  const categoryName = post.category?.name || "Uncategorized"
  const thumbnailUrl = post.thumbnailUrl ? `${API_BASE_URL_I}${post.thumbnailUrl}` : null

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

      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-40">
        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all posts
        </Link>

        <article className="bg-white rounded-lg">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b">
              <span>
                By <span className="text-gray-900 font-semibold">{authorUsername}</span>
              </span>
              <span>•</span>
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                {categoryName}
              </span>
            </div>
          </div>

          {thumbnailUrl && (
            <div className="mb-8">
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none mb-12 text-gray-800 leading-relaxed customCSS"
            dangerouslySetInnerHTML={{ __html: post.contentMarkdown }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Comments ({approvedComments.length})</h2>

            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    disabled={isSubmittingComment}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    placeholder="Your comment..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    disabled={isSubmittingComment}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                >
                  {isSubmittingComment ? "Submitting..." : "Submit Comment"}
                </button>
                {commentMessage && (
                  <p className={`text-sm ${commentMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                    {commentMessage}
                  </p>
                )}
              </form>
            </div>

            {approvedComments.length > 0 ? (
              <div className="space-y-6">
                {approvedComments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{comment.authorName || comment.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content || comment.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
                <p className="text-gray-500">No approved comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More from MyBlog</h2>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            View all posts
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2025 MyBlog. All rights reserved.</p>
        </div>
      </footer>
      <BackToTopButton />
    </div>
  )
}