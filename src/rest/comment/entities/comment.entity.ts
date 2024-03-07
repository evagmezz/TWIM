import { v4 as uuidv4 } from 'uuid'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsUUID } from 'class-validator'
import * as mongoosePaginate from 'mongoose-paginate-v2'

export type CommentDocument = Comment & Document

@Schema({
  timestamps: true,
  collection: 'comments',
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
export class Comment {
  @Prop({ type: String, default: () => uuidv4() })
  _id: string

  @Prop({ type: String, default: () => uuidv4() })
  postId: string

  @Prop({ type: String, default: () => uuidv4() })
  @IsUUID()
  userId: string

  @Prop({ type: 'string' })
  content: string

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
CommentSchema.plugin(mongoosePaginate)
