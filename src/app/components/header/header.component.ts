import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { ProductDetailQueryModel } from '../../query-models/product-detail.query-model';
import { CategoriesService } from '../../services/categories.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private _mobileMenuStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public mobileMenuStatus$: Observable<boolean> =
    this._mobileMenuStatusSubject.asObservable();
  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAll();
  readonly productsInCart$: Observable<ProductDetailQueryModel[]> =
    this._shoppingCartService.productsInCart$;

  constructor(
    private _categoriesService: CategoriesService,
    private _shoppingCartService: ShoppingCartService
  ) {}

  showMenu(value: boolean): void {
    this._mobileMenuStatusSubject.next(value);
  }
}
