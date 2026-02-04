import { useState } from "react";
import { sendNewsletter } from "./newsletter.admin.api";

const SendNewsletterForm = () => {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    await sendNewsletter({ subject, html });
    setStatus("Newsletter sent successfully");
    setSubject("");
    setHtml("");
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
        placeholder="HTML content"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        Send Newsletter
      </button>

      {status && <p className="text-green-400">{status}</p>}
    </div>
  );
};

export default SendNewsletterForm;