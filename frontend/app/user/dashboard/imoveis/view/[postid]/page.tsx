"use client";

import { Imovel } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Bath,
  Bed,
  Car,
  CheckIcon,
  Eye,
  HousePlusIcon,
  ImageIcon,
  Mail,
  Pen,
  Share,
  Star,
  TrendingUp,
  Tv,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardBody } from "@/components/custom/card-user-datas";
import { useCacheStorage } from "@/lib/stores/userPostsCache";
import EditGalery from "@/components/anuncio/edit-galery";
import GaleryWithThumbs from "@/components/anuncio/GaleryWithThumbs";
export default function page() {
  const params = useParams<{ postid: string }>();
  const route = useRouter();
  const setPost = useCacheStorage((state) => state.add);
  const [hasDetailsState, setHasDetails] = useState(false);
  const [openGalery, setOpenGalery] = useState<boolean>(false);

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

        setPost(data);

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

  const handleOpenImageGaleryWithThumbs = () => {
    setOpenGalery(true);
  };
  
  const handleCloseGalery = () => {
    setOpenGalery(false);
  };
  
  useEffect(() => {
    if (openGalery) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openGalery]);

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
  )}&t=&z=12&ie=UTF8&iwloc=B&output=embed`;

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
        <div className="flex items-center justify-center gap-x-2">
          <Button size={"icon"} variant={"outline"}>
            <IconArrowLeft />
          </Button>
          <Button
            className="gap-x-1"
            size={"sm"}
            onClick={() => {
              route.push("/user/dashboard/edit/" + data.postId);
            }}
          >
            Editar <Pen />
          </Button>
        </div>
      </div>
      <div className="w-full"></div>

      <div className="w-full my-3 mb-7">
        <div className="w-full my-2">
          <h2 className="text-2xl font-semibold">Métricas</h2>
        </div>

        <div className="w-full grid grid-cols-4  gap-4">
          <div className=" p-4 rounded-md border  h-fit space-y-2 text-muted-foreground">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className=""> Visualizações</p>
              <Eye width={15} height={15} />
            </div>
            <div>
              <div className="flex items-center justify-start gap-x-1">
                <p className="font-semibold">134</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Vezes em que usuários viram esse anúncio
              </p>
            </div>
          </div>
          <div className=" p-4 rounded-md border  h-fit space-y-2 text-muted-foreground">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className=" "> Favoritados</p>
              <Star width={15} height={15} />
            </div>
            <div>
              <div className="flex items-center justify-start gap-x-1">
                <p className="font-semibold">1304</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Vezes em que usuários salvaram esse anúncio
              </p>
            </div>
          </div>
          <div className=" p-4 rounded-md border  h-fit space-y-2 text-muted-foreground">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className=" "> Mensagens </p>
              <Mail width={15} height={15} />
            </div>
            <div>
              <div className="flex items-center justify-start gap-x-1">
                <p className="font-semibold">345</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Vezes em que usuários mandaram mensagem
              </p>
            </div>
          </div>
          <div className=" p-4 rounded-md border  h-fit space-y-2 text-muted-foreground">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className=" "> Compartilhamentos </p>
              <Share width={15} height={15} />
            </div>
            <div>
              <div className="flex items-center justify-start gap-x-1">
                <p className="font-semibold">48</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Vezes em que o anúncio foi compartilhado
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-start justify-between ">
        <div className="w-2/3">
          <div className="flex items-center justify-start w-full  ">
            <h2 className="text-3xl font-semibold grayscale w-full ">
              {data.title}{" "}
            </h2>
          </div>
          <p className="text-sm mb-2 text-muted-foreground">
            {data.estate} - {data.city} , {data.street} - {data.CEP}
          </p>
        </div>
        <div className="grayscale">
          <h2 className="text-3xl font-semibold ">
            {formCurrency.format(data.price)}{" "}
          </h2>
          {data.built > 0 ? (
            <p className="text-sm">
              {" "}
              {formCurrency.format(Math.floor(data.price / data.built))} / m²
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2  w-full  ">
        <div
          className=" flex items-start justify-start col-span-2 gap-x-2 h-[400px]  "
          onClick={() => {
            handleOpenImageGaleryWithThumbs();
          }}
        >
          <div className="flex items-center justify-center border rounded-md w-full h-full ">
            <Image
              src={data.imovelImages[0].imageUrl}
              width={400}
              height={400}
              alt="imagem"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 gap-y-2   w-1/6 rounded-md h-[400px] ">
            {data.imovelImages.map((image, index) => {
              return index > 1 ? null : (
                <div
                  className="w-full flex items-center justify-center aspect-square border rounded-md  h-full"
                  key={image.id}
                >
                  {" "}
                  <Image
                    src={image.imageUrl}
                    width={400}
                    height={400}
                    alt="imagem"
                    className="h-full object-cover rounded-md"
                  />
                </div>
              );
            })}
          </div>
        </div>
        {url && (
          <div className="relative w-full h-full">
            <iframe
              src={url}
              width="100%"
              height="100%"
              className="border-0 rounded-md "
              loading="lazy"
            />
          </div>
        )}
      </div>
      {openGalery && (
        <div className="h-fit">
          <div className="">
            <Button
              variant={"outline"}
              className={"cursor-pointer z-40"}
              size={"icon"}
              onClick={() => {
                setOpenGalery(false);
              }}
            >
              <ArrowLeft />
            </Button>
          </div>
          <GaleryWithThumbs images={data.imovelImages} handleCloseGalery={handleCloseGalery} />
        </div>
      )}
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-3 mt-6">Descrição</h2>
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></p>
      </div>

      <div className="flex items-start justify-between w-full h-full">
        <div className="w-2/3">
          <div className="w-full">
            <h2 className="text-2xl font-semibold my-4">Características</h2>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Área construída: {data.built} m²</p>
              <p>Área total do terreno: {data.area} m²</p>
            </div>

            <h3 className="text-xl font-medium mt-6 mb-2">
              Detalhes do imóvel
            </h3>

            <div className="  grid grid-cols-6  gap-2 text-sm text-muted-foreground">
              <p className="flex items-center justify-start gap-x-1 w-fit">
                {data.bedrooms}{" "}
                {data.bedrooms > 1 ? "Dormitórios" : "Dormitório"}{" "}
                <Bed width={15} height={15} />
              </p>
              <p className="flex items-center justify-start gap-x-1 w-fit">
                {data.garage} Vagas <Car width={15} height={15} />{" "}
              </p>
              <p className="flex items-center justify-start gap-x-1 w-fit">
                {data.bathrooms} Banheiros <Bath width={15} height={15} />{" "}
              </p>
              <p className="flex items-center justify-start gap-x-1 w-fit">
                {data.rooms} Salas <Tv width={15} height={15} />
              </p>
              {data.gatedCommunity && (
                <p className="flex items-center justify-start gap-x-1 w-fit">
                  Condomínio <HousePlusIcon width={15} height={15} />{" "}
                </p>
              )}
            </div>
          </div>

          <div className=" w-full">
            <h2 className="text-2xl font-semibold mb-3 mt-6">
              Características Adicionais
            </h2>

            <div>
              {hasDetails && (
                <div>
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
            <div className=" w-full">
              <h2 className="text-2xl font-semibold mb-3 mt-6">
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
        </div>
      </div>
    </div>
  );
}
