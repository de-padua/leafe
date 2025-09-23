"use client";

import { Imovel } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconArrowLeft, IconArrowLeftFromArc } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
export default function page() {
  const params = useParams<{ postid: string }>();
  const [hasDetailsState, setHasDetails] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      try {
        const response = await fetch(`http://localhost:5000/dashboard`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: params.postid }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw error;
          }
          const errorData = await response.json().catch(() => null);

          throw new Error(
            errorData?.message || `HTTP error! status: ${response.status}`
          );
        }

        const data: Imovel = await response.json();

        return data;
      } catch (err) {
        throw err;
      }
    },
  });
  const formCurrency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const featureLabels: Record<string, string> = {
    // 🏠 Básico
    furnished: "Mobiliado",
    pool: "Piscina",
    gym: "Academia",
    security: "Segurança",
    elevator: "Elevador",
    accessible: "Acessibilidade",
    balcony: "Sacada",
    garden: "Jardim",
    barbecueArea: "Área de Churrasco",
    solarEnergy: "Energia Solar",
    library: "Biblioteca",
    wineCellar: "Adega",
    airConditioning: "Ar-Condicionado",
    smartHome: "Casa Inteligente",
    laundryRoom: "Lavanderia",
    gatedCommunity: "Condomínio Fechado",
    alarmSystem: "Sistema de Alarme",
    surveillanceCameras: "Câmeras de Vigilância",
    fingerprintAccess: "Acesso por Digital",
    solarPanels: "Painéis Solares",
    chargingStation: "Estação de Recarga",
    partyRoom: "Salão de Festas",
    guestParking: "Estacionamento para Visitantes",
    petArea: "Espaço Pet",
    bikeRack: "Bicicletário",
    coWorkingSpace: "Espaço de Coworking",
    petFriendly: "Pet Friendly",

    // 🏢 Estrutura
    concierge: "Portaria",
    backupGenerator: "Gerador de Energia",
    waterReservoir: "Reservatório de Água",
    serviceElevator: "Elevador de Serviço",
    coveredParking: "Estacionamento Coberto",
    visitorParking: "Vagas para Visitantes",
    carWash: "Lava-Rápido",

    // 🏊‍♂️ Lazer e esportes
    sportsCourt: "Quadra Poliesportiva",
    tennisCourt: "Quadra de Tênis",
    squashCourt: "Quadra de Squash",
    soccerField: "Campo de Futebol",
    skatePark: "Pista de Skate",
    runningTrack: "Pista de Corrida",
    playground: "Playground",
    kidsRoom: "Brinquedoteca",
    gameRoom: "Sala de Jogos",
    cinemaRoom: "Cinema",
    musicStudio: "Estúdio de Música",
    spa: "Spa",
    sauna: "Sauna",
    jacuzzi: "Jacuzzi",
    heatedPool: "Piscina Aquecida",
    indoorPool: "Piscina Coberta",
    kidsPool: "Piscina Infantil",

    // 🌳 Áreas verdes e sociais
    communityGarden: "Horta Comunitária",
    orchard: "Pomar",
    meditationSpace: "Espaço de Meditação",
    hammockArea: "Redário",
    gourmetBarbecue: "Churrasqueira Gourmet",
    pizzaOven: "Forno de Pizza",
    firePit: "Fogueira",
    outdoorLounge: "Lounge Externo",
    panoramicDeck: "Deck Panorâmico",
    rooftop: "Rooftop",

    // 🛠️ Conforto e tecnologia
    centralHeating: "Aquecimento Central",
    centralCooling: "Climatização Central",
    centralVacuum: "Aspirador Central",
    homeAutomation: "Automação Residencial",
    fiberInternet: "Internet Fibra Óptica",
    cableTvReady: "Preparado para TV a Cabo",
    soundSystem: "Sistema de Som",
    smartLighting: "Iluminação Inteligente",
    soundProofing: "Isolamento Acústico",

    // 🛡️ Segurança extra
    securityRoom: "Sala de Segurança",
    qrAccess: "Acesso por QR Code",
    facialRecognition: "Reconhecimento Facial",
    panicButton: "Botão de Pânico",
    automaticGate: "Portão Automático",

    // 🛎️ Serviços e conveniência
    housekeeping: "Serviço de Limpeza",
    laundryService: "Serviço de Lavanderia",
    coffeeShop: "Cafeteria",
    miniMarket: "Mini Mercado",
    privateOffices: "Escritórios Privativos",
    deliveryRoom: "Sala de Entregas",
    petCare: "Pet Care",
    carSharing: "Car Sharing",
    bikeSharing: "Bike Sharing",
    driverLounge: "Lounge de Motoristas",
  };
  if (isLoading) return <div></div>;
  if (isError) return <div></div>;
  if (data === undefined) return <div></div>;

  const endereco = `${data.log}, ${data.street}, ${data.estate}, Brasil`;

  const url = `https://maps.google.com/maps?q=${encodeURIComponent(
    endereco
  )}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;

  const details = Object.keys(data).filter(
    (key) =>
      typeof (data as any)[key] === "boolean" &&
      (data as any)[key] &&
      key !== "isFinan" &&
      key !== "isActive"
  );
  const hasDetails = details.length > 0;
  return (
    <div className="flex items-center justify-center w-full flex-col px-5 py-7 space-y-4">
      <div className="w-full flex items-center justify-between">
       <div className="flex items-center justify-between gap-x-2">
         <Button size={"icon"} ><IconArrowLeft /></Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/user/dashboard/imoveis/list/q?page=1">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/user/dashboard/imoveis/list/q?page=1">
                Imóveis
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Visualização</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
       </div>

        <div>
          {data.isActive ? (
            <Badge variant="outline" className="gap-1.5 text-emerald-600">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              ></span>
              Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-emerald-600">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              ></span>
              Ativo
            </Badge>
          )}
        </div>
      </div>
      <div className="w-full flex items-center justify-between ">
        <div>
          <h2 className="text-3xl font-semibold grayscale">{data.title} </h2>
          <p className="text-sm">
            {data.estate} - {data.city} , {data.street} {data.CEP}
          </p>
        </div>
        <div className="grayscale">
          <h2 className="text-3xl font-semibold ">
            {formCurrency.format(data.price)}{" "}
          </h2>
          <p className="text-sm">
            {formCurrency.format(Math.round(data.price / data.built))} por metro
            quadrado{" "}
          </p>
        </div>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full "
      >
        <CarouselContent>
          {data.imovelImages.map((image, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 h-[400px]"
            >
              <div className="h-full flex items-center justify-center  ">
                <Image
                  src={image.imageUrl}
                  width={1000}
                  height={1000}
                  alt="imagem"
                  className="h-full object-cover rounded-md"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="">
        <h2 className="text-2xl font-semibold">Descrição</h2>
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></p>
      </div>

      <div className=" w-full">
        <h2 className="text-2xl font-semibold">Detalhes</h2>

        <div className="grid grid-cols-4 text-muted-foreground text-sm">
          <p>Quartos : {data.rooms}</p>
          <p>Banheiros : {data.bathrooms}</p>
          <p>Banheiros : {data.garage}</p>
          <p>Pisos : {data.floors === 0 ? "Terreo" : data.floors}</p>
        </div>
        <Separator className="my-2" />
        <div>
          {hasDetails && (
            <div>
              <p className="font-semibold mb-2">Mais detalhes</p>
              <div className="grid grid-cols-4 w-full gap-y-1">
                {details.map((key) => (
                  <p
                    key={key}
                    className="text-muted-foreground text-sm flex items-center justify-start gap-x-2"
                  >
                    {featureLabels[key] ?? key}{" "}
                    <CheckIcon width={10} height={10} />{" "}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" w-full">
        <h2 className="text-2xl font-semibold">
          Opções de Financiamento do Imóvel
        </h2>
        {data.financeBanks.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 gap-2 w-fit">
              {data.financeBanks.map((i) => (
                <div key={i} className="text-xs px-2 py-2 w-fit">
                  {i}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Sem opção de financiamento.
          </p>
        )}
      </div>
    </div>
  );
}
