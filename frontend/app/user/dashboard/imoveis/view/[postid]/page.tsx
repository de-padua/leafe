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
  AreaChartIcon,
  ArrowLeft,
  BadgeCentIcon,
  BadgeCheck,
  BadgeIcon,
  Bath,
  Bed,
  BedDouble,
  BedDoubleIcon,
  Camera,
  Car,
  CheckIcon,
  Eye,
  Grid2x2,
  Grid2X2,
  HousePlusIcon,
  ImageIcon,
  LandPlot,
  LucideSplinePointer,
  Mail,
  Pen,
  Share,
  Star,
  TrendingUp,
  Tv,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReactElement, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  IconArrowLeft,
  IconArrowLeftFromArc,
  IconPool,
  IconStairs,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardBody } from "@/components/custom/card-user-datas";
import EditGalery from "@/components/anuncio/edit-galery";
import GaleryWithThumbs from "@/components/anuncio/GaleryWithThumbs";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SizeIcon } from "@radix-ui/react-icons";
import { object, objectUtil, string } from "zod";
import { TreeItem } from "react-aria-components";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import MiniProfile from "@/components/ui/mini-profile/mini_profile";
import Minimap from "@/components/ui/dashboard/minimap/page";
import {
  useDashboardStore,
} from "@/lib/stores/dashboardStore";


