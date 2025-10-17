import "./globals.css"

export const metadata = {
  title: "MyBlog",
  description: "Blog plus cms management system"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-gray-50">{children}</body>
    </html>
  )
}
