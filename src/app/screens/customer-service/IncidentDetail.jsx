import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IncidentDetail = ({ params }) => {
  //   const incidentId = params.id;
  const incident = {
    incidentId: 1,
    reportedBy: "John Doe",
    dateCreated: "2023-10-01",
    transactionType: "Payment",
    transactionReference: "TX123456",
    status: "Resolved",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Incident Details</h1>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="logs">Incident Logs</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="mt-4 bg-white p-6">
          <TabsContent value="details" className="mt-4">
            <TabsContent value="details" className="mt-4">
              <div className="grid grid-cols-2 gap-4 w-[50%]">
                {[
                  {
                    label: "Transaction ID",
                    value: "Bank ABC 1234 (Zenith Bank)",
                  },
                  { label: "Reported By", value: "Adeyanju Gabriel" },
                  { label: "Transaction Type", value: "Bank Debit" },
                  {
                    label: "Transaction Reference",
                    value: "12345678901234567890",
                  },
                  { label: "Status", value: "Newly Reported" },
                  { label: "Date", value: "Jan 11th, 2022 18:26" },
                  { label: "Notes", value: "Uhm, help me find my money" },
                ].map((item) => (
                  <p key={item.label} className="col-span-1 mb-4">
                    <strong className="block">{item.label}:</strong>{" "}
                    {item.value}
                  </p>
                ))}
              </div>

              <Button className="mt-10 w-40 h-11">Add Comment</Button>
            </TabsContent>
          </TabsContent>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="mt-4 bg-white p-6">
          <div className="space-y-4">
            <p>Comments will be displayed here.</p>
            {/* Add a comment section or component here */}
          </div>
        </TabsContent>

        {/* Incident Logs Tab */}
        <TabsContent value="logs" className="mt-4 bg-white p-6">
          <div className="space-y-4">
            <p>Incident logs will be displayed here.</p>
            {/* Add a log section or component here */}
          </div>
        </TabsContent>

        <div className="flex">
          <Button className="mt-10 w-40 h-11">Assign</Button>
          <Button className="mt-10 w-40 h-11 bg-destructive">Void</Button>
        </div>
      </Tabs>
    </div>
  );
};

export default IncidentDetail;
