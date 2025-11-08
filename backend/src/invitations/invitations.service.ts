import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async createInvitation(applicationId: string) {
    // Verifica se a aplicação existe e foi aprovada
    const application = await this.prisma.memberApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== 'APPROVED') {
      throw new BadRequestException(
        'Only approved applications can receive invitations',
      );
    }

    // Verifica se já existe um convite para esta aplicação
    const existingInvitation = await this.prisma.invitation.findUnique({
      where: { applicationId },
    });

    if (existingInvitation) {
      throw new BadRequestException(
        'Invitation already exists for this application',
      );
    }

    // Cria o convite com token único
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    const invitation = await this.prisma.invitation.create({
      data: {
        token,
        email: application.email,
        applicationId: application.id,
        expiresAt,
      },
    });

    return invitation;
  }

  async validateInvitation(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { application: true },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.usedAt) {
      throw new BadRequestException('Invitation has already been used');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    return invitation;
  }

  async markInvitationAsUsed(token: string) {
    return this.prisma.invitation.update({
      where: { token },
      data: { usedAt: new Date() },
    });
  }
}
