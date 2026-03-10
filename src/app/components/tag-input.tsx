import React, { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

type TagInputProps = {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  validate?: (value: string) => { isValid: boolean; errorMessage?: string };
  inputType?: string;
};

const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = "Add item...",
  validate,
  inputType = "text",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setIsError(true);
      setErrorMessage("Value cannot be empty");
      return;
    }

    if (value.includes(trimmedValue)) {
      setIsError(true);
      setErrorMessage("This value already exists");
      return;
    }

    if (validate) {
      const { isValid, errorMessage: validationError } = validate(trimmedValue);
      if (!isValid) {
        setIsError(true);
        setErrorMessage(validationError || "Invalid value");
        return;
      }
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
    setIsError(false);
    setErrorMessage(undefined);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, idx) => (
            <Badge
              key={`${item}-${idx}`}
              variant="secondary"
              className="h-7 gap-1.5 pr-1.5 pl-2.5 text-xs"
            >
              {item}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => handleRemove(idx)}
                className="hover:bg-destructive/20 hover:text-destructive size-5 rounded-full p-0"
              >
                <XIcon className="size-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <InputGroup className="max-w-sm">
          <InputGroupInput
            type={inputType}
            placeholder={placeholder}
            value={inputValue}
            aria-invalid={isError}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (isError) {
                setIsError(false);
                setErrorMessage(undefined);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleAdd();
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={handleAdd}
              size="icon-xs"
              type="button"
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <PlusIcon className="size-3.5" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {isError && errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default TagInput;
