import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const email = params.get("email");

  const [step, setStep] = useState<
    "confirm" | "reason" | "success" | "error"
  >("confirm");

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) return;

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/api/newsletter/unsubscribe`,
        {
          email,
          reason,
        }
      );

      setStep("success");
    } catch (err) {
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid unsubscribe link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow p-6">

        {/* CONFIRM STEP */}
        {step === "confirm" && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              Unsubscribe from Newsletter
            </h1>

            <p className="text-gray-600 mb-6">
              Are you sure you want to unsubscribe
              <br />
              <b>{email}</b> from AssignFlow Hub emails?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("reason")}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Yes, Unsubscribe
              </button>

              <a
                href="/"
                className="flex-1 text-center py-2 rounded border"
              >
                Cancel
              </a>
            </div>
          </>
        )}

        {/* REASON STEP */}
        {step === "reason" && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              Optional Feedback
            </h1>

            <p className="text-gray-600 mb-4">
              Let us know why you're unsubscribing (optional)
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Your reason..."
              rows={4}
              className="w-full border p-2 rounded mb-4"
            />

            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Confirm Unsubscribe"}
            </button>
          </>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">
              You're Unsubscribed
            </h1>

            <p className="text-gray-600 mb-4">
              You will no longer receive newsletter emails.
            </p>

            <a
              href="/"
              className="text-blue-600 underline"
            >
              Return to Home
            </a>
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2 text-red-600">
              Something went wrong
            </h1>

            <p className="text-gray-600 mb-4">
              Please try again later.
            </p>

            <button
              onClick={() => setStep("confirm")}
              className="text-blue-600 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;