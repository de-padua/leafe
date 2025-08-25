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
import { Prisma, recoveryCodes, user } from '@prisma/client';
import { Request } from 'express';
import { updateUserPasswordDto } from './dto/update-password-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  createOne = async (userDTO: CreateUserDto, req: Request) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(userDTO.password, salt);

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
        include: {
          metadata: true,
        },
      });
      const accessToken = await this.authService.createAccessTokenJwt({
        ...userData,
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
      include: {
        metadata: true,
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

  createCodes = async (userId: string) => {

     await this.prisma.recoveryCodes.deleteMany({
      where:{
         userId:userId
      }
    })
    const quantityOfCodes = 10;
    const codes: recoveryCodes[] = [];

    for (let index = 0; index < quantityOfCodes; index++) {
      codes.push({
        id: randomUUID(),
        code: randomUUID().substring(0,8),
        userId: userId,
        isUsed: false,
      });
    }

    if (codes.length === 0) throw new InternalServerErrorException();

    await this.prisma.recoveryCodes.createMany({
      data: codes,
    });

    const updatedProfile = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        metadata: {
          update: {
            recoveryCodesGenerated: true,
          },
        },
      },
      include: {
        metadata: true,
      },
    });

    const newAccessToken =
      await this.authService.createAccessTokenJwt(updatedProfile);


    updatedProfile["codes"] = codes
    return {
      newData: updatedProfile,
      newAccessToken: newAccessToken,
    };
  };

  getUserCodes = async (userId: string) => {
    const userCodes = await this.prisma.recoveryCodes.findMany({
      where: {
        userId: userId,
      },
    });

    if (!userCodes) throw new NotFoundException('Códigos não gerados');

    return userCodes;
  };
}
