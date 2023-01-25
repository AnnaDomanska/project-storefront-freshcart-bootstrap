export interface CategoryWithProductsQueryModel {
  readonly categoryId: string;
  readonly categoryName: string; 
  readonly products: {
    name: string;
    price: number;
    imageUrl: string;
    id: string;
  }[];
}
