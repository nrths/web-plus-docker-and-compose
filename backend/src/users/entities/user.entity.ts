import {
  IsEmail,
  IsNotEmpty,
  IsEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { BaseEntity } from '../../utils/entities/BaseEntity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @IsEmpty()
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @IsEmpty()
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @IsEmpty()
  wishlists: Wishlist[];
}
