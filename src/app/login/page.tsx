export default function Login() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">Welcome back</h1>

        <input
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
        />

        <input
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Password"
          type="password"
        />

        <button className="w-full rounded-lg bg-black p-3 text-white hover:bg-black/90">
          Sign in
        </button>
      </div>
    </div>
  );
}