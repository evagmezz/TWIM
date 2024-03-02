import { IsString, IsUUID, Length } from 'class-validator'

export class CreateCommentDto {
  @IsUUID()
  userId: string
  @IsUUID()
  postId: string
  @IsString()
  @Length(1, 255)
  content: string
}
