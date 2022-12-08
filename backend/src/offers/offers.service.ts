import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
// import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  public async create(
    user: User,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const wish = await this.wishesService.findWishById(createOfferDto.itemId);
    if (user.id === wish.owner.id) {
      throw new BadRequestException('Нельзя скидываться себе.');
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException('Взнос слишком большой, уменьшите его.');
    }
    await this.wishesService.updateWish(wish.id, {
      raised: wish.raised + createOfferDto.amount,
    });
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    return await this.offersRepository.save(offer);
  }

  public async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({ relations: ['item', 'user'] });
  }

  public async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }

  // public async update(
  //   id: number,
  //   updateOfferDto: UpdateOfferDto,
  // ) {
  //   return this.offersRepository.update(id, updateOfferDto);
  // }

  // public async remove(id: number) {
  //   return this.offersRepository.delete(id);
  // }
}
