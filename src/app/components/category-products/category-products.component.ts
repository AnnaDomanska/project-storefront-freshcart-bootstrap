import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { SortingOptionsQueryModel } from '../../query-models/sorting-options.query-model';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent {

  readonly selectedSortingOption: FormControl = new FormControl('Featured');

  readonly sortingOptions$: Observable<SortingOptionsQueryModel[]> = of([
    { name: 'Featured', property: 'featureValue', direction: 'desc' },
    { name: 'Price: Low To High', property: 'price', direction: 'asc' },
    { name: 'Price: High To Low', property: 'price', direction: 'desc' },
    { name: 'Avg. Rating', property: 'ratingValue', direction: 'desc' },
  ]);

  readonly categoryData$: Observable<CategoryModel> =
    this._activatedRoute.params.pipe(
      switchMap((data) => this._categoriesService.getOne(data['categoryId'])),
      shareReplay(1)
    );
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAll()
    .pipe(shareReplay(1));

  readonly sortingOption$: Observable<{ sortBy: string; order: string }> =
    this._activatedRoute.queryParams.pipe(
      map((params) => ({
        sortBy: params['sortBy'] ?? 'featureValue',
        order: params['order'] ?? 'desc',
      }))
    );

  readonly productsInCategory$: Observable<ProductModel[]> = combineLatest([
    this._productsService.getAll(),
    this.categoryData$,
    this.sortingOption$,
  ]).pipe(
    map(([products, category, sortingOption]) => {
      return products
        .filter((product) => product.categoryId === category.id)
        .sort((a, b) => {
          if (
            a[sortingOption.sortBy as keyof ProductModel] >
            b[sortingOption.sortBy as keyof ProductModel]
          )
            return sortingOption.order === 'asc' ? 1 : -1;
          if (
            a[sortingOption.sortBy as keyof ProductModel] <
            b[sortingOption.sortBy as keyof ProductModel]
          )
            return sortingOption.order === 'asc' ? -1 : 1;
          return 0;
        });
    })
  );

  onSortingSelectionChanged(sortingOption: SortingOptionsQueryModel): void {
    this._router.navigate([], {
      queryParams: {
        sortBy: sortingOption.property,
        order: sortingOption.direction,
      },
    });
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _categoriesService: CategoriesService,
    private _productsService: ProductsService,
    private _router: Router
  ) {}
}
