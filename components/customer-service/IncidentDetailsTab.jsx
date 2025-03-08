import { User, CreditCard, Tag, FileText, Calendar } from "lucide-react";

export const IncidentDetailsTab = ({ incident }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 w-full md:w-3/4 lg:w-2/3 bg-gray-50 p-6 rounded-lg border border-gray-100">
      <div className="col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
        <p className="text-gray-700 bg-white p-4 rounded-md border border-gray-200">
          {incident.details || "No description provided"}
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-sm flex items-center mb-1">
          <User className="h-4 w-4 mr-1" /> Account Name
        </p>
        <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
          {incident.account_name}
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-sm flex items-center mb-1">
          <CreditCard className="h-4 w-4 mr-1" /> Account Number
        </p>
        <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200 font-mono">
          {incident.account_number}
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-sm flex items-center mb-1">
          <Tag className="h-4 w-4 mr-1" /> Transaction Type
        </p>
        <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
          {incident.transaction_type?.name}
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-sm flex items-center mb-1">
          <FileText className="h-4 w-4 mr-1" /> Transaction Reference
        </p>
        <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200 font-mono">
          {incident.transaction_ref}
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-sm flex items-center mb-1">
          <Calendar className="h-4 w-4 mr-1" /> Incident Date
        </p>
        <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
          {new Date(incident.incident_date).toLocaleString()}
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-sm flex items-center mb-1">
          <FileText className="h-4 w-4 mr-1" /> Proof
        </p>
        <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
          {incident.proof ? (
            <a
              href={incident.proof}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Proof
            </a>
          ) : (
            "No proof provided"
          )}
        </p>
      </div>
    </div>
  );
};
