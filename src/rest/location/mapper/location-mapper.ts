import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Location } from '../entities/location.entity'
import { ResponseLocationDto } from '../dto/response-location.dto'
import { CreateLocationDto } from '../dto/create-location.dto'
import { UpdateLocationDto } from '../dto/update-location.dto'

@Injectable()
export class LocationMapper {
  toDto(location: Location): ResponseLocationDto {
    return plainToClass(ResponseLocationDto, location)
  }

  toEntity(locationDto: CreateLocationDto | UpdateLocationDto): Location {
    const location = new Location()
    return { ...locationDto, ...location }
  }
}
