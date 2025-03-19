import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ModalComponent from "@/components/ModalComponent";
import Select from "react-select";
import { useAuth } from "@/app/hooks/useAuth";

export const AssignModal = ({
  isModalOpen,
  setIsModalOpen,
  handleAssign,
  banks,
  segments,
  getSegments,
  selectedSegment,
  setSelectedSegment,
}) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState("bank");
  const [selectedBank, setSelectedBank] = useState("");
  const [comment, setComment] = useState("");
  const [loadingSegments, setLoadingSegments] = useState(false);

  // Memoize bank options for react-select
  const bankOptions = useMemo(() => {
    if (!banks || !Array.isArray(banks)) return [];
    return banks.map((bank) => ({
      value: bank.id.toString(),
      label: bank.bank_name,
    }));
  }, [banks]);

  // Fetch segments when the modal opens or the selected option changes
  useEffect(() => {
    if (isModalOpen && selectedOption) {
      setLoadingSegments(true);
      getSegments(selectedOption).finally(() => {
        setLoadingSegments(false);
      });
    }
  }, [selectedOption, isModalOpen, getSegments]);

  // Handle option change (bank or police)
  const handleOptionChange = useCallback(
    (option) => {
      setSelectedOption(option);
      setSelectedSegment("");
      if (option === "police") {
        setSelectedBank("");
      }
    },
    [setSelectedSegment]
  );

  // Handle reset form
  const resetForm = useCallback(() => {
    setSelectedOption("bank");
    setSelectedBank("");
    setComment("");
    setSelectedSegment("");
  }, [setSelectedSegment]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (selectedOption === "bank") {
      handleAssign(selectedOption, comment, selectedBank);
    } else {
      handleAssign(selectedOption, comment);
    }
    setIsModalOpen(false);
    resetForm();
  }, [
    selectedOption,
    comment,
    selectedBank,
    handleAssign,
    setIsModalOpen,
    resetForm,
  ]);

  // Handle bank selection change
  const handleBankChange = useCallback((selectedOption) => {
    setSelectedBank(selectedOption?.value || "");
  }, []);

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
        {user?.role?.name === "vgn-customer-service" && (
          <>
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
                <Select
                  id="bank-select"
                  options={bankOptions}
                  onChange={handleBankChange}
                  placeholder="Select a bank"
                  isLoading={loadingSegments}
                  isClearable
                  isSearchable
                  value={bankOptions.find(
                    (option) => option.value === selectedBank
                  )}
                  className="mt-2"
                />
              </div>
            )}
          </>
        )}

        {user?.role?.name === "npf-investigator" && (
          <>
            <RadioGroup
              value={selectedOption}
              onValueChange={handleOptionChange}
              className="space-y-4 text-lg mb-6"
            >
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="police" />
                <span>NPF Investigator</span>
              </Label>
            </RadioGroup>
          </>
        )}

        {user?.role?.name === "bank-fraud-desk" && (
          <>
            <RadioGroup
              value={selectedOption}
              onValueChange={handleOptionChange}
              className="space-y-4 text-lg mb-6"
            >
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="bank" />
                <span>Internal Control</span>
              </Label>
            </RadioGroup>
          </>
        )}

        {user?.role?.name === "bank-internal-control" && (
          <>
            <RadioGroup
              value={selectedOption}
              onValueChange={handleOptionChange}
              className="space-y-4 text-lg mb-6"
            >
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="bank" />
                <span>Internal Audit</span>
              </Label>
            </RadioGroup>
          </>
        )}

        {user?.role?.name === "bank-internal-audit" && (
          <>
            <RadioGroup
              value={selectedOption}
              onValueChange={handleOptionChange}
              className="space-y-4 text-lg mb-6"
            >
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="bank" />
                <span>Risk</span>
              </Label>
            </RadioGroup>
          </>
        )}

        {user?.role?.name === "bank-risk" && (
          <>
            <RadioGroup
              value={selectedOption}
              onValueChange={handleOptionChange}
              className="space-y-4 text-lg mb-6"
            >
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value="bank" />
                <span>Finance</span>
              </Label>
            </RadioGroup>
          </>
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
