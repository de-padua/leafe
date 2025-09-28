"use client";
import { Imovel, ImovelImages } from "@/types";
import { ArrowLeft, Trash, XCircleIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { IconArrowLeftTail, IconArrowLeftToArc } from "@tabler/icons-react";
import { ScrollArea } from "../ui/scroll-area";
import EXIF from "exif-js";
import { CustomImovel } from "@/app/user/dashboard/edit/[editpage_postid]/page";
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
import { formatBytes } from "@/hooks/use-file-upload";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { error } from "console";
import { id } from "zod/v4/locales";
import { useCacheStorage } from "@/lib/stores/userPostsCache";
type Metadata = {
  [key: string]: string | number;
};

function EditGalery({
  images,
  data,
}: {
  images: ImovelImages[];
  data: CustomImovel;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [idsToDelet, setIdsToDelet] = useState<string[]>([]);
  const [openGalery, setOpenGalery] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<ImovelImages | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [api, setApi] = React.useState<CarouselApi>();
  const [api_2, setApi_2] = React.useState<CarouselApi>();

  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const overide = useCacheStorage((state) => state.overide);

  const handleDeleteImage = async (id: string, imovelId: string) => {
    
    const data = await fetch(`http://localhost:5000/anuncio/pictures`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        imovelId: imovelId,
      }),
    });
    const response = await data.json();

    console.log(response)
    overide(response.data);
  };

  const addIdToList = (currentId: string) => {
    if (!isDeleting) return;
    const checkDuplicates = idsToDelet.find((i) => i === currentId);
    if (checkDuplicates) return;
    setIdsToDelet((oldValue) => [...oldValue, currentId]);
  };

  const handleRemoveItem = (currentId: string) => {
    const filteredList = idsToDelet.filter((i) => i !== currentId);
    setIdsToDelet(filteredList);
  };

  const handleDeleteImages = () => {
    alert("deleting...");
  };

  const handleOpenGalery = (imovel: ImovelImages) => {
    setCurrentImage(imovel);
    setOpenGalery(true);
  };

  const setCurrentImageToApi = (index: number) => {
    if (!api) {
      return;
    }
    api.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    if (!api_2) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on("scroll", (current) => {
      api_2.scrollTo(current.selectedScrollSnap());
    });

    if (openGalery) {
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = ""; // reset scroll
    }
  }, [openGalery, api]);

  if (openGalery)
    return (
      <div className="fixed inset-0 z-50 bg-white  top-0 overflow-y-auto">
        <div className=" flex items-center justify-between  mb-5  py-2 px-6 sticky top-0 bg-white z-50">
          <Button
            variant={"outline"}
            className={"cursor-pointer"}
            size={"icon"}
            onClick={() => {
              setOpenGalery(false);
            }}
          >
            <ArrowLeft />
          </Button>

          <div className="line-clamp-1 pl-10">
            <p className="line-clamp-1 whitespace-pre"> {data.title}</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center ">
          <div className="w-1/2  flex items-center justify-center flex-col ">
            <Carousel className="" setApi={setApi}>
              <CarouselContent>
                {images.map((i, index) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <Image
                      onClick={() => {
                        setCurrentImage(i);
                        setCurrentImageIndex(index);
                      }}
                      key={i.id}
                      src={i.imageUrl}
                      width={1000}
                      height={1000}
                      className="w-[700px] aspect-square object-contain bg-accent border rounded-md"
                      alt="image from ad"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />

              <CarouselNext />
            </Carousel>

            <Carousel className=" w-1/2 my-5" setApi={setApi_2}>
              <CarouselContent>
                {images.map((i, index) => (
                  <CarouselItem key={index} className="flex  basis-1/5">
                    <Image
                      onClick={() => {
                        setCurrentImageToApi(index);
                        setCurrentImage(i);
                        setCurrentImageIndex(index);
                      }}
                      key={i.id}
                      src={i.imageUrl}
                      width={1000}
                      height={1000}
                      className="w-[100px] aspect-square "
                      alt="image from ad"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="text-muted-foreground py-2 text-center text-sm">
              Imagem {current} de {images.length}
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex items-center justify-center p-2 rounded-md  w-full">
      <div className="w-full ">
        {images.map((i, index) => (
          <div
            onClick={() => {
              addIdToList(i.id);
            }}
            key={i.id}
            className={
              idsToDelet.includes(i.id)
                ? " flex items-center relative justify-between bg-accentcursor-pointer my-2 border p-2 rounded-md bg-neutral-100"
                : " flex items-center relative justify-between bg-accentcursor-pointer my-2 border p-2 rounded-md bg-neutral-50/50 text-muted-foreground cursor-pointer "
            }
          >
            <span
              className=" w-full "
              onClick={() => {
                handleOpenGalery(i);
                setCurrentImageIndex(index);
              }}
            >
              <ImageWrapper image={i} />
            </span>
            <div className=" flex items-center justify-end w-30 ">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className={"cursor-pointer"}
                    size={"icon"}
                    onClick={() => {
                      handleRemoveItem(i.id);
                    }}
                  >
                    <XCircleIcon className="text-muted-foreground" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Ela excluirá
                      permanentemente a imagem de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleDeleteImage(i.id, i.imovelId);
                      }}
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between "></div>
      </div>
    </div>
  );
}

function ImageWrapper({ image }: { image: ImovelImages }) {
  return (
    <div className="flex items-start justify-start gap-x-1 w-full">
      <Image
        src={image.imageUrl}
        width={70}
        height={70}
        className="w-[70px] h-full aspect-square rounded-md object-cover"
        alt="image from ad"
      />

      <div className="text-xs flex-1">
        <p className="truncate 2xl:max-w-4/6 lg:max-w-1/3 md:w-[50px]">
          {image.imageName}
        </p>
        <p className="line-clamp-1">{image.imageType}</p>
        <p>{formatBytes(image.imageSize)}</p>
      </div>
    </div>
  );
}

export default EditGalery;

/**  <div className="">
            <Image
              src={currentImage ? currentImage.imageUrl : images[0].imageUrl}
              width={1000}
              height={1000}
              className="w-[500px] h-full aspect-square object-contain border bg-accent rounded-md"
              alt="image from ad"
            />
            <div className="my-2 space-y-[1px] text-sm   ">
              {currentImage && (
                <div className="flex items-center justify-start gap-x-1">
                  <p className="font-semibold">Titulo :</p>{" "}
                  <span className="text-muted-foreground">
                    {currentImage.imageName}
                  </span>
                </div>
              )}
              {currentImage && (
                <div className="flex items-center justify-start gap-x-1">
                  <p className="font-semibold">Tipo de arquivo :</p>{" "}
                  <span className="text-muted-foreground">
                    {currentImage.imageType}
                  </span>
                </div>
              )}
              {currentImage && (
                <div className="flex items-center justify-start gap-x-1">
                  <p className="font-semibold">Tamanho :</p>{" "}
                  <span className="text-muted-foreground">
                    {formatBytes(currentImage.imageSize)}
                  </span>
                </div>
              )}
              <div className="my-2">
                <Button>
                  Apagar foto <Trash />{" "}
                </Button>
              </div>
            </div>
          </div> */
