import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  public create(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  public async findLastWishes(): Promise<Wish[]> {
    const lastWishes = await this.wishesService.findLastWishes();
    return lastWishes;
  }

  @Get('top')
  public async findTopWishes(): Promise<Wish[]> {
    const topWishes = await this.wishesService.findTopWishes();
    return topWishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<Wish> {
    const wish = await this.wishesService.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует.');
    }

    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  public async updateWish(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findWishById(id);
    if (wish.owner.id === req.user.id) {
      await this.wishesService.updateWish(id, updateWishDto);
      return;
    } else {
      throw new ForbiddenException({ message: 'Действие недоступно' });
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async deleteWish(@Req() req, @Param('id') id: number): Promise<Wish> {
    const wish = await this.wishesService.findWishById(id);
    if (wish.owner.id === req.user.id) {
      await this.wishesService.removeWish(id);
      return wish;
    } else {
      throw new ForbiddenException({ message: 'Действие недоступно' });
    }
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  public async copyWish(@Req() req, @Param('id') id: number) {
    const wish = await this.wishesService.findWishById(id);
    await this.wishesService.updateWish(id, { copied: ++wish.copied });
    const { name, link, image, price, description } = wish;
    if (wish.owner.id !== req.user.id) {
      await this.wishesService.create(req.user, {
        name,
        link,
        image,
        price,
        description,
      });
    }
    return {};
  }
}
