import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetailQueryModel } from '../../query-models/product-detail.query-model';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingCartComponent {
  readonly displayedProducts$: Observable<ProductDetailQueryModel[]> =
    this._shoppingCartService.productsInCart$

  constructor(private _shoppingCartService: ShoppingCartService) { }

  removeProductFromCart(product: ProductDetailQueryModel): void {
    this._shoppingCartService.removeProductFromCart(product);
  }

  sumPrices(products: ProductDetailQueryModel[]): number {
   return products.map((product) => product.price).reduce((a, c) => a + c);
  }
}
