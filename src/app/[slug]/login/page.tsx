import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./LoginForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="page-bg">
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md shadow-xl border-t-8 border-t-red-600 bg-white gap-2">
          <CardHeader className="space-y-2 flex flex-col items-center ">
            <div className="relative w-40 h-40 ">
              <Image
                src="/logo-rangooo.png"
                alt="Rangoo Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold text-zinc-900">
                Acesso ao KDS
              </CardTitle>
              <CardDescription className="text-base text-zinc-500">
                Entre com suas credenciais da cozinha
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="my-2">
            <LoginForm slug={slug} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-zinc-400">
              Rangoo © {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
