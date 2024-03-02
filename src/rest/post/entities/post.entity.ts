import { v4 as uuidv4 } from 'uuid'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { Comment } from '../../comment/entities/comment.entity'
export type PostDocument = Post & Document

@Schema({
  timestamps: true,
  collection: 'posts',
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    },
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    },
  },
})
export class Post {
  @Prop({ type: String, default: () => uuidv4() })
  _id: string

  @Prop({ type: String, default: () => uuidv4() })
  @IsUUID()
  userId: string = uuidv4()

  @Prop({ type: 'string' })
  title: string

  @Prop({ type: 'string' })
  text: string

  @Prop({ type: 'array', default: [] })
  photos: string[]

  @Prop({ type: 'string' })
  location: string

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date

  @Prop({ type: [Comment], default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Comment)
  comments: Comment[]
}

export const PostSchema = SchemaFactory.createForClass(Post)
PostSchema.plugin(mongoosePaginate)
