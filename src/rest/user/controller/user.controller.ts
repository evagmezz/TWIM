import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto)
  }

  @Post('/follow')
  @HttpCode(201)
  async followUser(
    @Body('userId') userId: string,
    @Body('userToFollowId') userToFollowId: string,
  ) {
    return this.userService.followUser(userId, userToFollowId)
  }

  @Post('unfollow')
  @HttpCode(201)
  async unfollowUser(
    @Body('userId') userId: string,
    @Body('userToUnfollowId') userToUnfollowId: string,
  ) {
    return this.userService.unfollowUser(userId, userToUnfollowId)
  }

  @Get(':id/followers')
  async findFollowers(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getFollowers(id)
  }

  @Get(':id/following')
  async findFollowing(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getFollowing(id)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.remove(id)
  }
}
