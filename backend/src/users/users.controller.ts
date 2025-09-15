import { userDataToUpdateDto } from './dto/userDataToUpdateDto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDTO';
import { Request, Response } from 'express';
import { AuthGuard, CustomRequestWithId } from 'src/auth/auth.guard';
import { updateUserPasswordDto } from './dto/update-password-dto';
import GetPublicUserDataQuery from './dto/queryDto';

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
  @UseGuards(AuthGuard)
  @Put('/credential')
  async updateUserCredential(
    @Body() passwordData: updateUserPasswordDto,
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return response.status(HttpStatus.UNAUTHORIZED);

    const userId = request.id;
    const newData = await this.UserService.updateUserPassword(
      passwordData,
      userId,
    );

    response.cookie('accessToken', newData.newAccessToken);
    return newData.newUserData;
  }
  @UseGuards(AuthGuard)
  @Post('/recovery-codes')
  async createUserRecoveryCodes(
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return response.status(HttpStatus.UNAUTHORIZED);

    const userId = request.id;

    const newData = await this.UserService.createCodes(userId);

    response.cookie('accessToken', newData.newAccessToken);
    return newData.newData;
  }
  @UseGuards(AuthGuard)
  @Post('/recovery-codes/access')
  async getUserRecoveryCodes(
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return response.status(HttpStatus.UNAUTHORIZED);

    const userId = request.id;

    const codes = await this.UserService.getUserCodes(userId);

    return codes;
  }

  @Get('public') 
  async getPublicUserData(@Query() query: GetPublicUserDataQuery) {
    const { userId , sort, offset, limit,price} = query
 
    const publicUserData = await this.UserService.getProfileUserData(userId,offset,sort,null,limit,price)
    
    return publicUserData
  }
}
