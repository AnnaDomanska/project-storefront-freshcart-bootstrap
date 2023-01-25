import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { StoreOnHomePageQueryModel } from '../../query-models/store-on-home-page.query-model';
import { StoreModel } from '../../models/store.model';
import { TagModel } from '../../models/tag.model';
import { CategoryWithProductsQueryModel } from '../../query-models/category-with-products.query-model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { StoresService } from '../../services/stores.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAll();
  readonly stores$: Observable<StoreOnHomePageQueryModel[]> = combineLatest([
    this._storesService.getAll(),
    this._storesService.getAllTags(),
  ]).pipe(
    map(([stores, tags]: [StoreModel[], TagModel[]]) =>
      this._mapToStoreQueryModel(stores, tags)
    )
  );

  readonly fruitsAndVegetables$: Observable<CategoryWithProductsQueryModel> =
    combineLatest([
      this._categoriesService.getOne('5'),
      this._productsService.getAll(),
    ]).pipe(
      map(([category, products]: [CategoryModel, ProductModel[]]) => {
        return {
          categoryName: category.name,
          categoryId: category.id,
          products: this._mapToCategoryWithProductsQueryModel(
            category,
            products
          ),
        };
      })
    );
  readonly snackAndMunchies$: Observable<CategoryWithProductsQueryModel> =
    combineLatest([
      this._categoriesService.getOne('2'),
      this._productsService.getAll(),
    ]).pipe(
      map(([category, products]: [CategoryModel, ProductModel[]]) => {
        return {
          categoryName: category.name,
          categoryId: category.id,
          products: this._mapToCategoryWithProductsQueryModel(
            category,
            products
          ),
        };
      })
    );

  constructor(
    private _categoriesService: CategoriesService,
    private _storesService: StoresService,
    private _productsService: ProductsService
  ) {}


  private _mapToStoreQueryModel(
    stores: StoreModel[],
    tags: TagModel[]
  ): StoreOnHomePageQueryModel[] {
    const tagMap = tags.reduce((a, c) => ({ ...a, [c.id]: c }), {}) as Record<
      string,
      TagModel
    >;

    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      logoUrl: store.logoUrl,
      tags: (store.tagIds ?? []).map((id) => tagMap[id]?.name),
      distance: store.distanceInMeters / 1000,
    }));
  }

  private _mapToCategoryWithProductsQueryModel(
    category: CategoryModel,
    products: ProductModel[]
  ): { name: string; price: number; imageUrl: string; id: string }[] {
    const displayedProducts = products
      .filter((product) => product.categoryId === category.id)
      .sort((a, b) => (a.featureValue > b.featureValue ? -1 : 1))
      .slice(0, 5);

    return displayedProducts.map((product) => ({
      name: product.name,
      price: Math.round(product.price),
      imageUrl: product.imageUrl,
      id: product.id
    }));
  }
}
