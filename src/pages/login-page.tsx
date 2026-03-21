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
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl">
        <Logo className="items-center gap-3 mx-auto mb-10" >
          <LogoLink to="/login" className="text-h1-hero mr-1">
            <LogoIcon strokeWidth="medium" />
            <LogoTitle />
          </LogoLink>
          <LogoDescription className="text-center text-sm">
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
