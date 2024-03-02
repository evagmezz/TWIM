import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator'

export class GetLocationDto {
  @IsNotEmpty()
  distance: string

  @IsNotEmpty()
  @IsLatitude()
  latitude: string

  @IsNotEmpty()
  @IsLongitude()
  longitude: string
}
