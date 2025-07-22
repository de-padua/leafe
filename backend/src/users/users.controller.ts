import { userDataToUpdateDto } from './dto/userDataToUpdateDto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDTO';
import { Request, Response } from 'express';
import { AuthGuard, CustomRequestWithId } from 'src/auth/auth.guard';
import { updateUserPasswordDto } from './dto/update-password-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}
  @Post()
  async createUser(
    @Body() userDTO: CreateUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.UserService.createOne(userDTO, req);
    response.cookie('accessToken', data.accessToken);
    response.cookie('refreshToken', data.refreshToken);
    response.status(HttpStatus.CREATED).send(data.userData);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateUserData(
    @Body() userDataToUpdate: userDataToUpdateDto,
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return response.status(HttpStatus.UNAUTHORIZED);
    const userId = request.id;
    const newData = await this.UserService.updateUserProfileInfo(
      userDataToUpdate,
      userId,
    );

    response.cookie('accessToken', newData.newAccessToken);
    return newData.newUserData;
  }
}
