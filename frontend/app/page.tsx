export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col items-center gap-6">
        <div role="status" className="flex items-center gap-4">
          <svg
            className="w-10 h-10 text-blue-600 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true">
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    </div>
  );
}
