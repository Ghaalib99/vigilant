import { User, CreditCard, Tag, FileText, Calendar, Image } from "lucide-react";

export const IncidentDetailsTab = ({ incident }) => {
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="w-full grid grid-cols-6 space-x-4">
      <div className="col-span-4 grid md:grid-cols-2 gap-6  bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-gray-700 bg-white p-4 rounded-md border border-gray-200">
            {incident.details || "No description provided"}
          </p>
        </div>
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bank</h3>
          <p className="text-gray-700 bg-white p-4 rounded-md border border-gray-200">
            {incident?.bank?.bank_name}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm flex items-center mb-1">
            <User className="h-4 w-4 mr-1" /> Account Name
          </p>
          <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
            {incident.account_name}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm flex items-center mb-1">
            <CreditCard className="h-4 w-4 mr-1" /> Account Number
          </p>
          <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200 font-mono">
            {incident.account_number}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm flex items-center mb-1">
            <Tag className="h-4 w-4 mr-1" /> Transaction Type
          </p>
          <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
            {incident.transaction_type?.name}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm flex items-center mb-1">
            <FileText className="h-4 w-4 mr-1" /> Transaction Reference
          </p>
          <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200 font-mono">
            {incident.transaction_ref}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-1" /> Incident Date
          </p>
          <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
            {new Date(incident.incident_date).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm flex items-center mb-1">
            <FileText className="h-4 w-4 mr-1" /> Proof
          </p>
          <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
            {incident.proof_1 ? (
              <a
                href={baseUrl + "/proofs/" + incident.proof_1}
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
      {/* Right Column: Proof */}
      <div className="col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Proof</h3>
        {incident.proof_1 !== "0" && incident.proof_1 ? (
  <div className="bg-white rounded-md border h-[500px] w-full">
    <img
      src={baseUrl + "/proofs/" + incident.proof_1}
      alt="Proof"
      className="w-full h-full rounded-md object-cover"
    />
  </div>
) : (
  <div className="text-gray-700 bg-white p-4 h-[500px] w-full font-bold text-xl rounded-md border border-gray-200 flex justify-center items-center">
   <p> No proof provided</p>
  </div>
)}

      </div>
    </div>
  );
};
