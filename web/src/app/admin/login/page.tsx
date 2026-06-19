type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 text-gray-950">
      <form
        action="/api/admin/login"
        method="post"
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm font-bold uppercase text-orange-600">Admin</p>
        <h1 className="mt-1 text-2xl font-extrabold text-gray-950">Order Dashboard Login</h1>

        <label className="mt-6 block text-sm font-bold text-gray-800" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-gray-950 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />

        {hasError && (
          <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            Incorrect admin password.
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
