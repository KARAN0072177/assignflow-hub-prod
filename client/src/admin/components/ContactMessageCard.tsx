import { Mail, Phone, Clock } from "lucide-react";
import type { AdminContactMessage } from "../../services/adminContact.api";

const ContactMessageCard = ({
  message,
}: {
  message: AdminContactMessage;
}) => {
  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium text-white">
          {message.name}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="text-sm text-slate-400 flex items-center gap-2">
        <Mail className="w-4 h-4" />
        {message.email}
      </div>

      {message.phone && (
        <div className="text-sm text-slate-400 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {message.phone}
        </div>
      )}

      <p className="text-sm text-slate-300 pt-2 border-t border-slate-800">
        {message.message}
      </p>
    </div>
  );
};

export default ContactMessageCard;