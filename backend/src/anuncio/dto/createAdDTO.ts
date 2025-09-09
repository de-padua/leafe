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
  
  'itau',
  'bb',
  'bradesco',
  'caixa',
  'santander',
  'btg',
  'sicredi',
  'sicoob',
  'safra',
  'citibank',
] as const;

export class CreatePropertyDto {
  @IsArray()
  @IsIn(allowedBanks, { each: true })
  financeBanks: string[];

  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  estate: string;

  @IsString()
  @IsNotEmpty()
  CEP: string;

  @IsString()
  @IsOptional()
  log: string;

  // Enum
  @IsEnum(PropertyType)
  type: PropertyType;

  // Quantitativos (strings pq no seu form são enums "1","2","3"...)
  @IsNumber()
  rooms: number;

  @IsNumber()
  bathrooms: number;

  @IsNumber()
  garage: number;

  @IsNumber()
  bedrooms: number;

  @IsNumber()
  floors: number;

  // Números
  @IsNumber()
  @Min(0)
  age: number;

  @IsNumber()
  @Min(0)
  stage: number;

  @IsNumber()
  @Min(0)
  area: number;

  @IsNumber()
  @Min(0)
  built: number;

  @IsNumber()
  @Min(0)
  pool_size: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  gatedCommunity_price: number;

  // Booleanos
  @IsBoolean()
  furnished: boolean;

  @IsBoolean()
  pool: boolean;

  @IsBoolean()
  gym: boolean;

  @IsBoolean()
  security: boolean;

  @IsBoolean()
  elevator: boolean;

  @IsBoolean()
  accessible: boolean;

  @IsBoolean()
  balcony: boolean;

  @IsBoolean()
  garden: boolean;

  @IsBoolean()
  barbecueArea: boolean;

  @IsBoolean()
  solarEnergy: boolean;

  @IsBoolean()
  library: boolean;

  @IsBoolean()
  wineCellar: boolean;

  @IsBoolean()
  airConditioning: boolean;

  @IsBoolean()
  smartHome: boolean;

  @IsBoolean()
  laundryRoom: boolean;

  @IsBoolean()
  gatedCommunity: boolean;

  @IsBoolean()
  alarmSystem: boolean;

  @IsBoolean()
  surveillanceCameras: boolean;

  @IsBoolean()
  fingerprintAccess: boolean;

  @IsBoolean()
  solarPanels: boolean;

  @IsBoolean()
  chargingStation: boolean;

  @IsBoolean()
  partyRoom: boolean;

  @IsBoolean()
  guestParking: boolean;

  @IsBoolean()
  petArea: boolean;

  @IsBoolean()
  bikeRack: boolean;

  @IsBoolean()
  coWorkingSpace: boolean;

  @IsBoolean()
  petFriendly: boolean;
  @IsBoolean()
  concierge: boolean;
  @IsBoolean()
  backupGenerator: boolean;
  @IsBoolean()
  waterReservoir: boolean;
  @IsBoolean()
  serviceElevator: boolean;
  @IsBoolean()
  coveredParking: boolean;
  @IsBoolean()
  visitorParking: boolean;
  @IsBoolean()
  carWash: boolean;
  @IsBoolean()
  sportsCourt: boolean;
  @IsBoolean()
  tennisCourt: boolean;
  @IsBoolean()
  squashCourt: boolean;
  @IsBoolean()
  soccerField: boolean;
  @IsBoolean()
  skatePark: boolean;
  @IsBoolean()
  runningTrack: boolean;
  @IsBoolean()
  playground: boolean;
  @IsBoolean()
  kidsRoom: boolean;
  @IsBoolean()
  gameRoom: boolean;
  @IsBoolean()
  cinemaRoom: boolean;
  @IsBoolean()
  musicStudio: boolean;
  @IsBoolean()
  spa: boolean;
  @IsBoolean()
  sauna: boolean;
  @IsBoolean()
  jacuzzi: boolean;
  @IsBoolean()
  heatedPool: boolean;
  @IsBoolean()
  indoorPool: boolean;
  @IsBoolean()
  kidsPool: boolean;

  @IsBoolean()
  communityGarden: boolean;
  @IsBoolean()
  orchard: boolean;
  @IsBoolean()
  meditationSpace: boolean;
  @IsBoolean()
  hammockArea: boolean;
  @IsBoolean()
  gourmetBarbecue: boolean;
  @IsBoolean()
  pizzaOven: boolean;
  @IsBoolean()
  firePit: boolean;
  @IsBoolean()
  outdoorLounge: boolean;
  @IsBoolean()
  panoramicDeck: boolean;
  @IsBoolean()
  rooftop: boolean;
  @IsBoolean()
  isFinan: boolean;
  @IsBoolean()
  centralHeating: boolean;
  @IsBoolean()
  centralCooling: boolean;
  @IsBoolean()
  centralVacuum: boolean;
  @IsBoolean()
  homeAutomation: boolean;
  @IsBoolean()
  fiberInternet: boolean;
  @IsBoolean()
  cableTvReady: boolean;
  @IsBoolean()
  soundSystem: boolean;
  @IsBoolean()
  smartLighting: boolean;
  @IsBoolean()
  soundProofing: boolean;
  @IsBoolean()
  securityRoom: boolean;
  @IsBoolean()
  qrAccess: boolean;
  @IsBoolean()
  facialRecognition: boolean;
  @IsBoolean()
  panicButton: boolean;
  @IsBoolean()
  automaticGate: boolean;

  @IsBoolean()
  housekeeping: boolean;
  @IsBoolean()
  laundryService: boolean;
  @IsBoolean()
  coffeeShop: boolean;
  @IsBoolean()
  miniMarket: boolean;
  @IsBoolean()
  privateOffices: boolean;
  @IsBoolean()
  deliveryRoom: boolean;
  @IsBoolean()
  petCare: boolean;
  @IsBoolean()
  carSharing: boolean;
  @IsBoolean()
  bikeSharing: boolean;
  @IsBoolean()
  driverLounge: boolean;
}
