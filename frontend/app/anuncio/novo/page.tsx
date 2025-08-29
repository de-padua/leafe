"use client";
import Galery from "@/components/anuncio/galery";
import React, { HTMLElementType, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ParagraphNode, SerializedEditorState, TextNode } from "lexical";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Editor } from "@/components/blocks/editor-00/editor";
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
  ArrowRightIcon,
  Bath,
  Bed,
  ChevronDownIcon,
  ChevronUpIcon,
  Eclipse,
  EclipseIcon,
  Ruler,
} from "lucide-react";
import {
  Button as AriaButton,
  Group,
  Input as AriaInput,
  Label,
  NumberField,
} from "react-aria-components";

import { useForm } from "react-hook-form";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { AspectRatio, Select } from "radix-ui";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SizeIcon } from "@radix-ui/react-icons";

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

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "O título precisa ter no mínimo 5 caracteres" })
    .max(50, { message: "O título pode ter no máximo 50 caracteres" }),

  description: z
    .string()
    .min(10, { message: "A descrição precisa ter no mínimo 10 caracteres" })
    .max(700, { message: "A descrição pode ter no máximo 700 caracteres" }),

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

  // Quantitativos
  rooms: z.enum(["0", "1", "2", "3", "4", "5"], {
    required_error: "Você precisa selecionar quantos quartos o imóvel possui.",
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
  floors: z.enum(["terreo", "1", "2", "3", "4", "5"], {
    required_error: "Você precisa selecionar quantos andares o imóvel possui.",
  }),
  age: z.number().min(0, {
    message: "A idade do imóvel não pode ser negativa.",
  }),
  stage: z.number().min(0, {
    message: "O estágio do imóvel deve ser um número válido.",
  }),
  area: z.number().min(1, {
    message: "A área total deve ser maior que 0.",
  }),
  built: z.number().min(1, {
    message: "A área construída deve ser maior que 0.",
  }),

  // Booleanos (checkboxes)
  furnished: z.boolean(),
  pool: z.boolean(),
  gym: z.boolean(),
  security: z.boolean(),
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
});

