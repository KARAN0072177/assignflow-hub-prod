import ContactInbox from "../components/ContactInbox";

const AdminInboxPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-4">
        Contact Inbox
      </h1>

      <p className="text-slate-400 text-sm mb-6">
        Messages submitted via the Contact Us form.
      </p>

      <ContactInbox />
    </div>
  );
};

export default AdminInboxPage;