export default function page() {
  const params = useParams<{ postid: string }>();
  const route = useRouter();

  const currentPostDashboardStore = useDashboardStore(
    (state) => state.currentPost
  );
  const setCurrentPostDashboardStore = useDashboardStore(
    (state) => state.set
  );

  const [expanded, setExpanded] = useState(false);
  const [hasDetailsState, setHasDetails] = useState(false);
  const [openGalery, setOpenGalery] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      try {
        if (currentPostDashboardStore !== null)
          return currentPostDashboardStore;

        const response = await fetch(
          `http://localhost:5000/dashboard/${params.postid}`,
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

        const data:{
          success:boolean,
          data:Imovel
        } = await response.json();

        setCurrentPostDashboardStore(data.data);
   
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

  const basicLabels: Record<string, string> = {
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
  };

  const structure: Record<string, string> = {
    concierge: "Portaria",
    backupGenerator: "Gerador de Energia",
    waterReservoir: "Reservatório de Água",
    serviceElevator: "Elevador de Serviço",
    coveredParking: "Estacionamento Coberto",
    visitorParking: "Vagas para Visitantes",
    carWash: "Lava-Rápido",
  };

  const lazer: Record<string, string> = {
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
  };

  const greenArea: Record<string, string> = {
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
  };

  const tec: Record<string, string> = {
    centralHeating: "Aquecimento Central",
    centralCooling: "Climatização Central",
    centralVacuum: "Aspirador Central",
    homeAutomation: "Automação Residencial",
    fiberInternet: "Internet Fibra Óptica",
    cableTvReady: "Preparado para TV a Cabo",
    soundSystem: "Sistema de Som",
    smartLighting: "Iluminação Inteligente",
    soundProofing: "Isolamento Acústico",
  };

  const security: Record<string, string> = {
    securityRoom: "Sala de Segurança",
    qrAccess: "Acesso por QR Code",
    facialRecognition: "Reconhecimento Facial",
    panicButton: "Botão de Pânico",
    automaticGate: "Portão Automático",
  };

  const services: Record<string, string> = {
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

  useEffect(() => {
    if (!data) return;

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    console.log(data);
    if (openGalery) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openGalery, data]);

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

  return (
    <div className="flex items-center justify-center w-full flex-col px-5 py-7 space-y-4">
      <div className="w-full flex items-center justify-between mb-10 p-0 h-fit">
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
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => {
              route.push("/user/dashboard/imoveis/list/q?page=1");
            }}
          >
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

      <div className="w-full flex items-start justify-between  ">
        <div className="w-2/3">
          <div className="">
            <h2 className="text-3xl">{data.title} </h2>
          </div>
          <p className="text-muted-foreground">
            {data.estate} - {data.city}, {data.street}, {data.CEP}
          </p>
        </div>
        <div className="text-end text-secondary-foreground">
          <h2 className=" text-3xl font-semibold">
            {formCurrency.format(data.price)}{" "}
          </h2>
          {data.built > 0 ? (
            <p className=" text-muted-foreground">
              {formCurrency.format(Math.floor(data.price / data.built))} / m²
            </p>
          ) : null}
        </div>
      </div>
      <div className="w-full flex items-center justify-center h-[600px]">
        <div className="grid grid-cols-6 grid-rows-4 w-full h-full gap-2 gap-x-7">
          {/* Main image - spans all rows */}
          <div
            className="col-span-4 row-span-4 relative cursor-pointer"
            onClick={handleOpenImageGaleryWithThumbs}
          >
            <Image
              src={data.imovelImages[0].imageUrl}
              fill
              className="object-cover rounded-md"
              alt="image from ad"
            />
          </div>

          {/* Right column - first image takes 2 rows */}
          <div
            className="col-span-2 row-span-2 relative   "
            onClick={handleOpenImageGaleryWithThumbs}
          >
            <div className="absolute w-full h-full z-20 bg-zinc-900/90 opacity-90 rounded-md flex items-center justify-center text-center">
              <div className="text-lg text-white text-center w-fit ">
                <div className="flex items-center justify-center">
                  <Camera />
                </div>
                <p className="font-semibold">Mostrar todas </p>
                <p className="text-sm"> {data.imovelImages.length} imagens</p>
              </div>
            </div>
            <Image
              src={data.imovelImages[1].imageUrl}
              fill
              className="object-cover blur-[2px] rounded-md"
              alt="image from ad"
            />
          </div>

          {/* Right column - second image takes 2 rows */}
          <div className="col-span-2 row-span-2 relative  flex items-center justify-center ">
            <div className="relative w-full h-full">
              <div className="absolute w-full h-full flex items-center justify-center">
                <Image
                  fill
                  src="/mapsvg.svg"
                  alt="map"
                  className="w-[40px] h-[40px]"
                />
              </div>
              {
                <div className="relative w-full flex items-center justify-center h-full  z-10 rounded-md ">
                  <iframe
                    src={url}
                    width="100%"
                    height="100%"
                    className="border-0 rounded-md h-full z-50 "
                  />
                </div>
              }
            </div>
          </div>
        </div>
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
          <GaleryWithThumbs
            images={data.imovelImages}
            handleCloseGalery={handleCloseGalery}
          />
        </div>
      )}

      <div className="grid grid-cols-6 w-full gap-x-7 space-y-4">
        <div className="col-span-4 w-full">
          <div className="w-full">
            <p
              className={`grayscale mb-1 ${expanded ? "" : ""}`}
              dangerouslySetInnerHTML={{ __html: data.description }}
            ></p>
            <div className="flex items-center justify-center w-full"></div>
          </div>
          <div className="flex items-start justify-start w-full h-full">
            <div className="w-full">
              <div className="w-full ">
                <Title>Detalhes da propiedade</Title>

                <div className="w-full grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
                  <div className="flex items-center justify-between border-b p-1 ">
                    <div className="flex items-center justify-start gap-x-1 text-muted-foreground">
                      <span>
                        <Grid2x2
                          size={19}
                          strokeWidth={1.5}
                          absoluteStrokeWidth
                        />
                      </span>
                      <p className="">Area total </p>
                    </div>
                    <p className="font-semibold">{data.built}/m²</p>
                  </div>

                  <div className="flex items-center justify-between border-b p-1 ">
                    <div className="flex items-center justify-start gap-x-1 text-muted-foreground">
                      <span>
                        <Car size={19} strokeWidth={1.5} absoluteStrokeWidth />
                      </span>
                      <p>Garagem</p>
                    </div>
                    <p className="font-semibold">{data.garage}</p>
                  </div>
                  <div className="flex items-center justify-between border-b p-1 ">
                    <div className="flex items-center justify-start gap-x-1 text-muted-foreground">
                      <span>
                        <Bath size={19} strokeWidth={1.5} absoluteStrokeWidth />
                      </span>
                      <p>Banheiro</p>
                    </div>
                    <p className="font-semibold">{data.bathrooms}</p>
                  </div>
                  <div className="flex items-center justify-between border-b p-1 ">
                    <div className="flex items-center justify-start gap-x-1 text-muted-foreground">
                      <span>
                        <BedDoubleIcon
                          size={19}
                          strokeWidth={1.5}
                          absoluteStrokeWidth
                        />
                      </span>
                      <p>Dormitórios</p>
                    </div>
                    <p className="font-semibold">{data.rooms} </p>
                  </div>
                  <div className="flex items-center justify-between border-b p-1 ">
                    <div className="flex items-center justify-start gap-x-1 text-muted-foreground">
                      <span>
                        <IconStairs size={19} strokeWidth={1.5} />
                      </span>
                      <p>{data.floors > 0 ? "Pisos" : "Piso"}</p>
                    </div>
                    <p className="font-semibold">
                      {data.floors === 0 ? "Térreo" : data.floors}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-b p-1 ">
                    <div className="flex items-center justify-start gap-x-1 text-muted-foreground">
                      <span>
                        <IconPool size={19} strokeWidth={1.5} />
                      </span>
                      <p>Piscina</p>
                    </div>
                    <p className="font-semibold">
                      {data.pool_size === 0 ? 1 : data.pool_size}/m²
                    </p>
                  </div>
                </div>
              </div>

              <div className=" w-full text-sm">
                <TrueLabels data={data} title={"Geral"} labels={basicLabels} />

                <TrueLabels data={data} title={"Segurança"} labels={security} />

                <TrueLabels data={data} title={"Serviços"} labels={services} />

                <TrueLabels data={data} title={"Tecnologia"} labels={tec} />

                <TrueLabels data={data} title={"Lazer"} labels={lazer} />

                <TrueLabels
                  data={data}
                  title={"Estrutura"}
                  labels={structure}
                />

                <TrueLabels data={data} title={"Verde"} labels={greenArea} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 w-full">
          <MiniProfile data={data.user} />
        </div>
      </div>
    </div>
  );
}



