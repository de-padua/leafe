"use client";
import Galery from "@/components/anuncio/galery";
import React, {
  HTMLElementType,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
  DollarSignIcon,
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
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { v4 as uuidv4 } from "uuid";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { FileWithPreview } from "@/hooks/use-file-upload";
import supaclient from "@/supabase";
import { _uuidv4 } from "zod/v4/core";

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

const formSchema = z
  .object({
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
    floors: z.enum(["terreo", "1", "2", "3", "4", "5"], {
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
    pool_size: z.coerce.number().optional(),
    gatedCommunity_price: z.coerce.number(),

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
  })
  .superRefine((data, ctx) => {
    if (data.type === "casa" && !data.area) {
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
    if (data.type === "ap" && !data.built) {
      ctx.addIssue({
        path: ["built"],
        code: z.ZodIssueCode.custom,
        message: "Área construída é obrigatória para apartamento.",
      });
    }
    if (data.type === "terreno" && !data.area) {
      ctx.addIssue({
        path: ["area"],
        code: z.ZodIssueCode.custom,
        message: "Área é obrigatória para terreno.",
      });
    }
  });

function page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "aaaaaaaaaa",
      street: "",
      city: "",
      estate: "",
      CEP: "",
      log: "",
      type: "HOUSE",
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
      pool_size: 0,
      price: 0,
      gatedCommunity_price: 0,
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
  const [adFiles, setFiles] = useState<FileWithPreview[]>([]);

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

    handleInputChange(cepRef);
  }, [x]);

 async function onSubmit(values: z.infer<typeof formSchema>) {
  if (adFiles.length === 0) {
    form.setError("root", {
      message: "Envie pelo menos uma foto do imóvel.",
    });
    return;
  }

  const postId = uuidv4();

  const adBody = {
    ...values,
    postId,
    rooms: Number(values.rooms),
    bathrooms: Number(values.bathrooms),
    garage: Number(values.garage),
    bedrooms: Number(values.bedrooms),
    floors: Number(values.floors),
  };

  // 🔹 Primeiro cria o anúncio
  const data = await fetch(`http://localhost:5000/anuncio`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adBody),
  });

  const response = await data.json();
  console.log("Anúncio criado:", response);

  if (!response.success) {
    form.setError("root", {
      message: "Erro ao criar anúncio. Tente novamente.",
    });
    return;
  }

  const isPicturesUploaded = await sendPictures(adFiles, postId);

  if (isPicturesUploaded.data.success !== "ok") {
    form.setError("root", {
      message: "Erro ao enviar imagens. Tente novamente.",
    });
    return;
  }

  console.log("Imagens enviadas com sucesso!");
}

  async function sendPictures(files: FileWithPreview[], postId: string) {
    const formData = new FormData();

    adFiles.forEach((photo) => {
      formData.append("files", photo.file as File)
      formData.append("id", postId); 
    });

    const data = await fetch(`http://localhost:5000/anuncio/pictures`, {
      method: "POST",
      credentials: "include",

      body: formData,
    });
    const response = await data.json();

    console.log(response);
    return response;
  }


  type FormValues = z.infer<typeof formSchema>;

  const handleNumericFields = (value: any, formName: keyof FormValues) => {
    form.setValue(formName, value);
  };

  const types = [
    {
      value: "AP",
      label: "Apartamento",
      sublabel: "Unidade autônoma em condomínio",
      description:
        "Ideal para quem busca praticidade e segurança. Apartamentos geralmente oferecem amenities como piscina, academia e área de lazer.",
      svg: (
        <svg
          className="shrink-0"
          width={32}
          height={24}
          viewBox="0 0 32 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="32" height="24" rx="4" fill="#252525" />
          {/* Edifício */}
          <rect x="8" y="6" width="16" height="14" fill="#FF5A00" rx="1" />
          {/* Janelas - Andar superior */}
          <rect x="11" y="8" width="2" height="2" fill="#F79E1B" rx="0.5" />
          <rect x="15" y="8" width="2" height="2" fill="#F79E1B" rx="0.5" />
          <rect x="19" y="8" width="2" height="2" fill="#F79E1B" rx="0.5" />
          {/* Janelas - Andar médio */}
          <rect x="11" y="12" width="2" height="2" fill="#F79E1B" rx="0.5" />
          <rect x="15" y="12" width="2" height="2" fill="#F79E1B" rx="0.5" />
          <rect x="19" y="12" width="2" height="2" fill="#F79E1B" rx="0.5" />
          {/* Janelas - Andar inferior */}
          <rect x="11" y="16" width="2" height="2" fill="#F79E1B" rx="0.5" />
          <rect x="15" y="16" width="2" height="2" fill="#F79E1B" rx="0.5" />
          <rect x="19" y="16" width="2" height="2" fill="#F79E1B" rx="0.5" />
          {/* Porta de entrada */}
          <rect x="13.5" y="17" width="5" height="3" fill="#EB001B" rx="0.5" />
        </svg>
      ),
    },
    {
      value: "HOUSE",
      label: "Casa",
      sublabel: "Imóvel residencial independente",
      description:
        "Perfeita para famílias que valorizam privacidade e espaço. Casas oferecem maior área útil, quintal e mais liberdade para personalização.",
      svg: (
        <svg
          className="shrink-0"
          width={32}
          height={24}
          viewBox="0 0 32 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="32" height="24" rx="4" fill="#252525" />
          {/* Casa */}
          <path
            d="M16 6L8 12V20H12V16H20V20H24V12L16 6Z"
            fill="#FF5A00"
            stroke="#EB001B"
            strokeWidth="0.5"
          />
          {/* Porta */}
          <rect x="14" y="14" width="4" height="6" fill="#EB001B" />
          {/* Janela esquerda */}
          <rect x="10" y="14" width="2" height="2" fill="#F79E1B" />
          {/* Janela direita */}
          <rect x="20" y="14" width="2" height="2" fill="#F79E1B" />
          {/* Detalhe do telhado */}
          <path
            d="M8 12L16 6L24 12"
            stroke="#F79E1B"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
      ),
    },
    {
      value: "LAND",
      label: "Terreno",
      sublabel: "Área livre para construção",
      description:
        "Opportunidade para construir seu imóvel do zero. Terrenos permitem total customização e são ideais para investidores e quem quer criar um projeto personalizado.",
      svg: (
        <svg
          className="shrink-0"
          width={32}
          height={24}
          viewBox="0 0 32 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="32" height="24" rx="4" fill="#252525" />
          {/* Terreno com formato orgânico */}
          <path
            d="M9 14Q8 12 10 10Q12 8 16 8Q20 8 22 10Q24 12 23 14Q22 16 20 17Q18 18 16 18Q14 18 12 17Q10 16 9 14Z"
            fill="#FF5A00"
          />

          {/* Cerca/marcação do terreno */}
          <path
            d="M10 11Q12 9 16 9Q20 9 22 11"
            stroke="#EB001B"
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M9 14Q11 16 16 16Q21 16 23 14"
            stroke="#EB001B"
            strokeWidth="0.8"
            fill="none"
          />

          {/* Elementos naturais */}
          {/* Árvore 1 */}
          <rect x="12" y="12" width="1" height="3" fill="#EB001B" />
          <circle cx="12.5" cy="10" r="2" fill="#F79E1B" />

          {/* Árvore 2 */}
          <rect x="19" y="11" width="1" height="2" fill="#EB001B" />
          <circle cx="19.5" cy="9" r="1.5" fill="#F79E1B" />

          {/* Pedras/marcadores */}
          <circle cx="14" cy="14" r="0.8" fill="#EB001B" />
          <circle cx="18" cy="13" r="0.6" fill="#EB001B" />
        </svg>
      ),
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

  const andares = [
    { value: "terreo", label: "Térreo" },
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

  const getFiles = async (files: FileWithPreview[]) => {
    setFiles(files);
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

    if (geo.length === 0)
      throw new Error("Não foi possível encontrar coordenadas");

    setGeo({ lat: geo[0].lat, lng: geo[0].lon });
  }

  const isDark = "dark";

  const formatCurrency = (value: string | number): string => {
    // Converte para número se for string
    const numberValue =
      typeof value === "string"
        ? Number(value.replace(/\D/g, "")) / 100
        : value;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
  };

  const [value, setValue] = useState<Content>(null);

  useEffect(() => {
    const isPoolMarked = form.watch("pool");
    const isGatedComunity = form.watch("gatedCommunity");

    if (!isPoolMarked) form.setValue("pool_size", 0);
    if (!isGatedComunity) form.setValue("gatedCommunity_price", 0);
  }, []);

  return (
    <div className="">
      <Main>
        <Header>
          <Title>🏡 Anuncie seu imóvel</Title>
          <Description>
            Em poucos passos você poderá criar um anúncio completo do seu
            imóvel. Informe o título, descrição, valores, características e
            adicione fotos para aumentar suas chances de venda ou aluguel.
          </Description>
        </Header>
      </Main>
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
                      <MinimalTiptapEditor
                        value={value}
                        onChange={(value) => {
                          form.setValue("description", value as string);
                        }}
                        className="w-full"
                        editorContentClassName="p-5"
                        output="html"
                        placeholder="Descreva a propiedade"
                        editable={true}
                        editorClassName="focus:outline-hidden"
                      />
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
                  <Body className="grid grid-cols-3">
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
                            <div className="relative flex rounded-md shadow-xs w-fit my-2">
                              <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                <DollarSignIcon className="h-4 w-4" />
                              </span>
                              <Input
                                {...field}
                                value={formatCurrency(field.value || "")}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Remove tudo que não é número
                                  const numericValue = value.replace(/\D/g, "");
                                  // Converte para número e divide por 100 para ter decimais
                                  const numberValue = numericValue
                                    ? Number(numericValue) / 100
                                    : "";
                                  handleNumericFields(numberValue, "price");
                                }}
                                onBlur={(e) => {
                                  // Garante que o valor fique formatado ao sair do campo
                                  const value = e.target.value;
                                  const numericValue = value.replace(/\D/g, "");
                                  const numberValue = numericValue
                                    ? Number(numericValue) / 100
                                    : "";
                                  field.onChange(numberValue);
                                }}
                                className="-me-px rounded-e-none ps-8 shadow-none"
                                placeholder="R$ 0,00"
                              />

                              <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                                BRL
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
                                    <div className="relative flex rounded-md shadow-xs w-fit my-2">
                                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                        <DollarSignIcon className="h-4 w-4" />
                                      </span>
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
                                          // Remove tudo que não é número
                                          const numericValue = value.replace(
                                            /\D/g,
                                            ""
                                          );
                                          // Converte para número e divide por 100 para ter decimais
                                          const numberValue = numericValue
                                            ? Number(numericValue) / 100
                                            : "";
                                          handleNumericFields(
                                            numberValue,
                                            "gatedCommunity_price"
                                          );
                                        }}
                                        onBlur={(e) => {
                                          // Garante que o valor fique formatado ao sair do campo
                                          const value = e.target.value;
                                          const numericValue = value.replace(
                                            /\D/g,
                                            ""
                                          );
                                          const numberValue = numericValue
                                            ? Number(numericValue) / 100
                                            : "";
                                          field.onChange(numberValue);
                                        }}
                                        className={
                                          form.getValues().gatedCommunity
                                            ? "-me-px rounded-e-none ps-8 shadow-none"
                                            : "-me-px rounded-e-none ps-8 shadow-none text-muted-foreground"
                                        }
                                        placeholder="R$ 0,00"
                                      />

                                      <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                                        BRL
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
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-0 gap-0">
                          <FormLabel className="text-sm">
                            Tipo de imóvel
                            <span className="text-sm text-red-700 mx-2">*</span>
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Selecione o tipo de imóvel
                          </FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="gap-x-2 grid grid-cols-3 my-2"
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
                    <Body>
                      <div className="grid grid-cols-3">
                        {["HOUSE", "AP"].includes(form.watch().type) && (
                          <div>
                            <FormField
                              control={form.control}
                              name="built"
                              render={({ field }) => (
                                <FormItem className="gap-0">
                                  <FormLabel
                                    className={"font-semibold text-sm  m-0 "}
                                  >
                                    Área construída do imóvel{" "}
                                    <span className="text-sm text-red-700">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormDescription
                                    className={"text-muted-foreground text-xs"}
                                  >
                                    Descreva as dimenções da área construída
                                    imóvel
                                  </FormDescription>
                                  <FormControl>
                                    <div className="relative flex rounded-md shadow-xs w-fit my-2">
                                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                        <SizeIcon />
                                      </span>
                                      <Input
                                        {...field}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^[0-9]*$/.test(value)) {
                                            handleNumericFields(value, "built");
                                          }
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
                                    className={"font-semibold text-sm  m-0 "}
                                  >
                                    Área da propiedade{" "}
                                  </FormLabel>
                                  <FormDescription
                                    className={"text-muted-foreground text-xs"}
                                  >
                                    Descreva as dimenções da propiedade
                                  </FormDescription>
                                  <FormControl>
                                    <div className="relative flex rounded-md shadow-xs w-fit my-2">
                                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                        <SizeIcon />
                                      </span>
                                      <Input
                                        {...field}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^[0-9]*$/.test(value)) {
                                            handleNumericFields(value, "area");
                                          }
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
                          <div className="">
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
                                  <FormControl>
                                    <FormField
                                      control={form.control}
                                      name="pool_size"
                                      render={({ field }) => (
                                        <FormItem className="">
                                          <FormControl>
                                            <div className="relative flex rounded-md shadow-xs w-fit my-2">
                                              <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm mr-1">
                                                <SizeIcon />
                                              </span>
                                              <Input
                                                {...field}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (/^[0-9]*$/.test(value)) {
                                                    handleNumericFields(
                                                      value,
                                                      "pool_size"
                                                    );
                                                  }
                                                }}
                                                disabled={
                                                  form.getValues().pool === true
                                                    ? false
                                                    : true
                                                }
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
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
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
                      {["casa"].includes(form.watch().type) && (
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
                      )}
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
                    <Title
                      className={
                        form.formState.errors.root ? "text-red-400" : ""
                      }
                    >
                      Adicione fotos do imóvel
                    </Title>
                    <Description>
                      Mostre seu imóvel da melhor forma com fotos de qualidade{" "}
                    </Description>
                  </Header>
                  <Body
                    className={
                      form.formState.errors.root ? "border-red-400" : ""
                    }
                  >
                    <Galery getFiles={getFiles} />
                    {form.formState.errors.root && (
                      <p className="text-xs text-red-400 my-2">
                        {form.formState.errors.root.message}
                      </p>
                    )}
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
