export interface ProductDetailQueryModel {
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string
  readonly priceBeforeDiscount: number;
  readonly ratingValue: number;
  readonly ratingCount: number;
  readonly categoryName: string;
  readonly stores: {
    readonly name: string,
    readonly logoUrl: string
    readonly id: string
  }[];
  // readonly relatedProducts: {
  //   readonly name: string;
  //   readonly imageUrl: string
  //   readonly price: number
  // }[];
}
