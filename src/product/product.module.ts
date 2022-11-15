import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './model/product.model';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Product.name,
      schema: ProductSchema,
      collection: 'Product'
    }])],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
