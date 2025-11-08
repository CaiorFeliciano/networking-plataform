import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { AdminApplicationsController } from './admin-applications.controller';
import { AdminApiKeyGuard } from '../auth/admin-api-key.guard';

@Module({
  controllers: [ApplicationsController, AdminApplicationsController],
  providers: [ApplicationsService, AdminApiKeyGuard],
})
export class ApplicationsModule {}
