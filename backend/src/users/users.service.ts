import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { hash } from '../helpers/bcrypt_service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const createdUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(createdUser);
      console.log(savedUser);
      return createdUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  findMany({ query }: FindUserDto): Promise<User[]> {
    const users = this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }

  update(id: number, user: UpdateUserDto) {
    return this.userRepository.update({ id }, user);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
