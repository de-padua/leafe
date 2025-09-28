import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  isNumber,
  isBoolean,
  IsIn,
  IsArray,
} from 'class-validator';

export enum PropertyType {
  AP = 'AP',
  HOUSE = 'HOUSE',
  LAND = 'LAND',
  // adicione outros tipos se tiver no seu zodSchema
}
const allowedBanks = [
  "Itaú Unibanco",
  "Banco do Brasil",
  "Bradesco",
  "Caixa Econômica",
  "Santander Brasil",
  "BTG Pactual",
  "Sicredi",
  "Sicoob",
  "Banco Safra",
  "Citibank Brasil"
] as const;

export class UpdatePostDTO {
  @IsArray()
  @IsIn(allowedBanks, { each: true })
  financeBanks: string[];

  @IsString()
  @IsOptional()
  postId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  estate: string;

  @IsString()
  @IsOptional()
  CEP: string;

  @IsString()
  @IsOptional()
 
  log: string;

  // Enum
  @IsEnum(PropertyType)
  type: PropertyType;

  // Quantitativos (strings pq no seu form são enums "1","2","3"...)
  @IsNumber()
  @IsOptional()
  rooms: number;

  @IsNumber()
  @IsOptional()
  bathrooms: number;

  @IsNumber()
  @IsOptional()
  garage: number;

  @IsNumber()
  @IsOptional()
  bedrooms: number;

  @IsNumber()
  @IsOptional()
  floors: number;

  // Números
  @IsNumber()
  @IsOptional()
  @Min(0)
  age: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stage: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  area: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  built: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  pool_size: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  gatedCommunity_price: number;

  // Booleanos
  @IsBoolean()
  @IsOptional()
  furnished: boolean;

  @IsBoolean()
  @IsOptional()
  pool: boolean;

  @IsBoolean()
  @IsOptional()
  gym: boolean;

  @IsBoolean()
  @IsOptional()
  security: boolean;

  @IsBoolean()
  @IsOptional()
  elevator: boolean;

  @IsBoolean()
  @IsOptional()
  accessible: boolean;

  @IsBoolean()
  @IsOptional()
  balcony: boolean;

  @IsBoolean()
  @IsOptional()
  garden: boolean;

  @IsBoolean()
  @IsOptional()
  barbecueArea: boolean;

  @IsBoolean()
  @IsOptional()
  solarEnergy: boolean;

  @IsBoolean()
  @IsOptional()
  library: boolean;

  @IsBoolean()
  @IsOptional()
  wineCellar: boolean;

  @IsBoolean()
  @IsOptional()
  airConditioning: boolean;

  @IsBoolean()
  @IsOptional()
  smartHome: boolean;

  @IsBoolean()
  @IsOptional()
  laundryRoom: boolean;

  @IsBoolean()
  @IsOptional()
  gatedCommunity: boolean;

  @IsBoolean()
  @IsOptional()
  alarmSystem: boolean;

  @IsBoolean()
  @IsOptional()
  surveillanceCameras: boolean;

  @IsBoolean()
  @IsOptional()
  fingerprintAccess: boolean;

  @IsBoolean()
  @IsOptional()
  solarPanels: boolean;

  @IsBoolean()
  @IsOptional()
  chargingStation: boolean;

  @IsBoolean()
  @IsOptional()
  partyRoom: boolean;

  @IsBoolean()
  @IsOptional()
  guestParking: boolean;

  @IsBoolean()
  @IsOptional()
  petArea: boolean;

  @IsBoolean()
  @IsOptional()
  bikeRack: boolean;

  @IsBoolean()
  @IsOptional()
  coWorkingSpace: boolean;

