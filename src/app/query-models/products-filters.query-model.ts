export interface ProductsFiltersQueryModel {
  readonly priceFrom: number;
  readonly priceTo: number;
  readonly rating: number;
  readonly stores: Set<string>;
}
