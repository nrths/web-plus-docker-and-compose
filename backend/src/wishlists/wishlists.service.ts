import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
  ) {}

  public async create(
    user: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const { itemsId, ...rest } = createWishlistDto;
    const wishes = itemsId.map((id: number) => ({ id } as Wish));
    const wishlist = this.wishlistsRepository.create({
      ...rest,
      owner: user,
      items: wishes,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  public async findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({ relations: ['items', 'owner'] });
  }

  public async findById(id: number): Promise<Wishlist> {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  public async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const { itemsId, ...rest } = updateWishlistDto;
    const wishlist = await this.findById(id);
    await this.wishlistsRepository.update(id, rest);
    wishlist.items = itemsId.map((id: number) => ({ id } as Wish));
    return await this.wishlistsRepository.save({
      ...rest,
      owner: user,
      items: wishlist.items,
    });
  }

  public async remove(id: number) {
    return this.wishlistsRepository.delete(id);
  }
}
