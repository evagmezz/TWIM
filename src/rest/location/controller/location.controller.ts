import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { LocationService } from '../services/location.service'
import { UpdateLocationDto } from '../dto/update-location.dto'
import { CreateLocationDto } from '../dto/create-location.dto'
import { GetLocationDto } from '../../user/dto/get-location.dto'

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll() {
    return this.locationService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationService.findOne(id)
  }

  @Get('nearby')
  getPlacesNearby(@Query() query: GetLocationDto) {
    return this.locationService.getPlacesNearby(query)
  }

  @Post()
  @HttpCode(201)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto)
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationService.remove(id)
  }
}
