import Link from "next/link";

export default function GamePage() {
  try {
    return (
      <div className="min-h-screen bg-[#FFF9F4] flex items-center justify-center px-6">
        <div className="bg-white shadow-xl rounded-2xl p-12 text-center max-w-xl">
          <h1 className="text-3xl font-semibold mb-4">
            Game Coming Soon 🎮
          </h1>

          <p className="text-gray-600 mb-6">
            I'm still deciding what kind of game to put here.
            Maybe something fun with cats.
          </p>

          <Link
            href="/"
            className="px-6 py-2 bg-[#F77F7F] text-white rounded-lg"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-red-500 text-xl">
          Failed to load the game page.
        </h1>
      </div>
    );
  }
}