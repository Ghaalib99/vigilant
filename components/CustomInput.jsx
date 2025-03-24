import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Select from "react-select";
import { useState } from "react";

export const CustomInput = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  errors,
  validation = {},
  icon: Icon = null,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordField = type === "password";
  const fieldType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={fieldType}
          placeholder={placeholder}
          className={`w-full ${errors[id] ? "border-red-500" : ""}`}
          {...register(id, validation)}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
        {Icon && !isPasswordField && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Icon size={18} />
          </div>
        )}
      </div>
      {errors[id] && (
        <p className="text-red-500 text-xs mt-1">{errors[id].message}</p>
      )}
    </div>
  );
};

export const CustomSelect = ({
  id,
  label,
  options,
  placeholder = "Select an option",
  register,
  errors,
  setValue,
  watch,
  validation = {},
}) => {
  const handleChange = (selectedOption) => {
    setValue(id, selectedOption.value, { shouldValidate: true });
  };

  const selectOptions = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  // Add a default "Select" option if needed
  selectOptions.unshift({
    value: "",
    label: `Select ${label}`,
  });

  const selectedValue = selectOptions.find(
    (option) => option.value === watch(id)
  );

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        id={id}
        instanceId={id} // To avoid SSR issues with unique IDs
        options={selectOptions}
        placeholder={placeholder}
        value={selectedValue}
        onChange={handleChange}
        className={`react-select-container ${
          errors[id] ? "react-select--error" : ""
        }`}
        classNamePrefix="react-select"
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: errors[id] ? "#ef4444" : base.borderColor,
            "&:hover": {
              borderColor: errors[id] ? "#ef4444" : base.borderColor,
            },
            boxShadow: "none",
            minHeight: "40px",
          }),
        }}
      />
      {errors[id] && (
        <p className="text-red-500 text-xs mt-1">{errors[id].message}</p>
      )}
    </div>
  );
};
