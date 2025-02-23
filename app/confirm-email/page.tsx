export default function ConfirmEmailPage() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow rounded text-center">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Email</h1>
      <p className="mb-4">
        We have sent you an email. Please check your inbox and click the
        confirmation link to complete your registration.
      </p>
      <a href="/login" className="text-blue-600 hover:underline">
        Back to Login
      </a>
    </div>
  );
}
