// app/(auth)/account-deleted/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Conta Excluída',
  robots: 'noindex, nofollow'
};

export default function AccountDeletedPage() {
  return (
    <div className=" mx-auto p-6 text-center h-screen flex items-center justify-center flex-col">
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">Conta Excluída com Sucesso</h1>
      
      <p className="text-gray-600 mb-6">
        Sua conta e todos os dados associados foram <strong>permanentemente removidos</strong>. 
        Sentiremos sua falta, mas você será sempre bem-vindo(a) de volta!
      </p>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-left mb-6">
        <p className="mb-2">• Alguns dados (como registros de segurança) podem ser mantidos conforme exigido por lei</p>
        <p>• Recomendamos limpar cookies e cache do navegador</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <Link href="/">Página Inicial</Link>
        </Button>
        <Button asChild>
          <Link href="/singup">Criar Nova Conta</Link>
        </Button>
      </div>

    
    </div>
  );
}