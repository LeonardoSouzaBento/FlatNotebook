import { Button, Input } from "@/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const inputs = [
    {
      label: "Email",
      type: "email",
      placeholder: "seu@email.com",
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value),
    },
    {
      label: "Senha",
      type: "password",
      placeholder: "••••••••",
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
    },
  ];

  return (
    <form onSubmit={handleEmailLogin} className="space-y-4">
      {inputs.map((input, index) => (
        <div key={index}>
          <label
            className="block text-sm font-medium text-foreground mb-1.5"
            style={{ fontSize: "var(--text-sm)" }}
          >
            {input.label}
          </label>

          <Input
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            onChange={input.onChange}
          />
        </div>
      ))}

      <Button type="submit" className="w-full mt-6">
        Entrar
      </Button>
    </form>
  );
};