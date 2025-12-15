export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Site Under Maintenance
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We&apos;re currently performing scheduled maintenance to improve your experience.
          </p>
          <p className="text-base text-gray-500">
            Please check back soon. We apologize for any inconvenience.
          </p>
        </div>
        <div className="mt-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}

