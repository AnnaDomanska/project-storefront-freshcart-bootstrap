import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetailQueryModel } from 'src/app/query-models/product-detail.query-model';
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

  constructor(private _shoppingCartService: ShoppingCartService) {}
}
