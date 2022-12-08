import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';
// import { WishesService } from '../wishes/wishes.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  public async findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  public async create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  public async findOne(@Param('id') id: number) {
    const wishlist = await this.wishlistsService.findById(id);
    if (!wishlist) {
      throw new NotFoundException('Такого списка подарков не существует.');
    }
    return wishlist;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  public async updateWishlist(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findById(id);
    if (!wishlist) {
      throw new NotFoundException('Такого списка не существует.');
    }
    if (wishlist.owner.id === req.user.id) {
      return await this.wishlistsService.updateWishlist(
        id,
        updateWishlistDto,
        req.user,
      );
    } else {
      throw new ForbiddenException({ message: 'Действие недоступно' });
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async remove(@Req() req, @Param('id') id: number) {
    const wishlist = await this.wishlistsService.findById(id);
    if (!wishlist) {
      throw new NotFoundException('Такого списка не существует.');
    }
    if (wishlist.owner.id === req.user.id) {
      await this.wishlistsService.remove(id);
      return;
    } else {
      throw new ForbiddenException({ message: 'Действие недоступно' });
    }
  }
}
