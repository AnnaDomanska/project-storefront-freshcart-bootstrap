import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { HomeComponent } from './components/home/home.component';
import { StoreProductsComponent } from './components/store-products/store-products.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CategoryProductsComponentModule } from './components/category-products/category-products.component-module';
import { HomeComponentModule } from './components/home/home.component-module';
import { StoreProductsComponentModule } from './components/store-products/store-products.component-module';
import { ProductDetailComponentModule } from './components/product-detail/product-detail.component-module';
import { ShoppingCartComponentModule } from './components/shopping-cart/shopping-cart.component-module';

const routes: Routes = [
  { path: 'categories/:categoryId', component: CategoryProductsComponent },
  { path: '', component: HomeComponent },
  { path: 'stores/:storeId', component: StoreProductsComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'products/:productId', component: ProductDetailComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CategoryProductsComponentModule,
    HomeComponentModule,
    StoreProductsComponentModule,
    ProductDetailComponentModule,
    ShoppingCartComponentModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
