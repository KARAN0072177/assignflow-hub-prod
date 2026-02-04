type Props = {
  data: any[];
};

const SubscribersTable = ({ data }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3">Email</th>
            <th className="p-3">Subscribed At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => (
            <tr
              key={u._id}
              className="border-b border-slate-800 hover:bg-slate-800/40"
            >
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                {new Date(u.subscribedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscribersTable;