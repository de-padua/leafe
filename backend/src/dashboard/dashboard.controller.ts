import {
  Body,
  Controller,
  Get,
  HttpStatus,
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

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @UseGuards(AuthGuard)
  @Post()
  async GetUserDataDashboard(
    @Req() request: CustomRequestWithId,
    @Body()
    body: {
      type: 'AP' | 'HOUSE' | "LAND" | null;
      filterBy: string | null;
      search: string | null;
      pageOffset:number
      isActive:boolean | null
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return response.status(HttpStatus.UNAUTHORIZED);

    const {type,filterBy,search,pageOffset,isActive} = body
    const userId = request.id;
 
    

    const dashboardData = await this.dashboardService.getDashboardData(userId,type,filterBy,search,pageOffset,isActive);
    return dashboardData;
  }
}
