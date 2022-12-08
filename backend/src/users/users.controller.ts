import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  NotFoundException,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { Wish } from '../wishes/entities/wish.entity';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from '../helpers/bcrypt_service';
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async getMyProfile(@Req() req): Promise<User> {
    return this.usersService.findById(req.user.id);
  }

  @Get('me/wishes')
  async findMyWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findWishesByOwner(req.user.id);
  }

  @Get(':username')
  async findOneByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует.');
    }
    return user;
  }

  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findOneByUsername(username);
    return this.wishesService.findWishesByOwner(user.id);
  }

  @Post('find')
  async findMany(@Body() findUsersDto: FindUserDto): Promise<User[]> {
    return this.usersService.findMany(findUsersDto);
  }

  @Patch('me')
  async updateMyProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = { ...req.user, ...updateUserDto };

    const hashed = updateUserDto.password
      ? await hash(updateUserDto.password, 10)
      : user.password;
    await this.usersService.update(req.user.id, {
      ...user,
      password: hashed,
    });
    return this.usersService.findById(user.id);
  }
}
