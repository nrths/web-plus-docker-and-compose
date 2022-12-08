import {
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';
import { BaseEntity } from '../../utils/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  public name: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  public link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  public image: string;

  @Column({ scale: 2, default: 1 })
  @IsNotEmpty()
  public price: number;

  @Column({ scale: 2, nullable: true })
  @IsOptional()
  public raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  @IsNotEmpty()
  public owner: User;

  @Column()
  @IsNotEmpty()
  @Length(1, 1024)
  public description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsEmpty()
  public offers: Offer[];

  @Column({ default: 0, nullable: true })
  @IsInt()
  public copied: number;
}
