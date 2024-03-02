import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateLocationDto } from '../dto/create-location.dto'
import { LocationMapper } from '../mapper/location-mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Connection } from 'typeorm'
import { Location } from '../entities/location.entity'
import { GetLocationDto } from '../../user/dto/get-location.dto'
import { UpdateLocationDto } from '../dto/update-location.dto'

@Injectable()
export class LocationService {
  private logger = new Logger(LocationService.name)

  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private readonly locationMapper: LocationMapper,
    private connection: Connection,
  ) {}

  async findAll() {
    this.logger.log('Buscando todas las localizaciones')
    const locations = await this.locationRepository.find()
    return locations.map((location) => this.locationMapper.toDto(location))
  }

  async findOne(id: string) {
    this.logger.log(`Buscando localización con id ${id}`)
    const location = await this.findInternal(id)
    return this.locationMapper.toDto(location)
  }

  async create(createLocationDto: CreateLocationDto) {
    this.logger.log('Creando localización')
    const locationSave = await this.locationRepository.save({
      ...createLocationDto,
      latitude: parseFloat(createLocationDto.latitude),
      longitude: parseFloat(createLocationDto.longitude),
    })
    return this.locationMapper.toDto(locationSave)
  }

  getPlacesNearby(data: GetLocationDto) {
    this.logger.log('Buscando lugares cercanos')
    const query = `
      SELECT location.id   AS id,
             location.name AS name,
             (ROUND(CAST(earth_distance(ll_to_earth($1, $2), ll_to_earth(loc.latitude, loc.longitude))::NUMERIC, 2) /
                    1000) AS distance
    FROM location AS loc
        WHERE earth_box(ll_to_earth($1, $2), $3) @> ll_to_earth(loc.latitude, loc.longitude)
                    AND earth_distance(ll_to_earth($1, $2), ll_to_earth(loc.latitude, loc.longitude)) < $3
      ORDER BY distance`
    const longitude = parseFloat(data.longitude)
    const latitude = parseFloat(data.latitude)
    const distance = parseInt(data.distance) * 1000

    return this.connection.query(query, [latitude, longitude, distance])
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    this.logger.log(`Actualizando localización con id ${id}`)
    const location = await this.findOne(id)
    const updateLocation = this.locationMapper.toEntity(updateLocationDto)
    const locationUpdated = await this.locationRepository.save({
      ...location,
      ...updateLocation,
    })
    return this.locationMapper.toDto(locationUpdated)
  }

  async remove(id: string) {
    this.logger.log(`Eliminando localización con id ${id}`)
    const location = await this.findOne(id)
    if (!location) {
      throw new NotFoundException(`La localización con el id ${id} no existe`)
    }
    return await this.locationRepository.delete(id)
  }

  private async findInternal(id: string) {
    this.logger.log(`Buscando localización con id ${id}`)
    const location = await this.locationRepository.findOne({
      where: { id },
    })
    if (!location) {
      throw new NotFoundException(`Localización con id ${id} no encontrada`)
    }
    return location
  }
}
