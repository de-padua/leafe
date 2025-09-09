"use client";
dotenv.config();
import * as dotenv from "dotenv";

import ProfileCard from "@/components/custom/profile-card";
import { Imovel, PropertyType, UserWithoutProperties } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import UserPosts from "@/components/custom/filtro-pesquisa";
import { useQuery } from "@tanstack/react-query";
import ProfileCardSkeleton from "@/components/custom/profile-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import NotFoundCustom from "@/components/custom/NotFound";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/lib/stores/currentUserStore";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  AlertCircle,
  Bath,
  CheckIcon,
  Eraser,
  EyeClosed,
  Pen,
} from "lucide-react";
import { Badge } from "../badge";
import { Button } from "../button";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea, ScrollBar } from "../scroll-area";
import { Breadcrumb } from "../breadcrumb";
import { object } from "zod";
export const description = "An area chart with gradient fill";

function Dashboard() {
  const filter = "desc";
  const price = "";

  const offset = 0;

  const params = useParams<{ id: string }>();

  const [currentPost, setCurrentPost] = useState<Imovel | null>(null);

  const getPublicUserData = async (): Promise<Imovel[]> => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/public/?userId=${params.id}&sort=${filter}&price=${price}&offset=${offset}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw error;
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      return data;
    } catch (err) {
      throw err;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicUserData"],
    queryFn: async () => {
      return getPublicUserData();
    },
  });

  const formCurrency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const handleSetCurrentPost = (post: Imovel | null) => {
    if (!post) setCurrentPost(null);

    setCurrentPost(post);
  };

  if (isLoading) return <div></div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data)
    return (
      <div>
        <NotFoundCustom />
      </div>
    );

  return (
    <div className="">
      <div className="flex items-center justify-center w-full ">
        {currentPost && (
          <Drawer
            open={!!currentPost}
            onOpenChange={(open) => {
              if (!open) {
                setCurrentPost(null); // fecha limpando o estado
              }
            }}
          >
            <DrawerContent className="h-full">
              <DrawerHeader>
                <DrawerTitle>Visualização de post</DrawerTitle>
                <DrawerDescription>
                  Detalhes completos do anúncio selecionado.
                </DrawerDescription>
              </DrawerHeader>
              <CurrentPost imovel={currentPost} />
            </DrawerContent>
          </Drawer>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[130px] "></TableHead>
            <TableHead>Titulo</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Status</TableHead>

            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((post) => (
            <TableRow
              key={post.id}
              onClick={() => {
                handleSetCurrentPost(post);
              }}
            >
              <TableCell className="">
                <Image
                  src={post.imovelImages[0].imageUrl}
                  width={200}
                  height={200}
                  className=" h-15 object-cover rounded-xs"
                  alt={post.title}
                />
              </TableCell>

              <TableCell className=" max-w-[120px] truncate ">
                {post.title}
              </TableCell>
              <TableCell>{formCurrency.format(post.price)}</TableCell>
              <TableCell>
                {post.type.toString() === "HOUSE" ? "Casa" : null}
                {post.type.toString() === "AP" ? "Apartamento" : null}
                {post.type.toString() === "LAND" ? "Terreno" : null}
              </TableCell>
              <TableCell>
                {post.city},{post.estate}
              </TableCell>
              <TableCell>
                {post.isActive ? (
                  <Badge variant={"secondary"}>Ativo</Badge>
                ) : (
                  <Badge variant={"destructive"}>Oculto</Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      className="size-8"
                    >
                      <DotsHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Edição</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {" "}
                      <Pen /> Editar{" "}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {" "}
                      <EyeClosed /> Deixar invisivel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant="destructive">
                      <AlertCircle /> Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Dashboard;

type CurrentPostProps = {
  imovel: Imovel;
};

const CurrentPost = ({ imovel }: CurrentPostProps) => {
  const chartConfig = {
    views: {
      label: "Impressões",
      color: "#6CA6C1",
    },
  } satisfies ChartConfig;

  const favoritesConfig = {
    favorites: {
      label: "Favoritado",
      color: "#846267",
    },
  } satisfies ChartConfig;

  const chartData = [
    { month: "Janeiro", views: 0 },
    { month: "Feveriro", views: 3 },
    { month: "Março", views: 4 },
    { month: "Abril", views: 42 },
    { month: "Maio", views: 4 },
    { month: "Junho", views: 39 },
    { month: "Julho", views: 32 },
    { month: "Agosto", views: 23 },
    { month: "Setembro", views: 34 },
  ];
  const favorites = [
    { month: "Janeiro", favorites: 56 },
    { month: "Feveriro", favorites: 3 },
    { month: "Março", favorites: 2 },
    { month: "Abril", favorites: 21 },
    { month: "Maio", favorites: 12 },
    { month: "Junho", favorites: 2 },
    { month: "Julho", favorites: 4 },
    { month: "Agosto", favorites: 23 },
    { month: "Setembro", favorites: 34 },
  ];

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

  return (
    <div className="w-full h-full px-15 ">
      <ScrollArea className="h-full">
        <ScrollBar />
        <div className="grid grid-cols-6 gap-2">
          <Card className="shadow-none justify-between">
            <CardHeader>
              <CardTitle>Impressões </CardTitle>
              <CardDescription className="h-full">
                Mostrando o total de visitas nesse anúncio até o momento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-views)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-views)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="1" y1="0" x2="2" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-views)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-views)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="views"
                    type="bump"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-views)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="justify-between shadow-none">
            <CardHeader>
              <CardTitle>Favoritado </CardTitle>
              <CardDescription className="">
                Quantidade de usuários que adicionaram este imóvel à lista de
                favoritos{" "}
              </CardDescription>
            </CardHeader>
            <CardContent className="  ">
              <ChartContainer config={favoritesConfig} className="h-fit">
                <AreaChart
                  accessibilityLayer
                  data={favorites}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-favorites)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-favorites)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="favorites" x1="1" y1="0" x2="2" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-favorites)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-favorites)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="favorites"
                    type="bump"
                    fill="url(#favorites)"
                    fillOpacity={0.4}
                    stroke="var(--color-favorites)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2">
          <div>
            <h1 className="scroll-m-20 text-start text-4xl font-extrabold tracking-tight text-balance my-3">
              {imovel.title}
            </h1>
            <p className="scroll-m-20 text-start text-2xl font-bold tracking-tight text-balance my-5">
              {formCurrency.format(imovel.price)}
            </p>
            {imovel.gatedCommunity_price && (
              <div>
                <p>Condomínio</p>
                <p className=" text-start text-2xl font-bold tracking-tight text-balance my-5">
                  {formCurrency.format(imovel.gatedCommunity_price)}
                </p>
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: imovel.description }}></div>{" "}
            <div className=" w-full bg-white rounded-xl  p-6">
              <div>
                <h1 className="text-2xl font-bold  mb-3 flex items-center">
                  <i className="  mr-2"></i>
                  Detalhes do imóvel
                </h1>

                <div className="flex flex-wrap gap-2 my-2 p-2">
                  <div className="flex flex-wrap items-center ">
                    {Object.keys(imovel).map((key) => {
                      const value = (imovel as any)[key];
                      if (typeof value !== "boolean" || !value) return null;

                      if (key === "isFinan" || key === "isActive") return;
                      return (
                        <div key={key} className="text-xs px-2 py-2 w-fit">
                          <Badge variant={"outline"}>
                            <CheckIcon /> {featureLabels[key] ?? key}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>{" "}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold  mb-3 flex items-center">
                  <i className="  mr-2"></i>
                  Opções de Financiamento do Imóvel
                </h1>

                <div className="flex flex-wrap gap-2 my-2">
                  {imovel.financeBanks.length > 0 &&
                    imovel.financeBanks.map((i) => (
                      <div key={i} className="text-xs px-2 py-2">
                        {i}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Carousel className="col-span-4 mx-3 p-0 ">
              <CarouselContent className="h-full">
                {imovel.imovelImages.map((i) => {
                  return (
                    <CarouselItem
                      className="md:basis-1/2 lg:basis-1/3  "
                      key={i.id}
                    >
                      <Image
                        src={i.imageUrl}
                        width={600}
                        height={600}
                        alt={i.imovelId}
                        className="aspect-square h-full object-cover rounded-md"
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        <p className="h-[300px]"></p>
      </ScrollArea>
    </div>
  );
};
