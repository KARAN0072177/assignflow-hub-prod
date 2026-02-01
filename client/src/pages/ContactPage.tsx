import { useState } from "react";
import { submitContactForm } from "../services/contact.api";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await submitContactForm({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message,
      });

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-2">
        Contact Us
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        Share suggestions, bug reports, inquiries, or anything else.
      </p>

      {/* Name */}
      <label className="block text-sm font-medium mb-1">
        Name *
      </label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
        required
      />

      {/* Email */}
      <label className="block text-sm font-medium mb-1">
        Email *
      </label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
        required
      />

      {/* Phone */}
      <label className="block text-sm font-medium mb-1">
        Phone (optional)
      </label>
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      {/* Message */}
      <label className="block text-sm font-medium mb-1">
        Message *
      </label>
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        rows={5}
        className="border p-2 w-full mb-4"
        required
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {/* Feedback */}
      {success && (
        <p className="text-green-600 text-sm mt-3">
          ✅ Message sent successfully. Check your email.
        </p>
      )}

      {error && (
        <p className="text-red-600 text-sm mt-3">
          {error}
        </p>
      )}
    </div>
  );
};

export default ContactPage;