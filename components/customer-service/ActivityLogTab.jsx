export const ActivityLogTab = ({ logs }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Activity Timeline
      </h3>
      {logs.length > 0 ? (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          {logs.map((log) => (
            <div key={log.id} className="mb-6 ml-12 relative">
              <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900">
                    {log.action}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">By: {log.user}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md border border-gray-200 text-center">
          <p className="text-gray-600">No activity logs available.</p>
        </div>
      )}
    </div>
  );
};
