import { AuthService } from './../auth/auth.service';
import bcrypt from 'bcryptjs';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/createUserDTO';
import { randomBytes, randomUUID } from 'crypto';
import { Prisma, user } from '@prisma/client';
import { Request } from 'express';
import { updateUserPasswordDto } from './dto/update-password-dto';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  createOne = async (userDTO: CreateUserDto, req: Request) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(userDTO.password, salt);

      console.log(hash);
      const userId = randomUUID();
      const userData = await this.prisma.user.create({
        data: {
          ...userDTO,
          id: userId,
          password: hash,
          metadata: {
            create: {
              lastLogin: new Date(),
              loginCount: 1,
              emailVerified: false,
              twoFactorEnabled: false,
              failedLoginAttempts: 0,
              profileVersion: 1,
              updatedAt: new Date(),
              registrationIp: req.ip,
              lastLoginIp: req.ip,
              registrationDevice: req.headers['user-agent'],
            },
          },
        },
        omit: {
          password: true,
        },
      });
      const accessToken = await this.authService.createAccessTokenJwt({
        ...userDTO,
        id: userId,
      });
      const refreshToken = await this.authService.createRefreshTokenJwt(userId);

      return {
        userData: userData,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException(
              'Invalid email,try again with a valid one.',
            );
          case 'P2025':
            throw new NotFoundException('Required records not found');
          default:
            throw new InternalServerErrorException('Database operation failed');
        }
      } else {
        throw error;
      }
    }
  };
  getOneById = async (userId: string) => {};

  updateUserProfileInfo = async (
    newProfileData: Partial<user>,
    userId: string,
  ) => {
    const updatedUserData = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: { ...newProfileData },
      omit: {
        password: true,
      },
    });

    const newAccessToken =
      await this.authService.createAccessTokenJwt(updatedUserData);

    return {
      newUserData: updatedUserData,
      newAccessToken: newAccessToken,
    };
  };
  updateUserPassword = async (
    newDataToUpdate: updateUserPasswordDto,
    userId: string,
  ) => {
    try {
      const currentUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!currentUser) throw new NotFoundException();

      const isCorrenctPassword = await bcrypt.compare(
        newDataToUpdate.currentPassword,
        currentUser.password,
      );

      if (isCorrenctPassword === false)
        throw new UnauthorizedException('invalid password');

      const salt = bcrypt.genSaltSync(10);
      const newHash = await bcrypt.hash(newDataToUpdate.newPassword, salt);

      const updatedUserData = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: newHash,
        },
        omit: {
          password: true,
        },
        include: {
          metadata: true,
        },
      });

      if (!newDataToUpdate) throw new InternalServerErrorException();

      const newAccessToken =
        await this.authService.createAccessTokenJwt(updatedUserData);

      return {
        newUserData: updatedUserData,
        newAccessToken: newAccessToken,
      };
    } catch (error) {
      throw error;
    }
  };
}
