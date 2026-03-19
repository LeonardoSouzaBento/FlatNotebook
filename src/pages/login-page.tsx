import {
  CreateAccountButton,
  EmailForm,
  GoogleButton,
  Brand,
} from "@/components/login-page";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <Brand />
        <GoogleButton />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span
              className="bg-background px-3 text-muted-foreground"
              style={{ fontSize: "var(--text-sm)" }}
            >
              ou
            </span>
          </div>
        </div>
        <EmailForm />
        <CreateAccountButton handleCreateAccount={handleCreateAccount} />
      </div>
    </div>
  );
};

export default LoginPage;
