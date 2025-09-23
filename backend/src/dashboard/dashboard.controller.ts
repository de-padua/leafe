import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, CustomRequestWithId } from 'src/auth/auth.guard';
import { DashboardService } from './dashboard.service';
import DashboardQuery from './dto/DashboardQuery';
import { UUID } from 'crypto';
import { queryObjects } from 'v8';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @UseGuards(AuthGuard)
  @Get()
  async GetUserDataDashboard(
    @Query('filterBy') filterBy: string,
    @Query('type') type: 'AP' | 'HOUSE' | 'LAND' | undefined,
    @Query('isActive') isActive: string,
    @Query('search') search: string | UUID | undefined,
    @Query('page') page: string,

    @Req() request: CustomRequestWithId,
    @Body()
    @Res({ passthrough: true })
    response: Response,
  ) {
    if (!request.id) return response.status(HttpStatus.UNAUTHORIZED);

    const userId = request.id;

    const dashboardData = await this.dashboardService.getDashboardData(
      userId,
      type,
      filterBy,
      search,
      page,
      isActive,
    );
    return dashboardData;
  }

  @UseGuards(AuthGuard)
  @Post()
  async GetPostById(
    @Req() request: CustomRequestWithId,
    @Body()
    data: {
      postId: string;
    },
    @Res({ passthrough: true })
    response: Response,
  ) {
    if (!request.id) return response.status(HttpStatus.UNAUTHORIZED);

    const userId = request.id;

    const postData = await this.dashboardService.getDashboardPostData(
      data.postId,
      userId,
    );
    return postData;
  }
}
