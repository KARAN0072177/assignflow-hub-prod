import { useState } from "react";
import { sendNewsletter } from "./newsletter.admin.api";

const SendNewsletterForm = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    try {
      await sendNewsletter({
        subject,
        content,
      });

      setStatus("Newsletter sent successfully");
      setSubject("");
      setContent("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to send newsletter");
    }
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="w-full p-2 bg-slate-800 border border-slate-700 rounded h-40"
        placeholder="Write newsletter content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        Send Newsletter
      </button>

      {status && (
        <p
          className={
            status.includes("Failed")
              ? "text-red-400"
              : "text-green-400"
          }
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default SendNewsletterForm;