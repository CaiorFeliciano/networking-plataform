import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminApiKeyGuard } from '../auth/admin-api-key.guard';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { InvitationsService } from '../invitations/invitations.service';

@Controller('admin/applications')
@UseGuards(AdminApiKeyGuard)
export class AdminApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly invitationsService: InvitationsService,
  ) {}

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

  @Post(':id/invite')
  async createInvitation(@Param('id') id: string) {
    const invitation = await this.invitationsService.createInvitation(id);

    // Simulação de envio de email
    console.log('📧 Email simulation:');
    console.log(`To: ${invitation.email}`);
    console.log(
      `Invitation Link: http://localhost:3001/register?token=${invitation.token}`,
    );
    console.log('---');

    return {
      message: 'Invitation created and email sent (simulated)',
      invitation,
      emailSimulation: {
        to: invitation.email,
        link: `http://localhost:3001/register?token=${invitation.token}`,
      },
    };
  }
}
