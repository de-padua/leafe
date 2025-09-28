"use client";
import Galery from "@/components/anuncio/galery";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building,
  CheckCircle,
  CircleCheck,
  CpuIcon,
  DollarSignIcon,
  House,
  HousePlug,
  ImageIcon,
  InfoIcon,
  LoaderIcon,
  LoaderPinwheel,
  Shield,
  Theater,
  TreePalmIcon,
} from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  Label,
  Tree,
} from "react-aria-components";

import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

import dynamic from "next/dynamic";

import * as RadioGroup_1 from "@radix-ui/react-radio-group";

import { SizeIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { FileWithPreview, useFileUpload } from "@/hooks/use-file-upload";
import { Checkbox } from "@/components/ui/checkbox";
import CheckboxCardDemo from "@/components/customized/checkbox/checkbox-11";
import { fi } from "zod/v4/locales";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

const useMap = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMap),
  { ssr: false }
);

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams, useSearchParams } from "next/navigation";
import { useCacheStorage } from "@/lib/stores/userPostsCache";
import { Imovel } from "@/types";
import { Value } from "@radix-ui/react-select";
import EditGalery from "@/components/anuncio/edit-galery";

const formSchema = z
  .object({
    title: z
      .string()
      .min(5, { message: "O título precisa ter no mínimo 5 caracteres" })
      .max(200, { message: "O título pode ter no máximo 200 caracteres" }),
    description: z
      .string()
      .min(10, { message: "A descrição precisa ter no mínimo 10 caracteres" })
      .max(5000, { message: "A descrição pode ter no máximo 5000 caracteres" }),
    log: z.string().min(5, {
      message: "O logradouro precisa ter no mínimo 5 caracteres",
    }),
    street: z.string().min(5, {
      message: "A rua precisa ter no mínimo 5 caracteres",
    }),
    city: z.string().min(3, {
      message: "A cidade precisa ter no mínimo 3 caracteres",
    }),
    estate: z.string().min(2, {
      message: "O estado precisa ter no mínimo 2 caracteres",
    }),
    CEP: z.string().length(8, {
      message: "CEP deve ter 8 dígitos no formato XXXXX-XXX",
    }),
    rooms: z.enum(["0", "1", "2", "3", "4", "5"], {
      required_error:
        "Você precisa selecionar quantos quartos o imóvel possui.",
    }),
    bathrooms: z.enum(["0", "1", "2", "3", "4", "5"], {
      required_error:
        "Você precisa selecionar quantos banheiros o imóvel possui.",
    }),
    garage: z.enum(["0", "1", "2", "3", "4", "5"], {
      required_error: "Você precisa selecionar quantas vagas o imóvel possui.",
    }),
    bedrooms: z.enum(["0", "1", "2", "3", "4", "5"], {
      required_error:
        "Você precisa selecionar quantos dormitórios o imóvel possui.",
    }),
    floors: z.enum(["0", "1", "2", "3", "4", "5"], {
      required_error:
        "Você precisa selecionar quantos andares o imóvel possui.",
    }),
    age: z.coerce
      .number()
      .min(0, {
        message: "A idade do imóvel não pode ser negativa.",
      })
      .transform((v) => Number(v) || 0),
    price: z.coerce
      .number({
        message: "O valor do imóvel deve ser um valor válido",
      })
      .transform((v) => Number(v) || 0),

    stage: z.coerce
      .number()
      .min(0, {
        message: "O estágio do imóvel deve ser um número válido.",
      })
      .transform((v) => Number(v) || 0),
    type: z.enum(["HOUSE", "AP", "LAND"], {
      required_error: "Você precisa selecionar o tipo de imóvel.",
    }),
    area: z.coerce.number().transform((v) => Number(v) || 0),
    built: z.coerce.number(),
    financeBanks: z.array(z.string()),
    pool_size: z.coerce.number().optional(),
    gatedCommunity_price: z.coerce.number(),
    furnished: z.boolean(),
    pool: z.boolean(),
    gym: z.boolean(),
    security: z.boolean(),
    isFinan: z.boolean(),
    elevator: z.boolean(),
    accessible: z.boolean(),
    balcony: z.boolean(),
    garden: z.boolean(),
    barbecueArea: z.boolean(),
    solarEnergy: z.boolean(),
    library: z.boolean(),
    wineCellar: z.boolean(),
    airConditioning: z.boolean(),
    smartHome: z.boolean(),
    laundryRoom: z.boolean(),
    gatedCommunity: z.boolean(),
    alarmSystem: z.boolean(),
    surveillanceCameras: z.boolean(),
    fingerprintAccess: z.boolean(),
    solarPanels: z.boolean(),
    chargingStation: z.boolean(),
    partyRoom: z.boolean(),
    guestParking: z.boolean(),
    petArea: z.boolean(),
    bikeRack: z.boolean(),
    coWorkingSpace: z.boolean(),
    petFriendly: z.boolean(),
    concierge: z.boolean(),
    backupGenerator: z.boolean(),
    waterReservoir: z.boolean(),
    serviceElevator: z.boolean(),
    coveredParking: z.boolean(),
    visitorParking: z.boolean(),
    carWash: z.boolean(),
    sportsCourt: z.boolean(),
    tennisCourt: z.boolean(),
    squashCourt: z.boolean(),
    soccerField: z.boolean(),
    skatePark: z.boolean(),
    runningTrack: z.boolean(),
    playground: z.boolean(),
    kidsRoom: z.boolean(),
    gameRoom: z.boolean(),
    cinemaRoom: z.boolean(),
    musicStudio: z.boolean(),
    spa: z.boolean(),
    sauna: z.boolean(),
    jacuzzi: z.boolean(),
    heatedPool: z.boolean(),
    indoorPool: z.boolean(),
    kidsPool: z.boolean(),
    communityGarden: z.boolean(),
    orchard: z.boolean(),
    meditationSpace: z.boolean(),
    hammockArea: z.boolean(),
    gourmetBarbecue: z.boolean(),
    pizzaOven: z.boolean(),
    firePit: z.boolean(),
    outdoorLounge: z.boolean(),
    panoramicDeck: z.boolean(),
    rooftop: z.boolean(),
    centralHeating: z.boolean(),
    centralCooling: z.boolean(),
    centralVacuum: z.boolean(),
    homeAutomation: z.boolean(),
    fiberInternet: z.boolean(),
    cableTvReady: z.boolean(),
    soundSystem: z.boolean(),
    smartLighting: z.boolean(),
    soundProofing: z.boolean(),
    securityRoom: z.boolean(),
    qrAccess: z.boolean(),
    facialRecognition: z.boolean(),
    panicButton: z.boolean(),
    automaticGate: z.boolean(),
    housekeeping: z.boolean(),
    laundryService: z.boolean(),
    coffeeShop: z.boolean(),
    miniMarket: z.boolean(),
    privateOffices: z.boolean(),
    deliveryRoom: z.boolean(),
    petCare: z.boolean(),
    carSharing: z.boolean(),
    bikeSharing: z.boolean(),
    driverLounge: z.boolean(),
    pictures: z.array(z.any()),
  })
  .superRefine((data, ctx) => {
    if (data.type === "HOUSE" && !data.area && !data.built) {
      ctx.addIssue({
        path: ["area"],
        code: z.ZodIssueCode.custom,
        message: "Campo obrigatório para casa",
      });
      ctx.addIssue({
        path: ["built"],
        code: z.ZodIssueCode.custom,
        message: "Campo obrigatório para casa",
      });
    }
    if (data.type === "AP" && !data.built) {
      ctx.addIssue({
        path: ["built"],
        code: z.ZodIssueCode.custom,
        message: "Área construída é obrigatória para apartamento.",
      });
    }
    if (data.type === "LAND" && !data.area) {
      ctx.addIssue({
        path: ["area"],
        code: z.ZodIssueCode.custom,
        message: "Área é obrigatória para terreno.",
      });
    }
  });

