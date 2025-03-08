import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ModalComponent from "@/components/ModalComponent";

export const AssignModal = ({ isModalOpen, setIsModalOpen, handleAssign }) => {
  const [selectedOption, setSelectedOption] = useState("bank");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    handleAssign(selectedOption, comment);
    setIsModalOpen(false);
  };

  return (
    <ModalComponent
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Assign Incident"
      options={[
        { value: "bank", label: "Bank" },
        { value: "police", label: "Nigerian Police Force" },
      ]}
      onConfirm={handleSubmit}
      confirmLabel="Assign"
    >
      <div>
        <h4 className="font-bold text-lg mb-4">Assign this incident to:</h4>
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="space-y-4 text-lg mb-6"
        >
          <Label className="flex items-center space-x-2">
            <RadioGroupItem value="bank" />
            <span>Bank</span>
          </Label>
          <Label className="flex items-center space-x-2">
            <RadioGroupItem value="police" />
            <span>Nigerian Police Force</span>
          </Label>
        </RadioGroup>

        <div className="mt-4">
          <Label>Comment</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="mt-2"
          />
        </div>
      </div>
    </ModalComponent>
  );
};
