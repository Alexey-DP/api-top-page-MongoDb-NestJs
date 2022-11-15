import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ValidationIdPipe } from 'src/pipes/validate-id.pipe';
import { ERROR_MESSAGES } from '../constants/messages';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe)
  @Post('create')
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProducts(@Param('id', ValidationIdPipe) id: string) {
    const product = await this.productService.getProductById(id);
    if (!product) throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND)

    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id', ValidationIdPipe) id: string) {
    const deletedProduct = await this.productService.deleteProductById(id);
    if (!deletedProduct) throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe)
  @Patch(':id')
  async updateProduct(@Param('id', ValidationIdPipe) id: string, @Body() dto: CreateProductDto) {
    const updatedProduct = await this.productService.updateProductById(id, dto);
    if (!updatedProduct) throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND)

    return updatedProduct;
  }


  @HttpCode(200)
  @UsePipes(new ValidationPipe)
  @Post('find')
  async findProducts(@Body() dto: FindProductDto) {
    return await this.productService.findProductsWithReviews(dto);
  }
}
