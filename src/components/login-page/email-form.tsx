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

  return (
    <form onSubmit={handleEmailLogin} className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium text-foreground mb-1.5"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Email
        </label>
        <Input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-foreground mb-1.5"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Senha
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full mt-6">
        Entrar
      </Button>
    </form>
  );
};
