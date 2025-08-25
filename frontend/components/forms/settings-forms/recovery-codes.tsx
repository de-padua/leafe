"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CopyIcon, DownloadIcon, Eye } from "lucide-react";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { recoveryCode, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "@/lib/stores/currentUserStore";

function RecoveryCodes({ userData }: { userData: User }) {
  const [viewCodes, setViewCodes] = useState(false);
  const [codes, setCodes] = useState<recoveryCode[]>([
    {
      id: uuidv4({}, undefined, 10),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
    {
      id: uuidv4().substring(0, 8),
      userId: "id",
      code: uuidv4().substring(0, 8),
      isUsed: false,
    },
  ]);

  const handleSetCodeAndView = (recoveryCodes: recoveryCode[]) => {
    setCodes(recoveryCodes);
    setViewCodes(true);
  };

  const handleCreateNewCodes = (recoveryCodes: recoveryCode[]) => {
    setViewCodes(false);
    setCodes(recoveryCodes)
  };

  return (
    <div className="p-4  bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-col">
      {userData.metadata.recoveryCodesGenerated ? (
        <div className="w-full flex items-center justify-center flex-col">
          <div className="py-2 text-center">
            <h2 className="text-xs text-gray-600">Códigos de segurança</h2>
            <p className="text-xs text-gray-400">
              Esses códigos são sua última proteção contra o bloqueio da sua
              conta, guarde em local seguro e nunca compartilhe com ninguém.
            </p>
          </div>
          <ViewCodes
            codes={codes}
            viewCodes={viewCodes}
            handleSetCodeAndView={handleSetCodeAndView}
          />
          <div className="flex items-center justify-center w-full gap-x-2">
            <GenerateNewCodes handleCreateNewCodes={handleCreateNewCodes} />
            <DownloadCodes  codes={codes}/>
            
          </div>
        </div>
      ) : (
        <GenerateCodes />
      )}
    </div>
  );
}

const ViewCodes = ({
  codes,
  viewCodes,
  handleSetCodeAndView,
}: {
  codes: recoveryCode[];
  viewCodes: boolean;
  handleSetCodeAndView: (recoveryCodes: recoveryCode[]) => void;
}) => {
  const handleGetCodes = async () => {
    const response = await fetch(
      `http://localhost:5000/users/recovery-codes/access`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
    }

    handleSetCodeAndView(data);
  };

  return (
    <div className="w-full flex items-center justify-center p-2 relative ">
      <div className={viewCodes ? "invisible absolute " : "absolute z-10 "}>
        <Button className="cursor-pointer" onClick={handleGetCodes}>
          <Eye />
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-2 gap-x-5  py-5">
        {codes.map((i) => (
          <p
            className={viewCodes ? "text-xs " : " text-xs blur-[2px] "}
            key={i.id}
          >
            {i.code}
          </p>
        ))}
      </div>
    </div>
  );
};

const GenerateCodes = () => {
  const { set } = useUserStore();

  const queryClient = useQueryClient();

  async function generateCodes() {
    const response = await fetch(
      `http://localhost:5000/users/recovery-codes/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    queryClient.setQueryData(["userData"], data);
    set(data);
  }
  return (
    <div className="w-full my-2 flex items-center justify-center flex-col space-y-2">
      <p className="text-xs">Você ainda não gerou códigos de segurança</p>
      <Button
        variant={"outline"}
        className="text-xs"
        size={"sm"}
        onClick={generateCodes}
      >
        Clique aqui para gerar códigos
      </Button>
    </div>
  );
};

const GenerateNewCodes = ({
  handleCreateNewCodes,
}: {
  handleCreateNewCodes: (codes:recoveryCode[]) => void;
}) => {
  const { set } = useUserStore();

  const queryClient = useQueryClient();
  async function generateCodes() {
    const response = await fetch(
      `http://localhost:5000/users/recovery-codes/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    handleCreateNewCodes(data.codes);
  }
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="text-xs" size={"sm"}>
            Gerar códigos novos
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza dessa ação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta operação substituirá permanentemente todos os códigos
              existentes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex items-center justify-between">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={generateCodes}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DownloadCodes = ({codes}:{codes:recoveryCode[]}) => {



const onlyNumbers = codes.map(i => i.code);

const downloadCodesInTxtFormat = () => {
  const header = 
    "Esses são seus códigos de usuário\n" +
    "Esses códigos são sua última proteção contra o bloqueio da sua conta, guarde em local seguro e nunca compartilhe com ninguém.\n\n";

  const codesText = onlyNumbers.join('\n'); 

  const fullText = header + codesText;

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(fullText)
  );
  element.setAttribute("download", "user_codes.txt");

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  };
  return (
    <Button onClick={downloadCodesInTxtFormat}  className="text-xs" size={"sm"} >
      <DownloadIcon type="download"/>
    </Button>
  );
};
export default RecoveryCodes;
