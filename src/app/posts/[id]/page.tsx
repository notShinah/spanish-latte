export default function PostPage({ params }: { params: { id: string } }) {
  const posts: any = {
    "1": {
      title: "The Day I Met You",
      content:
        "That day felt normal at first, but meeting you made everything different."
    },
    "2": {
      title: "Our First Date",
      content:
        "I remember how nervous I was, but seeing you smile made me calm."
    },
    "3": {
      title: "Why I Love You",
      content:
        "I love the way you laugh, the way you care, and how you make my life brighter."
    }
  };

  const post = posts[params.id];

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-semibold mb-4">{post.title}</h1>
      <p className="text-neutral-600 leading-relaxed">
        {post.content}
      </p>
    </article>
  );
}