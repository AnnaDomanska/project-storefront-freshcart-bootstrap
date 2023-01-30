import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { ProductDetailComponent } from '../components/product-detail/product-detail.component';
import { ProductModel } from '../models/product.model';
import { ProductDetailQueryModel } from '../query-models/product-detail.query-model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private _productsInCartSubject: BehaviorSubject<ProductDetailQueryModel[]> =
    new BehaviorSubject<ProductDetailQueryModel[]>([]);
  public productsInCart$: Observable<ProductDetailQueryModel[]> =
    this._productsInCartSubject.asObservable();

  addProductToCart(product: ProductDetailQueryModel) {
    this._productsInCartSubject.next([
      ...this._productsInCartSubject.value,
      product,
    ]);
    console.log(product.name + ' added')
  }

  removeProductFromCart(removedProduct: ProductDetailQueryModel) {
    this._productsInCartSubject.next([
      ...this._productsInCartSubject.value.filter(
        (product) => product.id !== removedProduct.id
      ),
    ]);
  }
}
