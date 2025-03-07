import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const ModalComponent = ({
  children,
  open,
  onClose,
  title,
  options,
  onConfirm,
  confirmLabel = "Confirm",
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(selectedOption, comment);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="p-4">{children}</div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalComponent;
