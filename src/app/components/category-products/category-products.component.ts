import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { StoreModel } from '../../models/store.model';
import { SortingOptionsQueryModel } from '../../query-models/sorting-options.query-model';
import { ProductsFiltersQueryModel } from '../../query-models/products-filters.query-model';
import { ProductModel } from '../../models/product.model';
import { PaginationQueryModel } from '../../query-models/pagination.query-model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { StoresService } from '../../services/stores.service';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent {
  readonly categoryData$: Observable<CategoryModel> =
    this._activatedRoute.params.pipe(
      switchMap((data) => this._categoriesService.getOne(data['categoryId'])),
      shareReplay(1)
    );
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAll()
    .pipe(shareReplay(1));

  readonly searchStore: FormControl = new FormControl();
  readonly stores$: Observable<StoreModel[]> = this._storesService
    .getAll()
    .pipe(shareReplay(1));

  readonly displayedStores$: Observable<StoreModel[]> = combineLatest([
    this.stores$,
    this.searchStore.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([stores, search]) =>
      stores.filter((store) =>
        store.name.toLowerCase().includes(search.toLowerCase())
      )
    )
  );

  // sort
  readonly selectedSortingOption: FormControl = new FormControl({ name: 'Featured', property: 'featureValue', direction: 'desc' });
  readonly sortingOptions$: Observable<SortingOptionsQueryModel[]> = of([
    { name: 'Featured', property: 'featureValue', direction: 'desc' },
    { name: 'Price: Low To High', property: 'price', direction: 'asc' },
    { name: 'Price: High To Low', property: 'price', direction: 'desc' },
    { name: 'Avg. Rating', property: 'ratingValue', direction: 'desc' },
  ]);

  readonly ratingFilterOptions$: Observable<number[]> = of([5, 4, 3, 2]);

  readonly sortingOption$: Observable<{ sortBy: string; order: string }> =
    this._activatedRoute.queryParams.pipe(
      map((params) => ({
        sortBy: params['sortBy'] ?? 'featureValue',
        order: params['order'] ?? 'desc',
      }))
    );

  readonly currentFilterOptions$: Observable<ProductsFiltersQueryModel> =
    this._activatedRoute.queryParams.pipe(
      map((params) => {
        return {
          priceFrom: params['priceFrom'] ?? 0,
          priceTo: params['priceTo'] ?? 1000,
          rating: params['rating'] ?? 0,
          stores: new Set<string>(
            params['stores'] === undefined ? [] : params['stores'].split(',')
          ),
        };
      }),
      shareReplay(1)
    );

  readonly productsInCategory$: Observable<ProductModel[]> = combineLatest([
    this._productsService.getAll(),
    this.categoryData$,
    this.currentFilterOptions$,
    this.sortingOption$,
  ]).pipe(
    map(([products, category, currentFilterOptions, sortingOption]) => {
      {
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
          })
          .filter(
            (product) =>
              product.price >= +currentFilterOptions.priceFrom &&
              product.price <= +currentFilterOptions.priceTo
          )
          .filter((product) =>
            currentFilterOptions.stores.size !== 0
              ? product.storeIds.find((storeId: string) =>
                  currentFilterOptions.stores.has(storeId)
                )
              : true
          )
          .filter((product) =>
            currentFilterOptions.rating !== 0
              ? Math.floor(product.ratingValue) === +currentFilterOptions.rating
              : true
          );
      }
    }),
    shareReplay(1)
  );

  readonly currentPaginationValues$: Observable<PaginationQueryModel> =
    this._activatedRoute.queryParams.pipe(
      map((data) => {
        return data['pageSize'] || data['pageNumber']
          ? { limit: +data['pageSize'], page: +data['pageNumber'] }
          : { limit: 5, page: 1 };
      })
    );

  readonly displayedProducts$: Observable<ProductModel[]> = combineLatest([
    this.productsInCategory$,
    this.currentPaginationValues$,
  ]).pipe(
    map(([products, currentPaginationValues]) =>
      products.slice(
        currentPaginationValues.limit * (currentPaginationValues.page - 1),
        currentPaginationValues.limit * currentPaginationValues.page
      )
    )
  );

  readonly limitOptions$: Observable<number[]> = of([5, 10, 15]);
  readonly currentPageOptions$: Observable<number[]> = combineLatest([
    this.productsInCategory$,
    this.currentPaginationValues$,
  ]).pipe(
    map(([products, currentValues]) => {
      let arr: number[] = [];
      for (
        let i = 0;
        i < Math.ceil(products.length / currentValues.limit);
        i++
      ) {
        arr.push(i + 1);
      }
      return arr;
    })
  );

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

  readonly stores: FormControl = new FormControl();
  readonly priceFrom: FormControl = new FormControl();
  readonly priceTo: FormControl = new FormControl();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _categoriesService: CategoriesService,
    private _productsService: ProductsService,
    private _router: Router,
    private _storesService: StoresService
  ) {}

  ngAfterViewInit(): void {
    this.priceFrom.valueChanges
      .pipe(
        debounceTime(250),
        tap((value) =>
          this._router.navigate([], {
            queryParams: {
              priceFrom: value,
            },
            queryParamsHandling: 'merge',
          })
        )
      )
      .subscribe();

    this.priceTo.valueChanges
      .pipe(
        debounceTime(250),
        tap((priceTo) =>
          this._router.navigate([], {
            queryParams: {
              priceTo: priceTo,
            },
            queryParamsHandling: 'merge',
          })
        )
      )
      .subscribe();
  }

  onSortingSelectionChanged(sortingOption: SortingOptionsQueryModel): void {
    this._router.navigate([], {
      queryParams: {
        sortBy: sortingOption.property,
        order: sortingOption.direction,
      },
      queryParamsHandling: 'merge',
    });
  }

  onLimitChanged(limit: number): void {
    this.productsInCategory$
      .pipe(
        take(1),
        tap((products) =>
          this._router.navigate([], {
            queryParams: {
              pageSize: limit,
              pageNumber: Math.ceil(products.length / limit),
            },
            queryParamsHandling: 'merge',
          })
        )
      )
      .subscribe();
  }

  onPageChanged(page: number): void {
    this.currentPaginationValues$
      .pipe(
        take(1),
        tap((currentValues) =>
          this._router.navigate([], {
            queryParams: {
              pageSize: currentValues.limit,
              pageNumber: page,
            },
            queryParamsHandling: 'merge',
          })
        )
      )
      .subscribe();
  }

  onRatingFilterChanged(value: number) {
    this._router.navigate([], {
      queryParams: { rating: value },
      queryParamsHandling: 'merge',
    });

  }

  onStoresChanged(value: string) {
    this.currentFilterOptions$
      .pipe(
        take(1),
        tap((data) => {
          const storesParamSet = data.stores;

          storesParamSet.has(value)
            ? storesParamSet.delete(value)
            : storesParamSet.add(value);
          console.log(storesParamSet);
          if (storesParamSet.size > 0) {
            this._router.navigate([], {
              queryParams: {
                stores: [...storesParamSet].sort().join(','),
              },
              queryParamsHandling: 'merge',
            });
          } else {
            this._router.navigate([]);
          }
        })
      )
      .subscribe();
  }
}
