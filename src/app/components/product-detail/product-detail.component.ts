import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  readonly categories$: Observable<CategoryModel[]> =
    this._categoriesService.getAll();
    
  readonly productDetails$: Observable<ProductModel> =
    this._activatedRoute.params.pipe(
      switchMap((data) => this._productsService.getOne(data['productId']))
    );

  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService
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
}
