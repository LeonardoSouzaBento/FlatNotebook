interface Props {
  handleCreateAccount: () => void;
}

export const CreateAccountButton = ({ handleCreateAccount }: Props) => {
  return (
    <p
      className="text-center text-muted-foreground"
      style={{ fontSize: "var(--text-xs)" }}
    >
      Não tem conta?{" "}
      <button className="text-primary-800 underline underline-offset-2 decoration-[1.5px]">
        Criar conta
      </button>
    </p>
  );
};
