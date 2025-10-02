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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { fa, id } from "zod/v4/locales";
import { useCacheStorage } from "@/lib/stores/userPostsCache";
import {
  BoxIcon,
  DotsVerticalIcon,
  FileIcon,
  RocketIcon,
  SizeIcon,
} from "@radix-ui/react-icons";

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

type Metadata = {
  [key: string]: string | number;
};
function EditGalery({ images }: { images: ImovelImages[] }) {
  const [openGalery, setOpenGalery] = useState<boolean>(false);

  const [currentImage, setCurrentImage] = useState<ImovelImages | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [current, setCurrent] = React.useState(0);

  const [api, setApi] = React.useState<CarouselApi>();
  const [api_2, setApi_2] = React.useState<CarouselApi>();

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
    overide(response.data);
  };

  const handleOpenGalery = (imovel: ImovelImages, index: number) => {
    setCurrent(index);
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

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on("scroll", (current) => {
      api_2.scrollTo(current.selectedScrollSnap());
      setCurrentImageIndex(current.selectedScrollSnap());
    });

    if (openGalery) {
      api.scrollTo(current, true);
      api_2.scrollTo(current, true);
      setCurrentImageIndex(current);

      document.body.style.overflow = "hidden"; 
    } else {
      setCurrent(0);
      setCurrentImageIndex(0);

      document.body.style.overflow = "";
    }

    console.log(current);
  }, [openGalery, api]);
  return (
    <div className=" ">
      {openGalery ? (
        <div className="fixed inset-0 z-50 bg-white  top-0 overflow-y-auto">
          <div className=" flex items-center justify-end  my-5  py-2 px-6 sticky top-0 bg-white z-50">
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
          </div>

          <div className="w-full flex items-center justify-center ">
            <div className="w-full  flex items-center justify-center flex-col ">
              <Carousel className="w-1/2 " setApi={setApi}>
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

              <Carousel className="w-9/12 my-2 " setApi={setApi_2}>
                <CarouselContent className=" ml-96 w-full h-full overflow-visible ">
                  {images.map((i, index) => (
                    <CarouselItem key={index} className="basis-1/15">
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
                        className={
                          currentImageIndex === index
                            ? "ring-2  p-1  rounded-md flex  w-[200px] aspect-square object-cover "
                            : "flex w-[100px] aspect-square p-2  rounded-2xl object-cover"
                        }
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
      ) : (
        <div>
          <Table
            className="rounded-md border-border w-full h-10 overflow-clip relative"
          >
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader className="sticky w-full top-0  z-10  bg-white h-10 border-b-2 border-border rounded-t-md  ">
              <TableRow>
                <TableHead className="w-[80px]">Imagem</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {images.map((i, index) => {
                return (
                  <TableRow
                    key={i.id}
                    className=" bg"
                    
                  >
                    <TableCell className="h-[70px]  " onClick={() => {
                      setCurrent(index);
                      setOpenGalery(true);
                    }}>
                      <div className="relative  h-full">
                        <Image
                          src={i.imageUrl}
                          fill
                          objectFit="cover"
                          className="  rounded-sm h-full"
                          alt={i.imageName}
                        />
                      </div>
                    </TableCell>

                    <TableCell onClick={() => {
                      setCurrent(index);
                      setOpenGalery(true);
                    }}>{i.imageType}</TableCell>
                    <TableCell onClick={() => {
                      setCurrent(index);
                      setOpenGalery(true);
                    }}>{i.imageSize}</TableCell>
                    <TableCell  className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size={"icon"} variant={"outline"}>
                            <DotsVerticalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              handleDeleteImage(i.id, i.imovelId);
                            }}
                          >
                            Remover imagem
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default EditGalery;