function page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      street: "",
      city: "",
      estate: "",
      CEP: "",
      log: "",

      // Quantitativos (usar string pq seu schema usa z.enum)
      rooms: "1",
      bathrooms: "1",
      garage: "1",
      bedrooms: "1",
      floors: "1",
      age: 0,
      stage: 0,
      area: 0,
      built: 0,

      // Booleanos
      furnished: false,
      pool: false,
      gym: false,
      security: false,
      elevator: false,
      accessible: false,
      balcony: false,
      garden: false,
      barbecueArea: false,
      solarEnergy: false,
      library: false,
      wineCellar: false,
      airConditioning: false,
      smartHome: false,
      laundryRoom: false,
      gatedCommunity: false,
      alarmSystem: false,
      surveillanceCameras: false,
      fingerprintAccess: false,
      solarPanels: false,
      chargingStation: false,
      partyRoom: false,
      guestParking: false,
      petArea: false,
      bikeRack: false,
      coWorkingSpace: false,
      petFriendly: false,
    },
  });

  const [editorState, setEditorState] = useState<SerializedEditorState>();
  const [cepLoad, setCepLoad] = useState<boolean>(false);
  const [geo, setGeo] = useState<null | { lng: string; lat: string }>(null);
  const [adress, setAdress] = useState<null | string>(null);
  const getUserAdress = async (cep: string) => {
    setCepLoad(true);
    getCoordsByCEP(cep);
    try {
      const adress = await fetch(`http://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
      });

      const data = await adress.json();

      setCepLoad(false);

      const endereco = `${data.logradouro}, ${data.localidade}, ${data.uf}`;

      setAdress(endereco);

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
      console.error(err);
      setCepLoad(false);
    }
  };

  const x = form.watch("CEP");

  const cepRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      const formattedValue = formatarCep(ref.current.value);
      form.setValue("CEP", formattedValue);
    }
  };

  const formatarCep = (value: string) => {
    return value.replace(/\D/g, "");
  };

  useEffect(() => {
    if (x.length === 8) {
      getUserAdress(x);
    }

    console.log(form.getValues());
    handleInputChange(cepRef);
  }, [x]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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

  const andares = [
    { value: "terreo ", label: "Térreo" },
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
  ];

  async function getCoordsByCEP(cepreq: string) {
    setGeo(null);
    const cep = cepreq.slice(0, 7).concat("0");
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await viaCepRes.json();

    const endereco = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brasil`;

    console.log(data);
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        endereco
      )}&format=json&addressdetails=1&limit=1`
    );
    const geo = await nominatimRes.json();

    console.log(geo);
    if (geo.length === 0)
      throw new Error("Não foi possível encontrar coordenadas");

    setGeo({ lat: geo[0].lat, lng: geo[0].lon });
  }

  const isDark = "dark";

  // Palette (monochrome)
  const bg = isDark ? "#0b0b0c" : "#ffffff";
  const land = isDark ? "#111215" : "#f5f6f7";
  const water = isDark ? "#0e1116" : "#eef2f7";
  const park = isDark ? "#14171a" : "#eceff1";
  const building = isDark ? "#191c20" : "#e8eaed";

  // Strokes
  const primaryRoad = isDark ? "#fafafa" : "#111111";
  const secondaryRoad = isDark ? "#d1d5db" : "#6b7280";
  const minorRoad = isDark ? "#9ca3af" : "#9ca3af";
  const borderStroke = isDark ? "#22262b" : "#e5e7eb";

  // Label color
  const labelColor = isDark ? "#e5e7eb" : "#111827";
  const labelWeak = isDark ? "#9ca3af" : "#6b7280";

  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center flex-col ">
        <div className="relative   w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex justify-center items-start px-20"
            >
              <div className="w-3/5">
                <Main>
                  <Header>
                    <Title>Adicione um título</Title>
                    <Description>
                      Dê um título atraente para o seu anúncio.
                    </Description>
                  </Header>
                  <Body>
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
                      <Editor
                        editorSerializedState={editorState}
                        onSerializedChange={(value) => setEditorState(value)}
                      />{" "}
                    </div>
                  </Body>
                </Main>
                <Main className="h-fit">
                  <Header>
                    <Title>Valores e impostos</Title>
                    <Description>
                      Informe o preço de venda do imóvel e os impostos
                      aplicáveis. Esses valores ajudarão os interessados a
                      entender os custos totais.{" "}
                    </Description>
                  </Header>
                  <Body className="grid grid-cols-3 gap-4 h-fit">
                    <NumberField
                      defaultValue={0}
                      formatOptions={{
                        style: "currency",
                        currency: "BRL",
                        currencySign: "standard",
                      }}
                    >
                      <div className="*:not-first:mt-2">
                        <Label className="text-foreground text-sm font-medium">
                          Preço do imóvel{" "}
                          <span className="text-sm text-red-700">*</span>
                        </Label>
                        <Group className="border-input doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]">
                          <AriaInput className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums" />
                        </Group>
                      </div>
                    </NumberField>
                    <NumberField
                      defaultValue={0}
                      formatOptions={{
                        style: "currency",
                        currency: "BRL",
                        currencySign: "standard",
                      }}
                    >
                      <div className="*:not-first:mt-2">
                        <Label className="text-foreground text-sm font-medium">
                          Preço do Condomínio
                        </Label>
                        <Group className="border-input doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]">
                          <AriaInput className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums" />
                        </Group>
                      </div>
                    </NumberField>
                    <NumberField
                      defaultValue={0}
                      formatOptions={{
                        style: "currency",
                        currency: "BRL",
                        currencySign: "standard",
                      }}
                    >
                      <div className="*:not-first:mt-2">
                        <Label className="text-foreground text-sm font-medium">
                          IPTU <span className="text-sm text-red-700">*</span>
                        </Label>
                        <Group className="border-input doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]">
                          <AriaInput className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums" />
                        </Group>
                      </div>
                    </NumberField>
                    <Main></Main>
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
                    <Body>
                      <div className="grid grid-cols-3">
                        <div>
                          <Header>
                            <Title className="text-sm">
                              Dimenções do imóvel
                            </Title>
                            <Description className="text-xs">
                              Descreva as dimenções do imóvel
                            </Description>
                          </Header>
                          <div className="relative flex rounded-md shadow-xs w-fit">
                            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                              <SizeIcon />
                            </span>
                            <Input
                              id={"12"}
                              className="-me-px rounded-e-none ps-8 shadow-none"
                              placeholder="10m²"
                              type="text"
                            />
                            <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                              m²
                            </span>
                          </div>
                        </div>
                        <div className="">
                          <FormField
                            control={form.control}
                            name="pool"
                            render={({ field }) => (
                              <FormItem className="gap-0">
                                <FormLabel className="font-semibold text-sm text-muted-foreground m-0 ">
                                  Piscina
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="mx-2"
                                  />{" "}
                                </FormLabel>
                                <FormDescription className="text-muted-foreground text-xs">
                                  Descreva as dimenções da piscina
                                </FormDescription>
                                <FormControl>
                                  <div className="relative flex rounded-md shadow-xs w-fit my-2">
                                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                      <SizeIcon />
                                    </span>
                                    <Input
                                      disabled
                                      id={"12"}
                                      className="-me-px rounded-e-none ps-8 shadow-none"
                                      placeholder="10m²"
                                      type="text"
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
                      </div>
                    </Body>
                    <Body className=" grid grid-cols-4 ">
                      <FormField
                        control={form.control}
                        name="rooms"
                        render={({ field }) => (
                          <FormItem className="">
                            <FormLabel>
                              Quartos{" "}
                              <span className="text-sm text-red-700">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="gap-0 h-fit"
                              >
                                {rooms.map((item) => (
                                  <div
                                    className="px-3 flex items-center gap-2"
                                    key={item.value}
                                  >
                                    <RadioGroupItem
                                      value={item.value}
                                      id={item.label}
                                    />
                                    <Label
                                      className="text-sm"
                                      htmlFor={item.label}
                                    >
                                      {item.label}
                                    </Label>
                                  </div>
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
                              <span className="text-sm text-red-700">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="gap-0"
                              >
                                {banheiros.map((item) => (
                                  <div
                                    className="px-3 flex items-center gap-2"
                                    key={item.value}
                                  >
                                    <RadioGroupItem
                                      value={item.value}
                                      id={item.label}
                                    />
                                    <Label
                                      className="text-sm"
                                      htmlFor={item.label}
                                    >
                                      {item.label}
                                    </Label>
                                  </div>
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
                              <span className="text-sm text-red-700">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="gap-0"
                              >
                                {garagem.map((item) => (
                                  <div
                                    className="px-3 flex items-center gap-2"
                                    key={item.value}
                                  >
                                    <RadioGroupItem
                                      value={item.value}
                                      id={item.label}
                                    />
                                    <Label
                                      className="text-sm"
                                      htmlFor={item.label}
                                    >
                                      {item.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="floors"
                        render={({ field }) => (
                          <FormItem className="h-fit">
                            <FormLabel>
                              Quantidade de pisos do imóvel{" "}
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="gap-0"
                              >
                                {andares.map((item) => (
                                  <div
                                    className="px-3 flex items-center gap-2"
                                    key={item.value}
                                  >
                                    <RadioGroupItem
                                      value={item.value}
                                      id={item.label}
                                    />
                                    <Label
                                      className="text-sm"
                                      htmlFor={item.label}
                                    >
                                      {item.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Body>
                    <div className="grid grid-cols-4">
                      {amenities.map((i) => (
                        <div className="my-1" key={i.name}>
                          {i.form}
                        </div>
                      ))}
                    </div>
                  </Body>
                </Main>

                <Button>
                  Criar novo anúncio <Plus />
                </Button>
              </div>
              <div className="w-1/3">
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
                  {geo && (
                    <MapContainer
                      center={[parseFloat(geo.lat), parseFloat(geo.lng)]}
                      zoom={14}
                      style={{
                        filter: "contrast(99%) brightness(95%)",
                        width: "100%",
                        height: "300px",
                        borderRadius: "1rem",
                        overflow: "hidden",
                      }}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                        subdomains={["a", "b", "c", "d"]}
                      />
                      <Circle
                        center={[parseFloat(geo.lat), parseFloat(geo.lng)]}
                        radius={500}
                      />
                    </MapContainer>
                  )}
                  {geo ? null : (
                    <MapContainer
                      center={[-23.55052, -46.633308]}
                      zoom={14}
                      style={{
                        filter: "contrast(99%) brightness(95%)",
                        width: "100%",
                        height: "300px",
                        borderRadius: "1rem",
                        overflow: "hidden",
                      }}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                        subdomains={["a", "b", "c", "d"]}
                      />
                    </MapContainer>
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
                    <Galery />
                  </Body>
                </Main>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default page;

function Main({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot=""
      className={cn("w-full p-2 rounded-md ", className)}
      {...props}
    />
  );
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
      className={cn("my-2 p-4 border rounded-md shadow-xs  ", className)}
      {...props}
    />
  );
}
