import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import { user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { throwError } from 'rxjs';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private prisma: PrismaService,
  ) {}

  createAccessTokenJwt = async (userData: Partial<user>) => {
    const payload = {
      data: userData,
      sub: userData.id,
      role: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 60 * 0.1,
      iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return accessToken;
  };

  createRefreshTokenJwt = async (userId: string) => {
    const payload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90,
      iat: Math.floor(Date.now() / 1000),
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
    });
    return refreshToken;
  };
  verifyRefreshTokenJwt = async (
    refreshToken: string,
  ): Promise<{ isValid: boolean; data: JwtPayload; error?: any }> => {
    try {
      const data = await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH,
      });

      return { isValid: true, data };
    } catch (error) {
      return {
        isValid: false,
        error,
        data: { errorName: error.name },
      };
    }
  };

  verifyJwtAccessToken = async (
    accessToken: string,
  ): Promise<{ isValid: boolean; data: any; error?: any }> => {
    try {
      const data = await this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      return { isValid: true, ...data };
    } catch (error) {
      return {
        isValid: false,
        error,
        data: { errorName: error.name },
      };
    }
  };

  handleTokens = async (
    accessToken: string,
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    data: any;
    isRefreshed: boolean;
    isValid: boolean;
  }> => {
    try {
      const accessTokenValidation =
        await this.verifyJwtAccessToken(accessToken);
  


      if (accessTokenValidation.isValid) {
        return {
          accessToken: accessToken,
          data: {...accessTokenValidation.data},
          isRefreshed: false,
          isValid: true,
        };
      }

      if (accessTokenValidation.data?.errorName !== 'TokenExpiredError') {
        throw new UnauthorizedException();
      }

      const isValidRefreshToken =
        await this.verifyRefreshTokenJwt(refreshToken);

      if (!isValidRefreshToken.isValid) throw new UnauthorizedException();

      const userId = isValidRefreshToken.data.sub;

      const userData = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        omit: {
          password: true,
        },
        include: { metadata: true },
      });
       
      if (!userData) throw new NotFoundException();

      const newAccessToken = await this.createAccessTokenJwt(userData);

      if (!newAccessToken) throw new InternalServerErrorException();

      const tokenData = await this.verifyJwtAccessToken(newAccessToken);

      return {
        accessToken: newAccessToken,
        data: {...tokenData.data},
        isRefreshed: true,
        isValid: true,
      };
    } catch (ErrorFromJwtValidation) {
      console.log(ErrorFromJwtValidation);
      throw new UnauthorizedException();
    }
  };

  singIn = async (
    passwordToCompare: string,
    email: string,
  ): Promise<{
    userData: Partial<user>;
    accessToken: string;
    refreshToken: string;
  }> => {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
        include:{
          metadata:true
        }
      });

      if (!userExist) throw new NotFoundException();

      const isPasswordCorrect = await bcrypt.compare(
        passwordToCompare,
        userExist.password,
      );

      if (!isPasswordCorrect) throw new UnauthorizedException();

      const { password, ...safeUserData } = userExist;

      const newAccessToken = await this.createAccessTokenJwt(safeUserData);

      const newRfreshToken = await this.createRefreshTokenJwt(userExist.id);

      return {
        userData: safeUserData,
        accessToken: newAccessToken,
        refreshToken: newRfreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

 
}
