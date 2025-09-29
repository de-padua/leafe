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
function GaleryWithThumbs({
  images,
  handleCloseGalery,
}: {
  images: ImovelImages[];
  handleCloseGalery: () => void;
}) {
  const [openGalery, setOpenGalery] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<ImovelImages | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [api, setApi] = React.useState<CarouselApi>();
  const [api_2, setApi_2] = React.useState<CarouselApi>();

  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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
  return (
    <div className="fixed inset-0 z-50 bg-white  top-0 overflow-y-auto">
      <div className=" flex items-center justify-between  mb-5  py-2 px-6 sticky top-0 bg-white z-50">
        <Button
          variant={"outline"}
          className={"cursor-pointer"}
          size={"icon"}
          onClick={() => {
            handleCloseGalery();
          }}
        >
          <ArrowLeft />
        </Button>
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
                <CarouselItem key={index} className="flex  basis-1/7">
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
}

export default GaleryWithThumbs;
