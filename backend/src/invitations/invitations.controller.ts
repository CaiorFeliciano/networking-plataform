import { Controller, Get, Param } from '@nestjs/common';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get('validate/:token')
  async validateInvitation(@Param('token') token: string) {
    const invitation = await this.invitationsService.validateInvitation(token);

    return {
      valid: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        application: {
          firstName: invitation.application.firstName,
          lastName: invitation.application.lastName,
          company: invitation.application.company,
        },
      },
    };
  }
}
