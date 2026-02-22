import Link from "next/link";

export default function Home() {
  const posts = [
    {
      id: 1,
      title: "The Day I Met You",
      date: "February 14, 2024",
      preview: "I didn’t know that day would change everything."
    },
    {
      id: 2,
      title: "Our First Date",
      date: "March 2, 2024",
      preview: "I was nervous but also very happy."
    },
    {
      id: 3,
      title: "Why I Love You",
      date: "Today",
      preview: "There are so many reasons, but here are some."
    }
  ];

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight mb-4">
          For You ❤️
        </h1>

        <p className="text-neutral-600 max-w-xl mx-auto">
          This little website is my way of keeping our memories,
          moments, and stories together.
        </p>
      </section>

      {/* Blog Posts */}
      <section className="max-w-2xl mx-auto space-y-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-neutral-500">{post.date}</p>
            <h2 className="text-2xl font-semibold mt-1">{post.title}</h2>
            <p className="text-neutral-600 mt-2">{post.preview}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}