import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ModalComponent from "@/components/ModalComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const AssignModal = ({
  isModalOpen,
  setIsModalOpen,
  handleAssign,
  banks,
  segments,
  getSegments,
}) => {
  const [selectedOption, setSelectedOption] = useState("bank");
  const [selectedBank, setSelectedBank] = useState("");
  const [comment, setComment] = useState("");

  const bankOptions = useMemo(() => {
    if (!banks || !Array.isArray(banks)) return [];
    return banks.map((bank) => ({
      value: bank.id.toString(),
      label: bank.bank_name,
    }));
  }, [banks]);

  useEffect(() => {
    if (isModalOpen && selectedOption) {
      getSegments(selectedOption);
    }
  }, [selectedOption, isModalOpen, getSegments]);

  const handleOptionChange = useCallback((option) => {
    setSelectedOption(option);
    setSelectedSegment("");
    if (option === "police") {
      setSelectedBank("");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedOption === "bank") {
      handleAssign(selectedOption, comment, selectedBank);
    } else {
      handleAssign(selectedOption, comment);
    }
    setIsModalOpen(false);
  }, [selectedOption, comment, selectedBank, handleAssign, setIsModalOpen]);

  return (
    <ModalComponent
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Assign Incident"
      onConfirm={handleSubmit}
      confirmLabel="Assign"
    >
      <div>
        <h4 className="font-bold text-lg mb-4">Assign this incident to:</h4>
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          className="space-y-4 text-lg mb-6"
        >
          <Label className="flex items-center space-x-2">
            <RadioGroupItem value="police" />
            <span>Nigerian Police Force</span>
          </Label>
          <Label className="flex items-center space-x-2">
            <RadioGroupItem value="bank" />
            <span>Bank</span>
          </Label>
        </RadioGroup>
        {selectedOption === "bank" && (
          <div className="mt-4 mb-6">
            <Label htmlFor="bank-select">Select Bank</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger id="bank-select" className="mt-2 w-full">
                <SelectValue placeholder="Select a bank" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(banks) && banks.length > 0 ? (
                  banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id.toString()}>
                      {bank.bank_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>
                    No banks available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
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

const ResponseModal = () => {};
