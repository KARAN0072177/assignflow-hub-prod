import { useEffect, useState } from "react";
import {
  fetchSubscribers,
} from "./newsletter.admin.api";

import SubscribersTable from "./SubscribersTable";
import UnsubscribersTable from "./UnsubscribersTable";
import SendNewsletterForm from "./SendNewsletterForm";

const NewsletterPage = () => {
  const [tab, setTab] = useState<
    "subscribed" | "unsubscribed" | "send"
  >("subscribed");

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (tab === "send") return;

    fetchSubscribers(tab).then(setData);
  }, [tab]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Newsletter Center
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["subscribed", "unsubscribed", "send"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "subscribed" && (
        <SubscribersTable data={data} />
      )}

      {tab === "unsubscribed" && (
        <UnsubscribersTable data={data} />
      )}

      {tab === "send" && <SendNewsletterForm />}
    </div>
  );
};

export default NewsletterPage;