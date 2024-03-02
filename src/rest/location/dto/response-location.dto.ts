import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

export class ResponseLocationDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string
  @IsNotEmpty()
  @IsLatitude()
  latitude: number
  @IsNotEmpty()
  @IsLongitude()
  longitude: number
  createdAt: Date
}
