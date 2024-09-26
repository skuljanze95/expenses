import { useState } from "react";

export const useHelpers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return {
    isLoading,
    isOpen,
    setIsLoading,
    setIsOpen,
  };
};
