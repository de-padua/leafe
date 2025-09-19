"use client";

/* bug : fix pagination when changing categories and filters,set page to 1 again*/

dotenv.config();
import * as dotenv from "dotenv";
import { Imovel } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { use, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NotFoundCustom from "@/components/custom/NotFound";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Cross1Icon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  Calendar,
  CheckIcon,
  ChevronLeftSquare,
  ChevronsUpDownIcon,
  Cross,
  CrossIcon,
  Edit2,
  Eye,
  EyeClosed,
  EyeIcon,
  List,
  Package,
  PackageOpen,
  Pen,
  Rows3,
  Search,
  SearchIcon,
  Table2Icon,
  ToggleLeft,
  Trash,
  Undo2,
  X,
} from "lucide-react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "../input";
import { Skeleton } from "../skeleton";
import { Label } from "react-aria-components";
import { array, object } from "zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { data } from "@/components/custom/estate-filter";
import { useParams, useRouter, useSearchParams } from "next/navigation";
export const description = "An area chart with gradient fill";

export type ImovelPreview = {
  id: string;
  title: string;
  price: number;
  street: string;
  log: string;
  city: string;
  type: string;
  estate: string;
  isActive: boolean;
  CEP: string;
  userId: string;
};

function Dashboard() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const router = useRouter();
  const pageParams = useParams<{ page: string; status: string }>();
  const skeletonArray = Array.from({ length: 10 });

  const [currentPost, setCurrentPost] = useState<{
    paginationData: {};
    data: ImovelPreview;
  } | null>(null);

  const [openFilter, setOpenFilter] = React.useState(false);
  const [openTypeFilter, setOpenTypeFilter] = React.useState(false);
  const [openVisuFilter, setOpenVisuFilter] = React.useState(false);

  const filterOptionsList = [
    { label: "Mais relevantes", value: "" },
    { label: "Mais recentes", value: "createdAt" },
    { label: "Maior preço", value: "priceDesc" },
    { label: "Menor preço", value: "priceAsc" },
  ];

  const typeFilterOptionList = [
    { label: "Todos", value: "" },
    { label: "Apartamento", value: "AP" },
    { label: "Casa", value: "HOUSE" },
    { label: "Terreno", value: "LAND" },
  ];

  const visualizationOptionList = [
    { label: "Todos", value: "" },
    { label: "Ativo", value: "active" },
    { label: "Arquivados", value: "archived" },
  ];

  const [searchData, setSearchData] = useState<string | null>(
    params.get("search") ?? null
  );

  const [filterOption, setFilterOption] = useState(
    params.get("filterBy") ?? filterOptionsList[0].value
  );

  const [typeOption, setTypeOption] = useState(
    params.get("type") ?? typeFilterOptionList[0].value
  );

  const [visuOption, setCurrentOption] = useState(
    params.get("isActive") ?? visualizationOptionList[0].value
  );

  const [currentPage, setCurrentPage] = useState(params.get("page") ?? "1");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [visuOption, typeOption, filterOption, searchData, currentPage],
    queryFn: async () => {
      try {
        updateParams();

        const response = await fetch(
          `http://localhost:5000/dashboard/?${params}`,
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

        const data: {
          pagination: {
            pages: number;
            totalCount: number;
          };
          data: ImovelPreview[];
        } = await response.json();

        console.log(data);
        return data;
      } catch (err) {
        throw err;
      }
    },
  });

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [tempSearch, setTempSearch] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const formCurrency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  function updateParams() {
    let resetPage = false;

    // visuOption
    if (visuOption === "") {
      params.delete("isActive");
    } else {
      if (searchParams.get("isActive") !== visuOption) resetPage = true;
      params.set("isActive", visuOption);
    }

    // typeOption
    if (typeOption === "") {
      params.delete("type");
    } else {
      if (searchParams.get("type") !== typeOption) resetPage = true;
      params.set("type", typeOption);
    }

    // filterOption
    if (filterOption === "") {
      params.delete("filterBy");
    } else {
      if (searchParams.get("filterBy") !== filterOption) resetPage = true;
      params.set("filterBy", filterOption);
    }

    // searchData
    if (!searchData || searchData === "") {
      params.delete("search");
    } else {
      if (searchParams.get("search") !== searchData) resetPage = true;
      params.set("search", searchData);
    }

    // currentPage
    if (!currentPage || currentPage === "") {
      params.delete("page");
    } else if (!resetPage) {
      params.set("page", currentPage);
    }

    if (resetPage) {
      params.set("page", "1");
    }

    router.push(`/user/dashboard/imoveis?${params.toString()}`);
  }

  if (isLoading) {
    return (
      <div className="flex items-start justify-center min-h-screen">
        <div className="w-2/3 my-5  rounded-md">
          <SearchPageSkeleton />{" "}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-start justify-center min-h-screen">
        <div className="w-2/3 my-5  rounded-md">
          <SearchPageSkeleton />{" "}
        </div>
      </div>
    );
  }

  const page = parseInt(params.get("page") ?? "1") ;
  const perPage = 10;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, data.pagination.totalCount);

  const totalPages = Array.from({ length: data.pagination.pages });
  return (
    <div className="w-full">
      {data.data ? (
        <div className="flex  items-start justify-center  mask-linear-to-background">
          <div className="w-full   rounded-md">
            <div className=" my-4 flex justify-between  items-end gap-x-5">
              <div className="flex w-full items-center   ">
                <div className="w-1/2 flex items-center justify-center gap-x-2">
                  <Input
                    className="w-full"
                    placeholder=""
                    ref={searchInputRef}
                    type="search"
                    onChange={(e) => {
                      if (e.currentTarget.value !== "")
                        setTempSearch(e.currentTarget.value);
                    }}
                    defaultValue={searchData ? searchData : ""}
                  />

                  <Button
                    disabled={tempSearch ? false : true}
                    className=""
                    aria-label="clean search"
                    type="submit"
                    onClick={() => {
                      updateParams();
                      setSearchData(tempSearch);
                      setIsSearching(true);
                    }}
                  >
                    <SearchIcon />
                  </Button>

                  <div className="flex items-center justify-center gap-x-1 w-fit text-muted-foreground text-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-x-3">
                <div className="h-10 flex items-center justify-end">
                  <div className="flex items-center justify-center gap-x-2"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold my-1">
                    Tipo de imóvel :{" "}
                  </p>
                  <Popover
                    open={openTypeFilter}
                    onOpenChange={setOpenTypeFilter}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {typeFilterOptionList
                          ? typeFilterOptionList.find(
                              (framework) => framework.value === typeOption
                            )?.label
                          : "Mais recentes"}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {typeFilterOptionList.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                  setTypeOption(
                                    currentValue === typeOption
                                      ? ""
                                      : currentValue
                                  );

                                  updateParams();
                                  setTypeOption(currentValue);
                                  setOpenTypeFilter(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    typeOption === framework.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {framework.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div></div>
                <div>
                  <p className="text-xs font-semibold my-1">Ordenar por : </p>
                  <Popover open={openFilter} onOpenChange={setOpenFilter}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {filterOptionsList
                          ? filterOptionsList.find(
                              (framework) => framework.value === filterOption
                            )?.label
                          : "Mais relevantes"}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {filterOptionsList.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                  updateParams();
                                  console.log(currentValue);
                                  setFilterOption(
                                    currentValue === filterOption
                                      ? ""
                                      : currentValue
                                  );

                                  setFilterOption(currentValue);
                                  setOpenFilter(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    filterOption === framework.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {framework.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <div className="">
                    <p className="text-xs font-semibold my-1">
                      Visualização :{" "}
                    </p>
                  </div>
                  <div>
                    <Popover
                      open={openVisuFilter}
                      onOpenChange={setOpenVisuFilter}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[200px] justify-between"
                        >
                          {visualizationOptionList
                            ? visualizationOptionList.find(
                                (framework) => framework.value === visuOption
                              )?.label
                            : "Mais recentes"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {visualizationOptionList.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value.toString()}
                                  onSelect={(currentValue) => {
                                    updateParams();
                                    setCurrentOption(
                                      currentValue === "false"
                                        ? false
                                        : currentValue === "true"
                                        ? true
                                        : currentValue
                                    );

                                    setOpenVisuFilter(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      visuOption === framework.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {framework.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div></div>
            </div>
            <div className="flex items-end justify-between gap-x-2  my-7  ">
              <div className="flex items-center justify-center gap-x-1 ">
                {searchData ? (
                  <div className="">
                    <div className="flex items-center justify-center gap-x-2 relative ">
                      <p className=" font-semibold text-2xl">
                        Pesquisando por {searchData}{" "}
                      </p>
                      <Badge
                        className=" mt-2 cursor-pointer"
                        variant={"outline"}
                        onClick={() => {
                          setSearchData("");
                          setTempSearch(null);
                          updateParams();
                          searchInputRef.current
                            ? (searchInputRef.current.value = "")
                            : null;
                        }}
                      >
                        <ArrowLeftIcon />
                      </Badge>{" "}
                    </div>
                    <span className=" text-sm text-muted-foreground ">
                      {start} - {end} de {data.pagination.totalCount} resultados
                    </span>
                  </div>
                ) : (
                  <div className="">
                    <div className="flex items-center justify-start gap-x-1  ">
                      <p className=" font-semibold text-2xl mask-linear-to-background">
                        Mostrando todos os anúncios
                        {Object.entries(typeFilterOptionList).map((i) => {
                          if (i[1].value === typeOption && typeOption !== "") {
                            return (
                              <span
                                key={i[0]}
                                className="mask-linear-to-background"
                              >
                                {" "}
                                em {i[1].label.toLowerCase()}
                              </span>
                            );
                          }
                        })}
                      </p>
                    </div>
                    <span className=" text-sm text-muted-foreground ">
                      {start} - {end} de {data.pagination.totalCount} resultados
                    </span>
                  </div>
                )}

                <div></div>
              </div>
              <div className="flex items-start justify-center gap-x-2 mr-5">
                <div>
                  {Object.entries(typeFilterOptionList).map((i) => {
                    if (i[1].value === typeOption && typeOption !== "") {
                      return (
                        <div key={i[0]}>
                          <Badge
                            className="cursor-pointer"
                            onClick={() => {
                              updateParams();
                              setTypeOption("");
                            }}
                          >
                            {" "}
                            {i[1].label}
                            <Cross1Icon
                              className=" mt-[2px]"
                              width={3}
                              height={3}
                            />
                          </Badge>
                        </div>
                      );
                    }
                  })}
                </div>
                <div>
                  {Object.entries(filterOptionsList).map((i) => {
                    if (i[1].value === filterOption && filterOption !== "") {
                      return (
                        <div key={i[0]}>
                          <Badge
                            className="cursor-pointer"
                            onClick={() => {
                              updateParams();
                              setFilterOption("");
                            }}
                          >
                            {" "}
                            {i[1].label}
                            <Cross1Icon
                              className=" mt-[2px]"
                              width={3}
                              height={3}
                            />
                          </Badge>
                        </div>
                      );
                    }
                  })}
                </div>
                <div>
                  {Object.entries(visualizationOptionList).map((i) => {
                    if (i[1].value === visuOption && visuOption !== "") {
                      return (
                        <div key={i[0]}>
                          <Badge
                            className="cursor-pointer"
                            onClick={() => {
                              updateParams();
                              setCurrentOption(
                                visualizationOptionList[0].value
                              );
                            }}
                          >
                            {" "}
                            {i[1].label}
                            <Cross1Icon
                              className=" mt-[2px]"
                              width={3}
                              height={3}
                            />
                          </Badge>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            {isLoading ? (
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead className=" h-5 w-[100px]">
                      {" "}
                      <Skeleton className="h-5 w-[100px] rounded-sm" />
                    </TableHead>
                    <TableHead>
                      {" "}
                      <Skeleton className="h-5 w-[100px] rounded-sm" />
                    </TableHead>
                    <TableHead>
                      {" "}
                      <Skeleton className="h-5 w-[100px] rounded-sm" />
                    </TableHead>
                    <TableHead className="h-5 w-[100px] rounded-sm">
                      {" "}
                      <Skeleton className="h-5 w-[100px] rounded-sm" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skeletonArray.map((_, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {" "}
                          <Skeleton className="h-5 w-[100px] rounded-sm" />
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Skeleton className="h-5 w-[100px] rounded-sm" />
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Skeleton className="h-5 w-[100px] rounded-sm" />
                        </TableCell>
                        <TableCell className="text-right">
                          {" "}
                          <Skeleton className="h-5 w-[100px] rounded-sm" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Table className="p-4 text-muted-foreground ">
                <TableHeader>
                  <TableRow className="bg-">
                    <TableHead className=" ">Titulo</TableHead>
                    <TableHead className=" ">Preço</TableHead>
                    <TableHead className=" ">Tipo</TableHead>
                    <TableHead className="">Localização</TableHead>
                    <TableHead className="text-end">Status</TableHead>

                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {data?.data.map((post: ImovelPreview) => (
                    <TableRow
                      key={post.id}
                      onClick={() => {}}
                      className=" odd:bg-muted/50"
                    >
                      <TableCell className=" ">{post.title}</TableCell>
                      <TableCell>{formCurrency.format(post.price)}</TableCell>
                      <TableCell>
                        {post.type.toString() === "HOUSE" ? "Casa" : null}
                        {post.type.toString() === "AP" ? "Apartamento" : null}
                        {post.type.toString() === "LAND" ? "Terreno" : null}
                      </TableCell>
                      <TableCell>
                        {post.street} - {post.city} , {post.estate}
                      </TableCell>
                      <TableCell className="text-end">
                        {post.isActive ? (
                          <Badge
                            variant="outline"
                            className="gap-1.5 text-emerald-600"
                          >
                            <span
                              className="size-1.5 rounded-full bg-emerald-500"
                              aria-hidden="true"
                            ></span>
                            Ativo
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1.5 text-emerald-600"
                          >
                            <span
                              className="size-1.5 rounded-full bg-emerald-500"
                              aria-hidden="true"
                            ></span>
                            Ativo
                          </Badge>
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
                            <DropdownMenuItem>
                              {" "}
                              <Pen /> Editar anúncio
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {" "}
                              <EyeClosed /> Ocultar anúncio
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {" "}
                              <Archive /> Arquivar
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
                {data?.data.length === 0 ? (
                  <TableCaption>Nenhum anúncio encontrado</TableCaption>
                ) : null}
              </Table>
            )}
            <div className="my-4 flex items-center flex-col">
              <div className="text-sm my-4 text-muted-foreground">
                Mostrando 10 anúncios por página - Página {page} de {totalPages.length}
              </div>
             <div>
               {data.data.length === 0 ? null : (
                <Pagination className="cursor-pointer">
                  <PaginationContent>
                    <PaginationItem
                      onClick={() => {
                        page - 1 === 0
                          ? null
                          : setCurrentPage(
                              JSON.stringify(parseInt(currentPage) - 1)
                            );
                      }}
                    >
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    {page > 5 ? (
                      <PaginationItem
                        key={0}
                        onClick={() => setCurrentPage(String(1))}
                      >
                        <PaginationLink
                          isActive={1 === Number(params.get("page"))}
                        >
                          1 ...
                        </PaginationLink>
                      </PaginationItem>
                    ) : null}
                    {data.pagination.pages
                      ? Array.from(
                          { length: data.pagination.pages },
                          (_, i) => i + 1
                        )
                          .slice(data.pagination.pages, page)
                          .map((pageNumber) => (
                            <PaginationItem
                              key={pageNumber}
                              onClick={() => setCurrentPage(String(pageNumber))}
                            >
                              <PaginationLink
                                isActive={
                                  pageNumber === Number(params.get("page"))
                                }
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          ))
                      : null}
                    {data.pagination.pages
                      ? Array.from(
                          { length: data.pagination.pages },
                          (_, i) => i + 1
                        )
                          .slice(
                            (page > 5 ? page - 5 : 0),
                            (page > 5 ? page + 5 : 9)
                          )
                          .map((pageNumber) => (
                            <PaginationItem
                              key={pageNumber}
                              onClick={() => setCurrentPage(String(pageNumber))}
                            >
                              <PaginationLink
                                isActive={
                                  pageNumber === Number(params.get("page"))
                                }
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          ))
                      : null}

                    {page + 5 < (totalPages.length) ? (
                      <PaginationItem
                        key={data.pagination.pages} 
                        onClick={() =>
                          setCurrentPage(String(data.pagination.pages))
                        }
                      >
                        <PaginationLink
                          isActive={
                            data.pagination.pages === Number(params.get("page"))
                          }
                        >
                          ... {data.pagination.pages}
                        </PaginationLink>
                      </PaginationItem>
                    ) : null}
                    <PaginationItem
                      onClick={() => {
                        page + 1 > data.pagination.pages
                          ? null
                          : setCurrentPage(
                              JSON.stringify(parseInt(currentPage) + 1)
                            );
                      }}
                    >
                      <PaginationNext />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
             </div>
            </div>
          </div>
        </div>
      ) : (
        <SearchPageSkeleton />
      )}
    </div>
  );
}

export default Dashboard;

type CurrentPostProps = {
  imovel: ImovelPreview;
  handleSetCurrentPost: (imovel: null | ImovelPreview) => void;
};

const CurrentPost = ({ imovel, handleSetCurrentPost }: CurrentPostProps) => {
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
    <div>
      <div className="w-full border-b sticky top-0 z-40 py-5 bg-white flex items-center justify-between ">
        <div className=" space-x-2 mx-20">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/user">Usuário</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/user/dashboard/${imovel.userId}`}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/user/dashboard/${imovel.userId}`}>
                  Anúncios
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{imovel.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className=" flex items-center justify-center space-x-2 mx-20">
          {imovel.isActive ? (
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
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              handleSetCurrentPost(null);
            }}
          >
            Voltar <ChevronLeftSquare />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"default"} size={"sm"}>
                <Pen />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                {" "}
                <Pen /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                {" "}
                <EyeIcon /> Ocultar
              </DropdownMenuItem>
              <DropdownMenuItem>
                {" "}
                <Archive /> Arquivar
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive">
                <Trash /> Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full h-full px-20 my-5">
        <h2 className="text-2xl font-semibold">Detalhes do anúncio</h2>
        <p className="text-muted-foreground mb-4">
          Aqui você acompanha as informações do seu anúncio, métricas de
          desempenho e interessados no imóvel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
          <div className="flex flex-col items-start gap-2 p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between gap-2 w-full">
              <p className="text-sm text-muted-foreground">Status</p>

              <ToggleLeft
                className="text-muted-foreground"
                width={20}
                height={20}
              />
            </div>
            {imovel.isActive ? (
              <p className="text-sm">Ativo</p>
            ) : (
              <p className="text-sm"> Oculto</p>
            )}
            <span className="text-muted-foreground text-xs">
              Visível nos resultados de busca
            </span>
          </div>

          {/* Destaque */}

          <div className="flex flex-col items-start gap-2 p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between gap-2 w-full">
              <p className="text-sm text-muted-foreground">Destaque</p>

              <AwardIcon
                className="text-muted-foreground"
                width={20}
                height={20}
              />
            </div>
            {imovel.isFeatured ? (
              <p className="text-sm">Em destaque</p>
            ) : (
              <p className="text-sm">Normal</p>
            )}
            <span className="text-muted-foreground text-xs">
              Anúncio promovido para maior visibilidade
            </span>
          </div>

          {/* Publicado em */}
          <div className="flex flex-col items-start gap-2 p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between gap-2 w-full">
              <p className="text-sm text-muted-foreground">Publicado</p>

              <Calendar
                className="text-muted-foreground"
                width={20}
                height={20}
              />
            </div>
            <p className="font-medium text-sm">
              {new Date(imovel.postedAt).toLocaleDateString("pt-BR")}
            </p>
            <span className="text-xs text-muted-foreground">
              Data em que o anúncio foi criado
            </span>
          </div>

          {/* Última atualização */}
          <div className="flex flex-col items-start gap-2 p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between gap-2 w-full">
              <p className="text-sm text-muted-foreground">Atualização</p>

              <Edit2 className="text-muted-foreground" width={20} height={20} />
            </div>
            <p className="font-medium text-sm">
              {new Date(imovel.lastUpdate).toLocaleDateString("pt-BR")}
            </p>
            <span className="text-xs text-muted-foreground">
              Última modificação do anúncio
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 space-y-4 gap-x-10">
          <div className="">
            <h1 className="my-2 text-sm">Código do anúncio : {imovel.id}</h1>
            <h1 className="scroll-m-20 text-start text-4xl font-extrabold tracking-tight text-balance my-3">
              {imovel.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="my-5">
                <p className=" text-start text-2xl font-bold tracking-tight text-balance">
                  {formCurrency.format(imovel.price)}
                </p>
              </div>
              {imovel.gatedCommunity_price > 0 && (
                <div className="my-5">
                  <p className="text-sm text-end">Condomínio</p>
                  <p className=" text-start text-2xl font-bold tracking-tight text-balance">
                    {formCurrency.format(imovel.gatedCommunity_price)}{" "}
                    <span className="text-xs text-muted-foreground font-medium">
                      / Mês{" "}
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div
              className="my-5 text-sm"
              dangerouslySetInnerHTML={{ __html: imovel.description }}
            ></div>{" "}
            <div className=" w-full bg-white rounded-xl space-y-6 my-6  ">
              <div>
                {Object.keys(imovel).length < 1 ? null : (
                  <div>
                    <h1 className="text-2xl font-bold  mb-3 flex items-center">
                      <i className=""></i>
                      Detalhes do imóvel
                    </h1>

                    <div className="grid grid-cols-4">
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
                    </div>
                  </div>
                )}
              </div>
              {imovel.financeBanks.length > 0 ? (
                <div>
                  <h1 className="text-2xl font-bold  mb-3 flex items-center">
                    <i className=""></i>
                    Opções de Financiamento do Imóvel
                  </h1>

                  <div className="grid grid-cols-2 gap-2 w-fit">
                    {imovel.financeBanks.map((i) => (
                      <div key={i} className="text-xs px-2 py-2 w-fit">
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="">
                <h1 className="text-2xl font-bold  mb-3 flex items-center">
                  Localização
                </h1>
                <p className="text-sm ">{imovel.log}</p>
                <p className="text-sm text-muted-foreground ">
                  {imovel.street}, {imovel.city} - {imovel.estate} ,{" "}
                  {imovel.CEP}
                </p>
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

function SearchPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Barra de pesquisa */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-80 rounded-lg" /> {/* Input */}
        <Skeleton className="h-10 w-10 rounded-lg" /> {/* Botão */}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      {/* Resultados */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-60" /> {/* Texto "Pesquisando por..." */}
        <Skeleton className="h-4 w-40" /> {/* Texto "1-6 de x resultados" */}
      </div>

      {/* Tabela */}
      <div className="border rounded-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="grid grid-cols-5 gap-4 border-b bg-muted px-4 py-2">
          <Skeleton className="h-4 w-24" /> {/* Título */}
          <Skeleton className="h-4 w-16" /> {/* Preço */}
          <Skeleton className="h-4 w-16" /> {/* Tipo */}
          <Skeleton className="h-4 w-32" /> {/* Localização */}
          <Skeleton className="h-4 w-16" /> {/* Status */}
        </div>

        {/* Linhas */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 border-b px-4 py-3 items-center"
          >
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-12 rounded-full" /> {/* Status */}
              <Skeleton className="h-6 w-6 rounded-full" /> {/* Menu */}
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}
