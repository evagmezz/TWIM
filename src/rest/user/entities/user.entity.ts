import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsUUID } from 'class-validator'
import { v4 as uuidv4 } from 'uuid'

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  public static IMAGE_DEFAULT =
    'https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_640.png'
  @PrimaryColumn({ type: 'uuid' })
  @IsUUID('4', { message: 'El id debe ser un UUID' })
  id: string = uuidv4()

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  lastname: string

  @Column({
    type: 'varchar',
    unique: true,
  })
  username: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string

  @Column({
    type: 'varchar',
    nullable: true,
    default: User.IMAGE_DEFAULT,
  })
  image: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role[]

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @ManyToMany(() => User)
  @JoinTable()
  followers: User[]
}
