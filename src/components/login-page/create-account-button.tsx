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
      <button className="text-accent hover:underline">Criar conta</button>
    </p>
  );
};