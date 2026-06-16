// ErrorMessage is a simple reusable component for displaying
// user-facing errors. Keeping this separate means we style
// errors consistently across the app from one place.

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-xl mx-auto mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
      ⚠️ {message}
    </div>
  );
}
