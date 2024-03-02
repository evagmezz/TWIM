import { v4 as uuidv4 } from 'uuid'
import { IsUUID } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'locations' })
export class Location {
  @PrimaryColumn({ type: 'uuid' })
  @IsUUID()
  id: string = uuidv4()

  @Column({
    name: 'post_id',
    type: 'uuid',
    nullable: false,
  })
  @IsUUID()
  postId: string = uuidv4()

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string

  @Column()
  latitude: number

  @Column()
  longitude: number

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date
}
