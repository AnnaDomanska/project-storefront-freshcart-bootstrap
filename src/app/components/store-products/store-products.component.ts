import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { StoreModel } from '../../models/store.model';
import { ProductModel } from '../../models/product.model';
import { StoresService } from '../../services/stores.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-store-products',
  styleUrls: ['./store-products.component.scss'],
  templateUrl: './store-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProductsComponent {
  readonly storeData$: Observable<StoreModel> =
    this._activatedRoute.params.pipe(
      switchMap((data) => this._storesService.getOne(data['storeId']))
    );

  readonly search: FormControl = new FormControl();


  readonly currentSearchingTerm$: Observable<string> = this._activatedRoute.queryParams.pipe(
    map((params) => params['search'] ?? '')
  );

  readonly storeProducts$: Observable<ProductModel[]> = combineLatest([
    this._productsService.getAll(),
    this.storeData$,
    this.currentSearchingTerm$
  ]).pipe(
    map(([products, storeDetails, search]: [ProductModel[], StoreModel, string]) => {
      return products
      .filter((product) =>
        product.storeIds.includes(storeDetails.id)
      )
      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    })
  );

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _storesService: StoresService,
    private _productsService: ProductsService, private _router: Router
  ) { }

  ngOnInit() {
    this.search.valueChanges.pipe(
      debounceTime(500),
      tap((data) => this._router.navigate([], {queryParams: {
        search: data
      }}))
    ).subscribe()
  }
}
