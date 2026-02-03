import { useEffect, useState } from "react";
import ContactMessageCard from "./ContactMessageCard";
import { getAdminContacts } from "../../services/adminContact.api";
import { useAdminSocket } from "../AdminSocketProvider";
import type { AdminContactMessage } from "../../services/adminContact.api";

const ContactInbox = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { lastEvent } = useAdminSocket();

  const fetchMessages = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setLoading(true);
    const data = await getAdminContacts(token);
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🔔 React to real-time contact events
  useEffect(() => {
    if (lastEvent?.type === "contact:new") {
      fetchMessages();
    }
  }, [lastEvent]);

  if (loading) {
    return (
      <p className="text-slate-400 text-sm">
        Loading inbox...
      </p>
    );
  }

  if (messages.length === 0) {
    return (
      <p className="text-slate-400 text-sm">
        No contact messages yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <ContactMessageCard
          key={msg.id}
          message={msg}
        />
      ))}
    </div>
  );
};

export default ContactInbox;