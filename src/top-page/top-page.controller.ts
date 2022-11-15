import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UsePipes, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/messages';
import { ValidationIdPipe } from 'src/pipes/validate-id.pipe';
import { CreatePageDto } from './dto/create-page.dto';
import { FindPageDto } from './dto/find-page.dto';
import { TopPageService } from './top-page.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe)
  async createPage(@Body() dto: CreatePageDto) {
    return await this.topPageService.createPage(dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPage(@Param('id', ValidationIdPipe) id: string) {
    const page = await this.topPageService.getPageById(id);
    if (!page) throw new NotFoundException(ERROR_MESSAGES.WRONG_PAGE)
    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePage(@Param('id', ValidationIdPipe) id: string) {
    const deletedPage = await this.topPageService.deletePageById(id);
    if (!deletedPage) throw new NotFoundException(ERROR_MESSAGES.WRONG_PAGE)
  }


  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe)
  @Patch(':id')
  async updatePage(@Param('id', ValidationIdPipe) id: string, @Body() dto: CreatePageDto) {
    const updatedPage = await this.topPageService.updatePageById(id, dto);
    if (!updatedPage) throw new NotFoundException(ERROR_MESSAGES.WRONG_PAGE)

    return updatedPage;
  }

  @Get('byAlias/:alias')
  async findPageByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);
    if (!page) throw new NotFoundException(ERROR_MESSAGES.WRONG_PAGE)
    return page;
  }


  @HttpCode(200)
  @UsePipes(new ValidationPipe)
  @Post('find')
  async findPage(@Body() dto: FindPageDto) {
    return await this.topPageService.findByCategory(dto);
  }
}