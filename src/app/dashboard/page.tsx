export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-neutral-500">Users</p>
          <h2 className="text-3xl font-semibold mt-2">1,204</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-neutral-500">Revenue</p>
          <h2 className="text-3xl font-semibold mt-2">$12,430</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-neutral-500">Orders</p>
          <h2 className="text-3xl font-semibold mt-2">320</h2>
        </div>
      </div>
    </div>
  );
}