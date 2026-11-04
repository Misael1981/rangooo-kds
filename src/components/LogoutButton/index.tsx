"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutKds } from "@/app/actions/logout-kds";

interface LogoutButtonProps {
  slug: string;
}

export function LogoutButton({ slug }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutKds(slug);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-colors"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <LogOut className="h-4 w-4 mr-2" />
      )}
      Sair do Terminal
    </Button>
  );
}
