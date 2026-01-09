export const metadata = {
  title: "Generative Instagram AI",
  description: "AI-generated images with OpenAI and Prisma"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
