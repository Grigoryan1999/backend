import MarketProduct from 'src/market-product/market-product.entity';
export interface ITokenPayload {
  uuid: string;
  email: string;
  role: string;
}

export interface IStandartResponse<T> {
  message: T;
}

export interface IDetailedProduct {
  uuid: string;
  name: string;
  subscription: string;
  picture: string | null;
  drink: boolean;
  updated_at: string;
  created_at: string;
}

export interface IDetailedMarketProduct {
  uuid: string;
  count: number;
  cost: number;
  discount: number;
  updated_at: string;
  created_at: string;
}

export interface IDetailedMarketProductWithMarket {
  uuid: string;
  count: number;
  cost: number;
  discount: number;
  updated_at: string;
  created_at: string;
  product: IDetailedProduct;
  market: IDetailedMarket;
}

export interface IDetailedCategory {
  uuid: string;
  name: string;
  subscription: string;
  updated_at: string;
  created_at: string;
  products: IDetailedProduct[];
}

export interface IDetailedBid {
  uuid: string;
  fio: string;
  comment: string;
  endDate: string;
  updated_at: string;
  created_at: string;
  products: IDetailetBidProduct[];
}

export interface IDetailetBidProduct {
  uuid: string;
  count: number;
  product: IDetailedProduct;
}

export interface IDetailedMarket {
  uuid: string;
  address: string;
  latitude: number;
  longitude: number;
  updated_at: string;
  created_at: string;
}

export interface IMarketWithProducts {
  market: IDetailedMarket;
  products: IDetailedMarketProduct[];
}

export interface IDetailedRole {
  uuid: string;
  name: string;
  default: boolean;
  updated_at: string;
  created_at: string;
}

export interface IDetailedToken {
  accessToken: string;
  refreshToken: string;
}

export interface ICategoryWithCost {
  uuid: string;
  name: string;
  subscription: string;
  updated_at: string;
  created_at: string;
  products: IProductWithCost[];
}

export interface IProductWithCost {
  uuid: string;
  name: string;
  subscription: string;
  picture: string;
  drink: boolean;
  updated_at: string;
  created_at: string;
  minimalCost: number;
  marketProduct: MarketProduct[];
}
