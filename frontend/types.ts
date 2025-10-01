export type User = {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  imoveis?: Imovel[];
  session?: Session | null;
  createdAt: Date;
  token: string;
  profilePictureUrl: string;
  bio: string;
  preferences?: "all" | "verified";
  metadata: AccountMetadata;
  recoveryEmail: string;
  recoveryPhone: string;
  lastUpdateOnRecoveryEmail: Date | null;
  lastUpdateOnPassword: Date | null;
  recoveryEmailChangeAvailableWhen: Date;
  recoveryCodes: {
    id: string;
    code: string;
    isUsed: boolean;
    userId: string;
  }[];
};

export type recoveryCode = {
  id: string;
  code: string;
  isUsed: boolean;
  userId: string;
};

export type AccountMetadata = {
  id: string;
  userId: string;
  recoveryCodesGenerated: boolean;
  // Autenticação
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;

  // Rastreamento
  registrationIp: string | null;
  registrationDevice: string | null;
  deviceHash: string | null;

  // Atividades
  lastLogin: Date | null;
  lastLoginIp: string | null;
  loginCount: number;
  failedLoginAttempts: number;

  // Controle de versão
  profileVersion: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Segurança
  accountLockedUntil: Date | null;
};

export type PaginationInfo = {
  currentPage: number;
  itemsPerPage: number;
  firstItemOnPage: number;
  lastItemOnPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage?: boolean; // Optional, if you want to track previous page
};

export type UserWithoutProperties = {
  id: string;
  email: string;
  password?: string;
  session?: Session | null;
  createdAt: Date;
  imoveisTotalLenght: number;
  firstName: string;
  lastName: string;
};

export enum PropertyType {
  AP,
  HOUSE,
  LAND,
}
export type Session = {
  id: string;
  userId: string;
  user?: User;
};
export type Imovel = {
  id: string;
  title: string;
  postedAt: Date;
  lastUpdate: Date;
  description: string;
  postId: string;

  type: PropertyType;

  log: string;
  street: string;
  estate: string;
  city: string;
  CEP: string;

  price: number;

  rooms: number;
  bathrooms: number;
  garage: number;
  bedrooms: number;
  floors: number;
  age: number;
  stage: number;
  pool_size: number;
  gatedCommunity_price: number;

  furnished: boolean;
  pool: boolean;
  gym: boolean;
  security: boolean;
  elevator: boolean;
  accessible: boolean;
  balcony: boolean;
  garden: boolean;
  barbecueArea: boolean;
  solarEnergy: boolean;
  library: boolean;
  wineCellar: boolean;
  airConditioning: boolean;
  smartHome: boolean;
  laundryRoom: boolean;
  gatedCommunity: boolean;
  alarmSystem: boolean;
  surveillanceCameras: boolean;
  fingerprintAccess: boolean;
  solarPanels: boolean;
  chargingStation: boolean;
  partyRoom: boolean;
  guestParking: boolean;
  petArea: boolean;
  bikeRack: boolean;
  coWorkingSpace: boolean;
  petFriendly: boolean;

  concierge: boolean;
  backupGenerator: boolean;
  waterReservoir: boolean;
  serviceElevator: boolean;
  coveredParking: boolean;
  visitorParking: boolean;
  carWash: boolean;

  sportsCourt: boolean;
  tennisCourt: boolean;
  squashCourt: boolean;
  soccerField: boolean;
  skatePark: boolean;
  runningTrack: boolean;
  playground: boolean;
  kidsRoom: boolean;
  gameRoom: boolean;
  cinemaRoom: boolean;
  musicStudio: boolean;
  spa: boolean;
  sauna: boolean;
  jacuzzi: boolean;
  heatedPool: boolean;
  indoorPool: boolean;
  kidsPool: boolean;

  communityGarden: boolean;
  orchard: boolean;
  meditationSpace: boolean;
  hammockArea: boolean;
  gourmetBarbecue: boolean;
  pizzaOven: boolean;
  firePit: boolean;
  outdoorLounge: boolean;
  panoramicDeck: boolean;
  rooftop: boolean;

  centralHeating: boolean;
  centralCooling: boolean;
  centralVacuum: boolean;
  homeAutomation: boolean;
  fiberInternet: boolean;
  cableTvReady: boolean;
  soundSystem: boolean;
  smartLighting: boolean;
  soundProofing: boolean;

  securityRoom: boolean;
  qrAccess: boolean;
  facialRecognition: boolean;
  panicButton: boolean;
  automaticGate: boolean;

  housekeeping: boolean;
  laundryService: boolean;
  coffeeShop: boolean;
  miniMarket: boolean;
  privateOffices: boolean;
  deliveryRoom: boolean;
  petCare: boolean;
  carSharing: boolean;
  bikeSharing: boolean;
  driverLounge: boolean;

  area: number;
  built: number;

  isFinan: boolean;
  financeBanks: string[];

  views: number;
  isActive: boolean;
  isFeatured: boolean;

  userId: string;
  user: UserWithoutProperties; // assumindo que já existe um tipo User
  imovelImages: ImovelImages[];
};

export type ImovelImages = {
  id: string;
  imageUrl: string;
  imovelId: string;
  imovel?: Imovel;
  imageName: string;
  imageSize: number;
  imageType: string;
};
