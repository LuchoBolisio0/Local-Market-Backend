import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';



@Module({
  imports: [ProductsModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
