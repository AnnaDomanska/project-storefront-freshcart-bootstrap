import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ShoppingCartComponent],
  providers: [],
  exports: [ShoppingCartComponent]
})
export class ShoppingCartComponentModule {
}
