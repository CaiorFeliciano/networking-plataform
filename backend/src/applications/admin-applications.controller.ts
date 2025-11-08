import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminApiKeyGuard } from '../auth/admin-api-key.guard';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Controller('admin/applications')
@UseGuards(AdminApiKeyGuard)
export class AdminApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() UpdateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      id,
      UpdateApplicationStatusDto,
    );
  }

  @Get('stats')
  getStats() {
    return this.applicationsService.getStats();
  }
}
