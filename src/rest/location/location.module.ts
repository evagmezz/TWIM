import { Module } from '@nestjs/common'
import { LocationService } from './services/location.service'
import { LocationController } from './controller/location.controller'
import { LocationMapper } from './mapper/location-mapper'
import { Location } from './entities/location.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService, LocationMapper],
})
export class LocationModule {}
