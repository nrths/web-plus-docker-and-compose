import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  public async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(req.user, createOfferDto);
  }

  @Get()
  public findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<Offer> {
    const offer = await this.offersService.findOne(id);
    if (!offer) {
      throw new NotFoundException('Такого взноса не существует.');
    }
    return offer;
  }
}
