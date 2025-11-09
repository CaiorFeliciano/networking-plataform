import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminApiKeyGuard } from '../auth/admin-api-key.guard';

@Controller('dashboard')
@UseGuards(AdminApiKeyGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  getPerformanceMetrics() {
    return this.dashboardService.getPerformanceMetrics();
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }

  @Get('overview')
  getOverview() {
    return this.dashboardService.getPerformanceMetrics();
  }
}
