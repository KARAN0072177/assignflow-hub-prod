import { useState } from "react";
import { subscribeNewsletter } from "../services/newsletter.api";

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setMessage(null);

      const res = await subscribeNewsletter({
        email,
        source: "website",
      });

      if (res.alreadySubscribed) {
        setMessage("You're already subscribed.");
      } else if (res.resubscribed) {
        setMessage("Welcome back! You’re subscribed again.");
      } else if (res.subscribed) {
        setMessage("Subscription successful. Check your email!");
      }
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md w-full">
      <h3 className="text-lg font-semibold mb-2">
        Subscribe to our Newsletter
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Get product updates, new features & important announcements.
      </p>

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <p className="text-sm mt-3 text-green-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterSubscribe;