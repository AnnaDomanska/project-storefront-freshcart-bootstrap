import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProductModel } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private _productsInCartSubject: BehaviorSubject<ProductModel[]> =
    new BehaviorSubject<ProductModel[]>([]);
  public productsInCart$: Observable<ProductModel[]> =
    this._productsInCartSubject.asObservable();

  private addProductToCart(product: ProductModel) {
    this._productsInCartSubject.next([
      ...this._productsInCartSubject.value,
      product,
    ]);
  }
  
  private removeProductFromCart(removedProduct: ProductModel) {
    this._productsInCartSubject.next([
      ...this._productsInCartSubject.value.filter(
        (product) => product.id !== removedProduct.id
      ),
    ]);
  }
}
