import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

function NotFoundCustom() {
  return (
    <div className="mx-auto p-6 text-center h-screen flex items-center justify-center flex-col">
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>

      <p className="text-gray-600 mb-6">
        O conteúdo que você está procurando não existe ou foi movido.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-left mb-6 max-w-md">
        <p className="mb-2">
          • Verifique se o endereço está digitado corretamente
        </p>
        <p className="mb-2">
          • A página pode ter sido removida temporariamente
        </p>
        <p>• Você pode voltar à página inicial ou fazer uma busca</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <Link href="/">Página Inicial</Link>
        </Button>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Código de erro: 404 - Página não encontada
      </p>
    </div>
  );
}

export default NotFoundCustom;
