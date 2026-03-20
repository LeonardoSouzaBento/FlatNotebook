import {
  Logo,
  LogoDescription,
  LogoIcon,
  LogoLink,
  LogoTitle,
} from "@/components/common";
import {
  CreateAccountButton,
  EmailForm,
  GoogleButton,
  Separator,
} from "@/components/login-page";
import { Icon } from "@/ui";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <Logo>
          <LogoLink to="/login">
            <LogoIcon />
            <LogoTitle />
          </LogoLink>
          <LogoDescription>
            Documentos organizados, pensamento estruturado
          </LogoDescription>
        </Logo>
        <GoogleButton />
        <Separator />
        <EmailForm />
        <CreateAccountButton handleCreateAccount={handleCreateAccount} />
      </div>
    </div>
  );
};

export default LoginPage;
