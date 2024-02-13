import React from "react";

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm mx-auto my-8 p-4 border rounded"
    >
      {children}
    </form>
  );
};
