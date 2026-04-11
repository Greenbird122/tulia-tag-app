// src/pages/ErrorPage.jsx
import { useLocation, Link } from 'react-router-dom';

export default function ErrorPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const error = params.get('error');
  const errorCode = params.get('error_code');
  const errorDescription = params.get('error_description');

  let title = 'Oops!';
  let message = 'Something went wrong.';

  if (errorCode === 'otp_expired') {
    title = 'Link Expired';
    message = 'The password reset link has expired. Please request a new one.';
  } else if (error === 'access_denied') {
    title = 'Access Denied';
    message = 'You do not have permission to access this page.';
  } else if (errorDescription) {
    message = decodeURIComponent(errorDescription);
  }

  return (
    <div className="flex-1 bg-white flex flex-col justify-center px-8 relative h-full text-center">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-8">{message}</p>
      <div className="space-y-3">
        <Link
          to="/forgot-password"
          className="block w-full bg-brand-500 text-white rounded-xl py-4 font-semibold text-sm shadow-lg"
        >
          Request New Link
        </Link>
        <Link
          to="/login"
          className="block text-brand-500 text-sm font-medium hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}