function Title({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="TitleSection"
      className={cn(
        "text-2xl font-semibold mb-3 mt-6 grayscale-100",
        className
      )}
      {...props}
    >
      <h2>{children}</h2>
    </div>
  );
}
function TrueLabels({
  data,
  labels,
  title,
}: {
  data: any;
  labels: Record<string, string>;
  title: string;
}) {
  const objects: string[] = [];
  Object.entries(labels).map((i) => {
    if (data[i[0]] === true) {
      objects.push(i[1]);
    }
  });

  return (
    <div className="">
      {objects.length > 0 && (
        <div className=" rounded-md my-7">
          <Title className=" border-b pb-2  text-zinc-800"> {title} </Title>
          <div className="w-full grid grid-cols-2 gap-2 text-muted-foreground ">
            {objects.map((i, index) => (
              <p className="flex items-center justify-start" key={index}>
                {i}{" "}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /*    <TrueLabels
  S
                    data={data}
                    title={"Segurança"}
                    labels={security}
                  />

                  <TrueLabels
                    data={data}
                    title={"Serviços"}
                    labels={services}
                  />

                  <TrueLabels data={data} title={"Tecnologia"} labels={tec} />

                  <TrueLabels data={data} title={"Lazer"} labels={lazer} />

                  <TrueLabels
                    data={data}
                    title={"Estrutura"}
                    labels={structure}
                  />

                  <TrueLabels data={data} title={"Verde"} labels={greenArea} /> */
}

const SimpleMapPlaceholder = ({
  width = "100%",
  height = "500px",
  color = "#B0B0B0",
}) => <div></div>;
