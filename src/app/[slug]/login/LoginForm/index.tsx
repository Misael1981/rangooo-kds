"use client";

import { Loader2, User, Lock, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type FormEvent } from "react";
import { loginKds } from "@/app/actions/login-kds";
import { useRouter } from "next/navigation";
import DialogInfo from "@/components/DialogInfo";

type LoginFormProps = {
  slug: string;
};

const LoginForm = ({ slug }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAlertDialog, setIsAlertDialog] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !pin.trim()) {
      setError("Informe usuário e senha.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginKds(slug, { username, pin });

      if (!result.success) {
        setError(result.error);
        setIsAlertDialog(true);

        return;
      }

      router.push(`/${slug}`);
    } catch (err) {
      console.error(err);
      setError("Usuário ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-base font-semibold">
            Nome de Usuário
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              id="nome"
              type="text"
              placeholder="Ex: chef_joao"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10   rounded-lg border-zinc-300 focus-visible:ring-red-600" // h-14 = botão alto para tablets
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Campo Senha */}
        <div className="space-y-2">
          <Label htmlFor="senha" className="text-base font-semibold">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="pl-10 rounded-lg border-zinc-300 focus-visible:ring-red-600"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md text-center border border-red-200">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar no Sistema"
          )}
        </Button>
      </form>

      {isAlertDialog && (
        <DialogInfo
          isOpen={isAlertDialog}
          onOpenChange={setIsAlertDialog}
          message={error}
          title="Ops, algo deu errado!"
          icon={<TriangleAlert />}
          className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
        />
      )}
    </>
  );
};

export default LoginForm;
