import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  public async create(user: User, createWishDto: CreateWishDto) {
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  async findWishById(id: number) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
      },
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует.');
    }

    return wish;
  }

  findWishesByOwner(ownerId: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['offers', 'owner'],
    });
  }

  async findMany(wishesIds: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.find(wishesIds);
  }

  updateWish(id: number, updateWishDto: UpdateWishDto) {
    return this.wishesRepository.update(id, updateWishDto);
  }

  removeWish(id: number) {
    return this.wishesRepository.delete({ id });
  }

  async findTopWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({ take: 10, order: { copied: 'DESC' } });
  }

  async findLastWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }
}
