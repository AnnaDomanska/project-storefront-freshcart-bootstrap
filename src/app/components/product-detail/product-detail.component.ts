import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { StoresService } from '../../services/stores.service';
import { ProductModel } from '../../models/product.model';
import { StoreModel } from '../../models/store.model';
import { ProductDetailQueryModel } from '../../query-models/product-detail.query-model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAll();


  readonly productDetails$: Observable<ProductDetailQueryModel> = combineLatest([
    this._activatedRoute.params,
    this._categoriesService.getAll(),
    this._storesService.getAll(),
  ]).pipe(
    switchMap(([params, categories, stores]) =>
      this._productsService
        .getOne(params['productId'])
        .pipe(
          map((product) =>
            this._maptoProductDetailQueryModel(product, categories, stores)
          )
        )
    )
  );

  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService,
    private _storesService: StoresService
  ) {}

  ratingToStars(value: number): number[] {
    const arr: number[] = [];

    for (let i = 0; i < 5; i++) {
      if (value - i >= 1) {
        arr.push(1);
      } else if (value - i < 1 && value - i > 0) {
        arr.push(0.5);
      } else arr.push(0);
    }

    return arr;
  }

  private _maptoProductDetailQueryModel(
    product: ProductModel,
    categories: CategoryModel[],
    stores: StoreModel[]
  ): ProductDetailQueryModel {
    const storesMap = stores.reduce(
      (a, c) => ({ ...a, [c.id]: c }),
      {}
    ) as Record<string, StoreModel>;

    const categoriesMap = categories.reduce(
      (a, c) => ({ ...a, [c.id]: c }),
      {}
    ) as Record<string, CategoryModel>;

    return {
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      priceBeforeDiscount: (Math.random() + 1) * product.price,
      ratingValue: product.ratingValue,
      ratingCount: product.ratingCount,
      categoryName: categoriesMap[product.categoryId]?.name,
      stores: product.storeIds.map((storeId: string) => ({
        name: storesMap[storeId]?.name,
        logoUrl: storesMap[storeId]?.logoUrl,
        id: storesMap[storeId]?.id,
      })),
    };
  }
}