  @IsBoolean()
  @IsOptional()
  petFriendly: boolean;
  @IsBoolean()
  @IsOptional()
  concierge: boolean;
  @IsBoolean()
  @IsOptional()
  backupGenerator: boolean;
  @IsBoolean()
  @IsOptional()
  waterReservoir: boolean;
  @IsBoolean()
  @IsOptional()
  serviceElevator: boolean;
  @IsBoolean()
  @IsOptional()
  coveredParking: boolean;
  @IsBoolean()
  @IsOptional()
  visitorParking: boolean;
  @IsBoolean()
  @IsOptional()
  carWash: boolean;
  @IsBoolean()
  @IsOptional()
  sportsCourt: boolean;
  @IsBoolean()
  @IsOptional()
  tennisCourt: boolean;
  @IsBoolean()
  @IsOptional()
  squashCourt: boolean;
  @IsBoolean()
  @IsOptional()
  soccerField: boolean;
  @IsBoolean()
  @IsOptional()
  skatePark: boolean;
  @IsBoolean()
  @IsOptional()
  runningTrack: boolean;
  @IsBoolean()
  @IsOptional()
  playground: boolean;
  @IsBoolean()
  @IsOptional()
  kidsRoom: boolean;
  @IsBoolean()
  @IsOptional()
  gameRoom: boolean;
  @IsBoolean()
  @IsOptional()
  cinemaRoom: boolean;
  @IsBoolean()
  @IsOptional()
  musicStudio: boolean;
  @IsBoolean()
  @IsOptional()
  spa: boolean;
  @IsBoolean()
  @IsOptional()
  sauna: boolean;
  @IsBoolean()
  @IsOptional()
  jacuzzi: boolean;
  @IsBoolean()
  @IsOptional()
  heatedPool: boolean;
  @IsBoolean()
  @IsOptional()
  indoorPool: boolean;
  @IsBoolean()
  @IsOptional()
  kidsPool: boolean;

  @IsBoolean()
  @IsOptional()
  communityGarden: boolean;
  @IsBoolean()
  @IsOptional()
  orchard: boolean;
  @IsBoolean()
  @IsOptional()
  meditationSpace: boolean;
  @IsBoolean()
  @IsOptional()
  hammockArea: boolean;
  @IsBoolean()
  @IsOptional()
  gourmetBarbecue: boolean;
  @IsBoolean()
  @IsOptional()
  pizzaOven: boolean;
  @IsBoolean()
  @IsOptional()
  firePit: boolean;
  @IsBoolean()
  @IsOptional()
  outdoorLounge: boolean;
  @IsBoolean()
  @IsOptional()
  panoramicDeck: boolean;
  @IsBoolean()
  @IsOptional()
  rooftop: boolean;
  @IsBoolean()
  @IsOptional()
  isFinan: boolean;
  @IsBoolean()
  @IsOptional()
  centralHeating: boolean;
  @IsBoolean()
  @IsOptional()
  centralCooling: boolean;
  @IsBoolean()
  @IsOptional()
  centralVacuum: boolean;
  @IsBoolean()
  @IsOptional()
  homeAutomation: boolean;
  @IsBoolean()
  @IsOptional()
  fiberInternet: boolean;
  @IsBoolean()
  @IsOptional()
  cableTvReady: boolean;
  @IsBoolean()
  @IsOptional()
  soundSystem: boolean;
  @IsBoolean()
  @IsOptional()
  smartLighting: boolean;
  @IsBoolean()
  @IsOptional()
  soundProofing: boolean;
  @IsBoolean()
  @IsOptional()
  securityRoom: boolean;
  @IsBoolean()
  @IsOptional()
  qrAccess: boolean;
  @IsBoolean()
  @IsOptional()
  facialRecognition: boolean;
  @IsBoolean()
  @IsOptional()
  panicButton: boolean;
  @IsBoolean()
  @IsOptional()
  automaticGate: boolean;

  @IsBoolean()
  @IsOptional()
  housekeeping: boolean;
  @IsBoolean()
  @IsOptional()
  laundryService: boolean;
  @IsBoolean()
  @IsOptional()
  coffeeShop: boolean;
  @IsBoolean()
  @IsOptional()
  miniMarket: boolean;
  @IsBoolean()
  @IsOptional()
  privateOffices: boolean;
  @IsBoolean()
  @IsOptional()
  deliveryRoom: boolean;
  @IsBoolean()
  @IsOptional()
  petCare: boolean;
  @IsBoolean()
  @IsOptional()
  carSharing: boolean;
  @IsBoolean()
  @IsOptional()
  bikeSharing: boolean;
  @IsBoolean()
  @IsOptional()
  driverLounge: boolean;
}
