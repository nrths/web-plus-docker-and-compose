import { BaseEntity } from '../../utils/entities/BaseEntity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  public user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  public item: Wish;

  @Column({ scale: 2, default: 0 })
  @IsNotEmpty()
  public amount: number;

  @Column({ default: false })
  @IsBoolean()
  public hidden: boolean;
}