export type CustomImovel = Omit<
  Imovel,
  "rooms" | "bathrooms" | "bedrooms" | "garage" | "floors"
> & {
  rooms: string;
  bathrooms: string;
  bedrooms: string;
  garage: string;
  floors: string;
  pictures: [];
};

function page() {
  const params = useParams<{ editpage_postid: string }>();

  const postData = useCacheStorage((state) =>
    state.history.find((i) => i.id === params.editpage_postid)
  );

  if (!postData) return <div>...</div>;

  const newPostdata: CustomImovel = {
    ...postData,
    rooms: postData?.rooms.toString(),
    bathrooms: postData.bathrooms.toString(),
    bedrooms: postData.bedrooms.toString(),
    garage: postData.garage.toString(),
    floors: postData.floors.toString(),

    pictures: [],
  };

  console.log(postData);

  return (
    <div>
      <FormComponent postData={newPostdata} />
    </div>
  );
}
export default page;

function FormComponent({ postData }: { postData: CustomImovel }) {
  const params = useParams<{ editpage_postid: string }>();

  const overide = useCacheStorage((state) => state.overide);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...postData },
  });
  const [deleteFiles, setDeleteFiles] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostCreated, setPostCreatedStatus] = useState(false);
  const [cepLoad, setCepLoad] = useState<boolean>(false);
  const [geo, setGeo] = useState<null | { lng: string; lat: string }>(null);
  const [adFiles, setFiles] = useState<FileWithPreview[]>([]);
  const [adress, setAdress] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState("");
  const getUserAdress = async (cep: string) => {
    setCepLoad(true);
    getCoordsByCEP(cep);
    try {
      const adress = await fetch(`http://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
      });

      const data = await adress.json();

      const endereco = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brasil`;

      const url = `https://maps.google.com/maps?q=${encodeURIComponent(
        endereco
      )}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;

      setMapUrl(url);
      setCepLoad(false);

      if (data.erro === "true") {
        form.setError("CEP", { message: "CEP não encontrado ou inválido." });
        form.setValue("city", "");
        form.setValue("street", "");
        form.setValue("estate", "");
        form.setValue("log", "");
      } else {
        form.clearErrors("CEP");
        form.clearErrors("city");
        form.clearErrors("street");
        form.clearErrors("estate");
        form.clearErrors("log");
        form.setValue("city", data.localidade);
        form.setValue("street", data.bairro);
        form.setValue("estate", data.estado);
        form.setValue("log", data.logradouro);
      }
    } catch (err) {
      setCepLoad(false);
    }
  };

  const cepFormWatcher = form.watch("CEP");
  const isPoolMarked = form.watch("pool");
  const isGatedComunity = form.watch("gatedCommunity");
  const isFinan = form.watch("isFinan");
  const type = form.watch("type");

  const cepRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      const formattedValue = formatarCep(ref.current.value);
      form.setValue("CEP", formattedValue);
    }
  };

  const formatarCep = (value: string) => {
    return value.replace(/\D/g, "");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { pictures, ...body } = values;

    const requestAdJSON = {
      ...body,
      postId: postData.postId,
      rooms: Number(values.rooms),
      bathrooms: Number(values.bathrooms),
      garage: Number(values.garage),
      bedrooms: Number(values.bedrooms),
      floors: Number(values.floors),
    };

    const data = await fetch(`http://localhost:5000/anuncio`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestAdJSON),
    });

    const response = await data.json();

    if (!response.success) {
      form.setError("root", {
        message: "Erro ao criar anúncio. Tente novamente.",
      });
      setIsLoading(false);
      return;
    }

    const isPicturesUploaded = await sendPictures(adFiles, postData.postId);

    if (isPicturesUploaded.success !== true) {
      form.setError("root", {
        message: "Erro ao enviar imagens. Tente novamente.",
      });

      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setPostCreatedStatus(true);
    overide(isPicturesUploaded.data);
    setDeleteFiles(true)
    return
  }



  const setIsSuccessDeletings = () => {
    return setDeleteFiles(false)
  }
    async function sendPictures(files: FileWithPreview[], postId: string) {
    const formData = new FormData();

    adFiles.forEach((photo) => {
      formData.append("files", photo.file as File);
      formData.append("id", postId);
    });

    const data = await fetch(`http://localhost:5000/anuncio/pictures`, {
      method: "POST",
      credentials: "include",

      body: formData,
    });
    const response = await data.json();

    return response;
  }

  type FormValues = z.infer<typeof formSchema>;

  const handleNumericFields = (value: any, formName: keyof FormValues) => {
    form.setValue(formName, value);
  };

  const getFiles = async (files: FileWithPreview[]) => {
    setFiles(files);
    if (files === null) return form.setValue("pictures", []);

    form.setValue("pictures", files);
  };

  async function getCoordsByCEP(cepreq: string) {
    setGeo(null);
    const cep = cepreq.slice(0, 7).concat("0");
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await viaCepRes.json();

    const endereco = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brasil`;

    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        endereco
      )}&format=json&addressdetails=1&limit=1`
    );
    const geo = await nominatimRes.json();

    if (geo.length === 0) return;

    setGeo({ lat: geo[0].lat, lng: geo[0].lon });
  }

  const formatCurrency = (value: string | number): string => {
    const numberValue =
      typeof value === "string"
        ? Number(value.replace(/\D/g, "")) / 100
        : value;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };
  const [accordionValue, setAccordionValue] = React.useState("");

  useEffect(() => {
    if (cepFormWatcher.length === 8) {
      getUserAdress(cepFormWatcher);
    }

    if (cepRef !== null) handleInputChange(cepRef);
    if (!isPoolMarked) form.setValue("pool_size", 0);
    if (!isGatedComunity) form.setValue("gatedCommunity_price", 0);
    if (!isFinan) {
      form.setValue("financeBanks", []);
      setAccordionValue("");
    }
    if (isFinan) {
      setAccordionValue("financeBanks");
    }
    if (
      form.getFieldState("area").invalid ||
      form.getFieldState("built").invalid ||
      form.getFieldState("pool_size").invalid
    ) {
      form.clearErrors("area");
      form.clearErrors("pool_size");
      form.clearErrors("built");
    }
  }, [cepFormWatcher, isGatedComunity, isPoolMarked, isFinan, type]);

  const types = [
    {
      value: "AP",
      label: "Apartamento",
      sublabel: "Unidade autônoma em condomínio",
      description:
        "Ideal para quem busca praticidade e segurança. Apartamentos geralmente oferecem amenities como piscina, academia e área de lazer.",
    },
    {
      value: "HOUSE",
      label: "Casa",
      sublabel: "Imóvel residencial independente",
      description:
        "Perfeita para famílias que valorizam privacidade e espaço. Casas oferecem maior área útil, quintal e mais liberdade para personalização.",
    },
    {
      value: "LAND",
      label: "Terreno",
      sublabel: "Área livre para construção",
      description:
        "Opportunidade para construir seu imóvel do zero. Terrenos permitem total customização e são ideais para investidores e quem quer criar um projeto personalizado.",
    },
  ];
  const rooms = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];
  const banheiros = [
    { value: "0", label: "0" },

    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];

  const garagem = [
    { value: "0", label: "0" },

    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];
  const financeBanks = [
    {
      value: "Itaú Unibanco",
      label: "Itaú Unibanco",
      Icon: "",
      defaultChecked: true,
    },
    { value: "Banco do Brasil", label: "Banco do Brasil", Icon: "" },
    { value: "BradescO", label: "Bradesco", Icon: "" },
    { value: "Caixa Econômica", label: "Caixa Econômica", Icon: "" },
    { value: "Santander Brasil", label: "Santander Brasil", Icon: "" },
    { value: "BTG Pactual", label: "BTG Pactual", Icon: "" },
    { value: "Sicredi", label: "Sicredi", Icon: "" },
    { value: "Sicoob", label: "Sicoob", Icon: "" },
    { value: "Banco Safra", label: "Banco Safra", Icon: "" },
    { value: "Citibank Brasil", label: "Citibank Brasil", Icon: "" },
  ] as const;
  const andares = [
    { value: "0", label: "Térreo" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];

  const booleanOptions = [
    { value: true, label: "Sim" },
    { value: false, label: "Não" },
  ];

  const amenities = [
    {
      name: "furnished",
      label: "Mobiliado",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="furnished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobiliado</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },

    {
      name: "gym",
      label: "Academia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="gym"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academia</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "security",
      label: "Segurança",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="security"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segurança</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "elevator",
      label: "Elevador",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="elevator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Elevador</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "accessible",
      label: "Acessível",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="accessible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acessível</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "balcony",
      label: "Sacada",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="balcony"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sacada</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "garden",
      label: "Jardim",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="garden"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jardim</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "barbecueArea",
      label: "Área de churrasco",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="barbecueArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área de churrasco</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "solarEnergy",
      label: "Energia solar",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="solarEnergy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Energia solar</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "library",
      label: "Biblioteca",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="library"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biblioteca</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "wineCellar",
      label: "Adega",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="wineCellar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adega</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "airConditioning",
      label: "Ar-condicionado",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="airConditioning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ar-condicionado</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "smartHome",
      label: "Casa inteligente",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="smartHome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Casa inteligente</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "laundryRoom",
      label: "Lavanderia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="laundryRoom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lavanderia</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "gatedCommunity",
      label: "Condomínio fechado",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="gatedCommunity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condomínio fechado</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "alarmSystem",
      label: "Sistema de alarme",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="alarmSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sistema de alarme</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "surveillanceCameras",
      label: "Câmeras de segurança",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="surveillanceCameras"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Câmeras de segurança</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "fingerprintAccess",
      label: "Acesso por digital",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="fingerprintAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acesso por digital</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "solarPanels",
      label: "Painéis solares",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="solarPanels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Painéis solares</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "chargingStation",
      label: "Estação de recarga",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="chargingStation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estação de recarga</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "partyRoom",
      label: "Salão de festas",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="partyRoom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salão de festas</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "guestParking",
      label: "Estacionamento para visitantes",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="guestParking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estacionamento para visitantes</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "petArea",
      label: "Área pet",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="petArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área pet</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "bikeRack",
      label: "Bicicletário",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="bikeRack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bicicletário</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "coWorkingSpace",
      label: "Espaço de coworking",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="coWorkingSpace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espaço de coworking</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "petFriendly",
      label: "Aceita pets",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="petFriendly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aceita pets</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "concierge",
      label: "Concierge",
      category: "estrutura",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="concierge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Concierge</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "backupGenerator",
      label: "Gerador de energia",
      category: "estrutura",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="backupGenerator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gerador de energia</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "waterReservoir",
      label: "Reservatório de água",
      category: "estrutura",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="waterReservoir"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reservatório de água</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "serviceElevator",
      label: "Elevador de serviço",
      category: "estrutura",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="serviceElevator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Elevador de serviço</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "coveredParking",
      label: "Estacionamento coberto",
      category: "estrutura",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="coveredParking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estacionamento coberto</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "visitorParking",
      label: "Estacionamento visitantes",
      category: "estrutura",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="visitorParking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estacionamento visitantes</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "carWash",
      label: "Lava-carros",
      category: "estrutura",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="carWash"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lava-carros</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "sportsCourt",
      label: "Quadra poliesportiva",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="sportsCourt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quadra poliesportiva</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "tennisCourt",
      label: "Quadra de tênis",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="tennisCourt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quadra de tênis</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "squashCourt",
      label: "Quadra de squash",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="squashCourt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quadra de squash</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "soccerField",
      label: "Campo de futebol",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="soccerField"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campo de futebol</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "skatePark",
      label: "Pista de skate",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="skatePark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pista de skate</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "runningTrack",
      label: "Pista de corrida",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="runningTrack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pista de corrida</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "playground",
      label: "Playground",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="playground"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playground</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "kidsRoom",
      label: "Brinquedoteca",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="kidsRoom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brinquedoteca</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "gameRoom",
      label: "Sala de jogos",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="gameRoom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala de jogos</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "cinemaRoom",
      label: "Sala de cinema",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="cinemaRoom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala de cinema</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "musicStudio",
      label: "Estúdio de música",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="musicStudio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estúdio de música</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "spa",
      label: "Spa",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="spa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spa</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "sauna",
      label: "Sauna",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="sauna"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sauna</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "jacuzzi",
      label: "Jacuzzi",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="jacuzzi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jacuzzi</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "heatedPool",
      label: "Piscina aquecida",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="heatedPool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piscina aquecida</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "indoorPool",
      label: "Piscina coberta",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="indoorPool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piscina coberta</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "kidsPool",
      label: "Piscina infantil",
      category: "lazer",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="kidsPool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piscina infantil</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "communityGarden",
      label: "Horta comunitária",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="communityGarden"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horta comunitária</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "orchard",
      label: "Pomar",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="orchard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pomar</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "meditationSpace",
      label: "Espaço de meditação",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="meditationSpace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espaço de meditação</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "hammockArea",
      label: "Área de redes",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="hammockArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área de redes</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "gourmetBarbecue",
      label: "Churrasqueira gourmet",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="gourmetBarbecue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Churrasqueira gourmet</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "pizzaOven",
      label: "Forno de pizza",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="pizzaOven"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forno de pizza</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "firePit",
      label: "Fogueira",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="firePit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fogueira</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "outdoorLounge",
      label: "Lounge externo",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="outdoorLounge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lounge externo</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "panoramicDeck",
      label: "Deck panorâmico",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="panoramicDeck"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deck panorâmico</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "rooftop",
      label: "Rooftop",
      category: "verdeSocial",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="rooftop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rooftop</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "centralHeating",
      label: "Aquecimento central",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="centralHeating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aquecimento central</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "centralCooling",
      label: "Resfriamento central",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="centralCooling"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resfriamento central</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "centralVacuum",
      label: "Aspiração central",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="centralVacuum"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aspiração central</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "homeAutomation",
      label: "Automação residencial",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="homeAutomation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Automação residencial</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "fiberInternet",
      label: "Internet fibra óptica",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="fiberInternet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internet fibra óptica</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "cableTvReady",
      label: "Preparado para TV a cabo",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="cableTvReady"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preparado para TV a cabo</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "soundSystem",
      label: "Sistema de som",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="soundSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sistema de som</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "smartLighting",
      label: "Iluminação inteligente",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="smartLighting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Iluminação inteligente</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "soundProofing",
      label: "Isolamento acústico",
      category: "confortoTecnologia",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="soundProofing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isolamento acústico</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "securityRoom",
      label: "Central de segurança",
      category: "segurancaExtra",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="securityRoom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Central de segurança</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "qrAccess",
      label: "Acesso via QR code",
      category: "segurancaExtra",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="qrAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acesso via QR code</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "facialRecognition",
      label: "Reconhecimento facial",
      category: "segurancaExtra",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="facialRecognition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reconhecimento facial</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "panicButton",
      label: "Botão de pânico",
      category: "segurancaExtra",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="panicButton"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Botão de pânico</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: "automaticGate",
      label: "Portão automático",
      category: "segurancaExtra",
      options: booleanOptions,
      form: (
        <FormField
          control={form.control}
          name="automaticGate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portão automático</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
  ];

  return (
    <div className="w-full ">
      <div className="flex items-center justify-center flex-col  w-full">
        <div className="flex flex-col  lg:py-10 w-full p-5  ">
          <div className="space-y-3 border-b pb-4">
            <h2 className="text-2xl  lg:text-4xl font-semibold">
              Edite seu anúncio
            </h2>
            <p className="text-xs  lg:text-sm text-muted-foreground">
              Preencha as informações abaixo para editar seu imóvel. Os campos
              obrigatórios estão marcados com
              <span className="text-red-500">*</span>.
            </p>
            <div className=" "></div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full   lg:flex flex-col lg:flex-row lg:justify-center lg:items-start "
            >
              <div className=" w-full lg:w-2/3">
                <Main>
                  <Header>
                    <Title>Adicione um título</Title>
                    <Description>
                      Dê um título atraente para o seu anúncio.
                    </Description>
                  </Header>
                  <Body className="">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Título do anúncio{" "}
                            <span className="text-sm text-red-700">*</span>
                          </FormLabel>
                          <FormControl className="">
                            <Input placeholder="" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="">
                      <h2 className="text-sm my-2">
                        Descreva seu imóvel{" "}
                        <span className="text-sm text-red-700">*</span>
                      </h2>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl className="">
                              <MinimalTiptapEditor
                                value={() => {
                                  form.getValues().description.length > 0
                                    ? form.getValues().description.toString()
                                    : null;
                                }}
                                onChange={(value) => {
                                  if (!value) return;
                                  form.setValue(
                                    "description",
                                    value.toString()
                                  );
                                }}
                                className="w-full"
                                editorContentClassName="p-5"
                                output="html"
                                placeholder="Enter your description..."
                                autofocus={false}
                                editable={true}
                                onCreate={(editor) => {
                                  editor.editor.commands.setContent(
                                    form.getValues().description
                                  );
                                }}
                                editorClassName="focus:outline-hidden"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Body>
                </Main>
                <Main className="h-fit">
                  <Header>
                    <Title>Valores </Title>
                    <Description>
                      Informe o preço de venda do imóvel. Esses valores ajudarão
                      os interessados a entender os custos totais.{" "}
                    </Description>
                  </Header>
                  <Body>
                    <Body className="  border  grid gap-3 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 ">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="gap-0">
                            <FormLabel className={"font-semibold text-sm m-0"}>
                              Valor da propiedade{" "}
                              <span className="text-sm text-red-700">*</span>
                            </FormLabel>
                            <FormDescription
                              className={"text-muted-foreground text-xs"}
                            >
                              Informe o valor da propiedade em Reais
                            </FormDescription>
                            <FormControl>
                              <div className=" flex rounded-md shadow-xs lg:w-fit my-2">
                                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1"></span>
                                <Input
                                  {...field}
                                  value={formatCurrency(field.value || "")}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericValue = value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    const numberValue = numericValue
                                      ? Number(numericValue)
                                      : "";
                                    handleNumericFields(numberValue, "price");
                                  }}
                                  onBlur={(e) => {
                                    const value = e.target.value;
                                    const numericValue = value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    const numberValue = numericValue
                                      ? Number(numericValue)
                                      : "";
                                    field.onChange(numberValue);
                                  }}
                                  className="-me-px rounded-e-none shadow-none"
                                  placeholder="R$ 0,00"
                                />

                                <span className="border-input  text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                                  Real
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gatedCommunity"
                        render={({ field }) => (
                          <FormItem className="gap-0">
                            <FormLabel
                              className={
                                form.getValues().gatedCommunity === true
                                  ? "font-semibold text-sm  m-0 "
                                  : "font-semibold text-sm text-muted-foreground m-0 "
                              }
                            >
                              Valor do condomínio
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mx-2  "
                              />{" "}
                            </FormLabel>
                            <FormDescription
                              className={
                                form.getValues().pool === true
                                  ? "text-muted-foreground text-xs"
                                  : "text-muted-foreground text-xs"
                              }
                            >
                              Informe o valor do condomínio em Reais
                            </FormDescription>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name="gatedCommunity_price"
                                render={({ field }) => (
                                  <FormItem className="">
                                    <FormControl>
                                      <div className="relative flex rounded-md shadow-xs  lg:w-fit my-2">
                                        <Input
                                          {...field}
                                          disabled={
                                            form.getValues().gatedCommunity
                                              ? false
                                              : true
                                          }
                                          value={formatCurrency(
                                            field.value || ""
                                          )}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericValue = value.replace(
                                              /\D/g,
                                              ""
                                            );
                                            const numberValue = numericValue
                                              ? Number(numericValue)
                                              : "";
                                            handleNumericFields(
                                              numberValue,
                                              "gatedCommunity_price"
                                            );
                                          }}
                                          onBlur={(e) => {
                                            const value = e.target.value;
                                            const numericValue = value.replace(
                                              /\D/g,
                                              ""
                                            );
                                            const numberValue = numericValue
                                              ? Number(numericValue)
                                              : "";
                                            field.onChange(numberValue);
                                          }}
                                          className={
                                            form.getValues().gatedCommunity
                                              ? "-me-px rounded-e-none  shadow-none"
                                              : "-me-px rounded-e-none  shadow-none text-muted-foreground"
                                          }
                                          placeholder="R$ 0,00"
                                        />

                                        <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                                          Real
                                        </span>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Body>
                    <Body className="border-none bg-neutral-50">
                      <FormField
                        control={form.control}
                        name="isFinan"
                        render={({ field }) => (
                          <FormItem className="gap-0">
                            <FormLabel
                              className={
                                form.getValues().isFinan === true
                                  ? "font-semibold text-sm  m-0 "
                                  : "font-semibold text-sm text-muted-foreground m-0 "
                              }
                            >
                              Fincanciamento
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mx-2"
                              />
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Selecione bancos que aceitam financiamento dessa
                              propriedade.
                            </FormDescription>
                            <div className="my-2">
                              <div className="rounded-md border border-blue-500/50 px-4 py-3 text-blue-600">
                                <p className=" text-xs text-start md:text-sm">
                                  <InfoIcon
                                    className=" hidden  me-3 -mt-0.5 md:inline-flex opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                  A seleção de bancos é opcional.
                                </p>
                              </div>
                            </div>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name="financeBanks"
                                render={({ field }) => (
                                  <FormItem className="">
                                    <FormControl>
                                      <FormField
                                        control={form.control}
                                        name="financeBanks"
                                        render={() => (
                                          <FormItem>
                                            <Accordion
                                              type="single"
                                              collapsible={true}
                                              defaultValue="3"
                                              value={accordionValue}
                                              onValueChange={setAccordionValue}
                                            >
                                              <AccordionItem
                                                value="financeBanks"
                                                className="py-2"
                                              >
                                                <AccordionContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                  {financeBanks.map((item) => (
                                                    <FormField
                                                      key={item.value}
                                                      control={form.control}
                                                      name="financeBanks"
                                                      render={({ field }) => {
                                                        return (
                                                          <FormItem
                                                            key={item.value}
                                                          >
                                                            <FormControl>
                                                              <div
                                                                key={`${item.value}`}
                                                                className={
                                                                  form.getValues()
                                                                    .isFinan
                                                                    ? "border-input has-data-[state=checked]:bg-neutral-100 has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
                                                                    : "border-input has-data-[state=checked]:bg-neutral-100 has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none opacity-50"
                                                                }
                                                              >
                                                                <div className="flex justify-between gap-2">
                                                                  <Checkbox
                                                                    disabled={
                                                                      !form.getValues()
                                                                        .isFinan
                                                                    }
                                                                    checked={field.value?.includes(
                                                                      item.value
                                                                    )}
                                                                    onCheckedChange={(
                                                                      checked
                                                                    ) => {
                                                                      return checked
                                                                        ? field.onChange(
                                                                            [
                                                                              ...field.value,
                                                                              item.value,
                                                                            ]
                                                                          )
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                              (
                                                                                value
                                                                              ) =>
                                                                                value !==
                                                                                item.value
                                                                            )
                                                                          );
                                                                    }}
                                                                    id={`${item.value}`}
                                                                    value={
                                                                      item.value
                                                                    }
                                                                    className="order-1 after:absolute after:inset-0"
                                                                  />
                                                                </div>
                                                                <Label
                                                                  className={
                                                                    form.getValues()
                                                                      .isFinan
                                                                      ? "font-semibold text-xs m-0"
                                                                      : "font-semibold text-xs text-muted-foreground m-0"
                                                                  }
                                                                  htmlFor={`${item.value}`}
                                                                >
                                                                  {item.label}
                                                                </Label>
                                                              </div>
                                                            </FormControl>
                                                          </FormItem>
                                                        );
                                                      }}
                                                    />
                                                  ))}
                                                </AccordionContent>
                                              </AccordionItem>
                                            </Accordion>

                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Body>
                  </Body>
                </Main>
                <Main>
                  <Header>
                    <Title>Detalhes do imóvel</Title>
                    <Description>
                      Marque todas as opções que se aplicam ao imóvel, como
                      vagas, suítes e outros recursos.{" "}
                    </Description>
                  </Header>
                  <Body>
                    <Header>
                      <Title>Tipo do imóvel</Title>
                      <Description>
                        Escolha a categoria que representa o imóvel, como casa,
                        apartamento ou terreno.
                      </Description>
                    </Header>
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-0 gap-0">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="gap-x-2 grid md:grid-cols-2 my-2"
                            >
                              {types.map((item, index) => (
                                <div
                                  key={index}
                                  className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                                >
                                  <RadioGroupItem
                                    value={item.value}
                                    aria-describedby={item.value}
                                    className="order-1 after:absolute after:inset-0"
                                  />
                                  <div className="flex grow items-start gap-3">
                                    <div className="grid grow gap-2">
                                      <Label htmlFor={item.label}>
                                        {item.label}
                                        <span className=" block text-muted-foreground text-xs leading-[inherit] font-normal">
                                          {item.sublabel}
                                        </span>
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {["HOUSE", "AP", "LAND"].includes(form.watch().type) && (
                      <>
                        {" "}
                        <Body>
                          <Header className="mb-4">
                            <Title>Dimenções da propiedade</Title>
                            <Description>
                              Descreva as dimenções da propiedade com o máximo
                              de precisão possível.
                            </Description>
                          </Header>
                          <div className="grid md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
                            {["HOUSE", "AP"].includes(form.watch().type) && (
                              <div>
                                <FormField
                                  control={form.control}
                                  name="built"
                                  render={({ field }) => (
                                    <FormItem className="gap-0">
                                      <FormLabel
                                        className={
                                          "font-semibold text-sm  m-0 "
                                        }
                                      >
                                        Área construída
                                        <span className="text-sm text-red-700">
                                          *
                                        </span>
                                      </FormLabel>
                                      <FormDescription
                                        className={
                                          "text-muted-foreground text-xs"
                                        }
                                      >
                                        Descreva as dimenções da área construída
                                        imóvel
                                      </FormDescription>
                                      <FormControl>
                                        <div className="relative flex rounded-md shadow-xs md:w-fit my-2">
                                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                            <SizeIcon />
                                          </span>
                                          <Input
                                            {...field}
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              if (value === "")
                                                return form.setValue(
                                                  "built",
                                                  0
                                                );

                                              const numericValue =
                                                value.replace(/\D/g, "");

                                              form.setValue(
                                                "built",
                                                parseInt(numericValue)
                                              );
                                            }}
                                            className="-me-px rounded-e-none ps-8 shadow-none"
                                            placeholder="10m²"
                                          />
                                          <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                                            m²
                                          </span>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}

                            {["HOUSE", "LAND"].includes(form.watch().type) && (
                              <div>
                                <FormField
                                  control={form.control}
                                  name="area"
                                  render={({ field }) => (
                                    <FormItem className="gap-0">
                                      <FormLabel
                                        className={
                                          "font-semibold text-sm  m-0 "
                                        }
                                      >
                                        Área da propiedade{" "}
                                        <span className="text-sm text-red-700">
                                          *
                                        </span>
                                      </FormLabel>
                                      <FormDescription
                                        className={
                                          "text-muted-foreground text-xs"
                                        }
                                      >
                                        Descreva as dimenções da propiedade
                                        (terreno)
                                      </FormDescription>
                                      <FormControl>
                                        <div className="relative flex rounded-md shadow-xs  md:w-fit my-2">
                                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                            <SizeIcon />
                                          </span>
                                          <Input
                                            {...field}
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              if (value === "")
                                                return form.setValue("area", 0);

                                              const numericValue =
                                                value.replace(/\D/g, "");

                                              form.setValue(
                                                "area",
                                                parseInt(numericValue)
                                              );
                                            }}
                                            className="-me-px rounded-e-none ps-8 shadow-none"
                                            placeholder="10m²"
                                          />

                                          <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                                            m²
                                          </span>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                            {["HOUSE", "AP"].includes(form.watch().type) && (
                              <div className="w-full">
                                <FormField
                                  control={form.control}
                                  name="pool"
                                  render={({ field }) => (
                                    <FormItem className="gap-0">
                                      <FormLabel
                                        className={
                                          form.getValues().pool === true
                                            ? "font-semibold text-sm  m-0 "
                                            : "font-semibold text-sm text-muted-foreground m-0 "
                                        }
                                      >
                                        Piscina
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          className="mx-2"
                                        />{" "}
                                      </FormLabel>
                                      <FormDescription
                                        className={
                                          form.getValues().pool === true
                                            ? "text-muted-foreground text-xs"
                                            : "text-muted-foreground text-xs"
                                        }
                                      >
                                        Descreva as dimenções da piscina
                                      </FormDescription>
                                      <FormControl className="w-full bg-amber-300">
                                        <FormField
                                          control={form.control}
                                          name="pool_size"
                                          render={({ field }) => (
                                            <FormItem className="w-full">
                                              <FormControl>
                                                <div className="relative flex rounded-md shadow-xs w-full md:w-fit my-2">
                                                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                                    <SizeIcon />
                                                  </span>
                                                  <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                      const value =
                                                        e.target.value;

                                                      if (value === "")
                                                        return form.setValue(
                                                          "pool_size",
                                                          0
                                                        );

                                                      const numericValue =
                                                        value.replace(
                                                          /\D/g,
                                                          ""
                                                        );

                                                      form.setValue(
                                                        "pool_size",
                                                        parseInt(numericValue)
                                                      );
                                                    }}
                                                    disabled={
                                                      form.getValues().pool ===
                                                      true
                                                        ? false
                                                        : true
                                                    }
                                                    className="w-full  md:w-fit  -me-px rounded-e-none ps-8 shadow-none"
                                                    placeholder="10m²"
                                                  />
                                                  <span className="border-input bg-background  md:w-fit text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                                                    m²
                                                  </span>
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        </Body>
                        <Body>
                          <Header className="mb-3">
                            <Title>Detalhes internos do imóvel </Title>
                            <Description>
                              Especifique a quantidade de quartos, salas,
                              andares e vagas de garagem para ajudar os
                              interessados a conhecer melhor a estrutura da
                              propriedade.{" "}
                            </Description>
                          </Header>{" "}
                          <Body className=" grid   grid-cols-2 2xl:grid-cols-4 gap-3 border-none ">
                            <FormField
                              control={form.control}
                              name="rooms"
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormLabel>
                                    Quartos{" "}
                                    <span className="text-sm text-red-700">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid gap-2 px-5"
                                    >
                                      {rooms.map((item) => (
                                        <RadioGroup_1.Item
                                          key={item.value}
                                          value={item.value}
                                          className={cn(
                                            " w-full text-center p-5 py-2 relative group ring-[1px] ring-border rounded-sm text-sm ",
                                            "data-[state=checked]:ring-1 data-[state=checked]:ring-neutral-500"
                                          )}
                                        >
                                          <p className="">{item.label}</p>
                                        </RadioGroup_1.Item>
                                      ))}
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="bathrooms"
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormLabel>
                                    Banheiros{" "}
                                    <span className="text-sm text-red-700">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid gap-2 px-5"
                                    >
                                      {banheiros.map((item) => (
                                        <RadioGroup_1.Item
                                          key={item.value}
                                          value={item.value}
                                          className={cn(
                                            " w-full text-center p-5 py-2 relative group ring-[1px] ring-border rounded-sm text-sm ",
                                            "data-[state=checked]:ring-1 data-[state=checked]:ring-neutral-500"
                                          )}
                                        >
                                          <p className="">{item.label}</p>
                                        </RadioGroup_1.Item>
                                      ))}
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="bathrooms"
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormLabel>
                                    Vagas de garagem{" "}
                                    <span className="text-sm text-red-700">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid gap-2 px-5"
                                    >
                                      {garagem.map((item) => (
                                        <RadioGroup_1.Item
                                          key={item.value}
                                          value={item.value}
                                          className={cn(
                                            " w-full text-center p-5 py-2 relative group ring-[1px] ring-border rounded-sm text-sm ",
                                            "data-[state=checked]:ring-1 data-[state=checked]:ring-neutral-500"
                                          )}
                                        >
                                          <p className="">{item.label}</p>
                                        </RadioGroup_1.Item>
                                      ))}
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {["HOUSE"].includes(form.watch().type) && (
                              <FormField
                                control={form.control}
                                name="floors"
                                render={({ field }) => (
                                  <FormItem className="h-fit">
                                    <FormLabel>Quantidade de pisos</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid gap-2 px-5"
                                      >
                                        {andares.map((item) => (
                                          <RadioGroup_1.Item
                                            key={item.value}
                                            value={item.value}
                                            className={cn(
                                              " w-full text-center p-5 py-2 relative group ring-[1px] ring-border rounded-sm text-sm ",
                                              "data-[state=checked]:ring-1 data-[state=checked]:ring-neutral-500"
                                            )}
                                          >
                                            <p className="">{item.label}</p>
                                          </RadioGroup_1.Item>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </Body>
                        </Body>
                        <Tabs defaultValue="tab-1">
                          <ScrollArea>
                            <TabsList className="before:bg-border relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                              <TabsTrigger
                                value="tab-1"
                                className=" text-muted-foreground  bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                              >
                                Geral <House className="w-4 h-4 mx-1" />
                              </TabsTrigger>
                              <TabsTrigger
                                value="tab-2"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                              >
                                Segurança <Shield className="w-4 h-4 mx-1" />
                              </TabsTrigger>
                              <TabsTrigger
                                value="tab-3"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                              >
                                Tecnologia{" "}
                                <HousePlug className="w-4 h-4 mx-1" />
                              </TabsTrigger>
                              <TabsTrigger
                                value="tab-4"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                              >
                                Verde social{" "}
                                <TreePalmIcon className="w-4 h-4 mx-1" />
                              </TabsTrigger>
                              <TabsTrigger
                                value="tab-5"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                              >
                                Lazer <Theater className="w-4 h-4 mx-1" />
                              </TabsTrigger>
                              <TabsTrigger
                                value="tab-6"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                              >
                                Estrutura <Building className="w-4 h-4 mx-1" />
                              </TabsTrigger>
                            </TabsList>
                            <ScrollBar
                              orientation="horizontal"
                              className="mt-2 hidden"
                            />
                          </ScrollArea>

                          <TabsContent value="tab-1">
                            <Body>
                              <Header></Header>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {amenities
                                  .filter((item) => item.category === undefined)
                                  .map((item) => (
                                    <div className="my-1" key={item.name}>
                                      {item.form}
                                    </div>
                                  ))}
                              </div>
                            </Body>
                          </TabsContent>
                          <TabsContent value="tab-2">
                            <Body>
                              <Header></Header>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {amenities
                                  .filter(
                                    (item) => item.category === "segurancaExtra"
                                  )
                                  .map((item) => (
                                    <div className="my-1" key={item.name}>
                                      {item.form}
                                    </div>
                                  ))}
                              </div>
                            </Body>
                          </TabsContent>
                          <TabsContent value="tab-3">
                            <Body>
                              <Header></Header>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {amenities
                                  .filter(
                                    (item) =>
                                      item.category === "confortoTecnologia"
                                  )
                                  .map((item) => (
                                    <div className="my-1" key={item.name}>
                                      {item.form}
                                    </div>
                                  ))}
                              </div>
                            </Body>
                          </TabsContent>
                          <TabsContent value="tab-4">
                            <Body>
                              <Header></Header>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {amenities
                                  .filter(
                                    (item) => item.category === "verdeSocial"
                                  )
                                  .map((item) => (
                                    <div className="my-1" key={item.name}>
                                      {item.form}
                                    </div>
                                  ))}
                              </div>
                            </Body>
                          </TabsContent>
                          <TabsContent value="tab-5">
                            <Body>
                              <Header></Header>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {amenities
                                  .filter((item) => item.category === "lazer")
                                  .map((item) => (
                                    <div className="my-1" key={item.name}>
                                      {item.form}
                                    </div>
                                  ))}
                              </div>
                            </Body>
                          </TabsContent>
                          <TabsContent value="tab-6">
                            <Body>
                              <Header></Header>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {amenities
                                  .filter(
                                    (item) => item.category === "estrutura"
                                  )
                                  .map((item) => (
                                    <div className="my-1" key={item.name}>
                                      {item.form}
                                    </div>
                                  ))}
                              </div>
                            </Body>
                          </TabsContent>
                        </Tabs>
                      </>
                    )}
                  </Body>
                </Main>

                {form.formState.errors.root && (
                  <p className="text-xs text-red-400 my-4">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <Button
                  className="hidden lg:flex"
                  disabled={isLoading ? true : false}
                >
                  Criar novo anúncio{" "}
                  {isLoading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <Plus />
                  )}
                </Button>
              </div>
              <div className=" w-full lg:w-1/3">
                <Main>
                  <Header>
                    <Title>Endereço</Title>
                    <Description>
                      Comece digitando o CEP para preencher automaticamente o
                      endereço
                    </Description>
                  </Header>
                  <Body>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="CEP"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              CEP{" "}
                              <span className="text-sm text-red-700">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="01310100 (Apenas números)"
                                {...field}
                                ref={cepRef}
                                maxLength={8}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^[0-9]*$/.test(value))
                                    handleInputChange(cepRef);
                                }}
                                disabled={cepLoad}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="log"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logradouro</FormLabel>
                            <FormControl>
                              <Input
                                disabled
                                placeholder="Condomínio Jardins, Bloco A"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rua/Avenida</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Av. Paulista"
                                {...field}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="São Paulo"
                                {...field}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="SP" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Body>
                </Main>

                <div>
                  {mapUrl && (
                    <div className="relative w-full">
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="400"
                        className="border-0 rounded-md"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                <Main>
                  <Header>
                    <Title>Adicione fotos do imóvel</Title>
                    <Description>
                      Mostre seu imóvel da melhor forma com fotos de qualidade{" "}
                    </Description>
                  </Header>
                  <Body>
                    <EditGalery
                      images={postData.imovelImages}
                      data={postData}
                    />
                    <FormField
                      control={form.control}
                      name="pictures"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Galery
                              getFiles={getFiles}
                              postImagesIsFull={postData.imovelImages.length >= 15 ? true : false}
                              postImagesTotalLenght={postData.imovelImages.length}
                              deleteFiles={deleteFiles}
                              setIsSuccessDeletings={setIsSuccessDeletings}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Body>
                </Main>

                <Button
                  className="flex lg:hidden"
                  disabled={isLoading ? true : false}
                >
                  Criar novo anúncio{" "}
                  {isLoading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <Plus />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Success() {
  return (
    <div className="mx-auto p-6 text-center h-screen flex items-center justify-center flex-col">
      {/* Ícone de sucesso */}
      <div className="mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      </div>

      {/* Título */}
      <h1 className="text-2xl font-bold mb-2">Anúncio Criado com Sucesso</h1>

      {/* Mensagem */}
      <p className="text-gray-600 mb-6">
        Seu anúncio foi publicado e já pode ser visualizado pelos interessados.{" "}
        <strong>Boa sorte na sua negociação!</strong>
      </p>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <Link href="/user/dashboard/imovel?page=1">Ver Meus Anúncios</Link>
        </Button>
        <Button asChild>
          <Link href="/anuncio/novo#">Criar Outro Anúncio</Link>
        </Button>
      </div>
    </div>
  );
}

function Main({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot=""
      className={cn("w-full p-2 rounded-md  ", className)}
      {...props}
    />
  );
}

function LoaderCustom({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="" className={cn("", className)} {...props} />;
}

function Header({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="" className={cn("my-2", className)} {...props} />;
}
function Title({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot=""
      className={cn("text-2xl font-semibold", className)}
      {...props}
    />
  );
}
function Description({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot=""
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
function Body({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot=""
      className={cn("my-2 p-4 border rounded-md shadow-xs   ", className)}
      {...props}
    />
  );
}

/**if (isPostCreated) {
    return <Success />;
  }

  if (isLoading) {
    return (
      <LoaderCustom className=" h-screen flex flex-col items-center justify-center space-y-4 p-6">
        <LoaderIcon className="h-12 w-12 animate-spin e drop-shadow-lg" />
        <h2 className="text-xl font-semibold tracking-wide text-center">
          Aguarde, estamos criando seu post...
        </h2>
        <p className="text-sm  text-center">Isso pode levar alguns segundos.</p>
      </LoaderCustom>
    );
  } */
