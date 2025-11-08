import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { InvitationsService } from '../invitations/invitations.service';

@Injectable()
export class MembersService {
  constructor(
    private prisma: PrismaService,
    private invitationsService: InvitationsService,
  ) {}

  async registerMember(token: string, createMemberDto: CreateMemberDto) {
    const invitation = await this.invitationsService.validateInvitation(token);

    if (invitation.email !== createMemberDto.email) {
      throw new BadRequestException('Email does not match invitation');
    }

    const existingMember = await this.prisma.member.findUnique({
      where: { email: createMemberDto.email },
    });

    if (existingMember) {
      throw new ConflictException('Member already exists with this email');
    }

    const member = await this.prisma.member.create({
      data: {
        ...createMemberDto,

        invitation: {
          connect: { id: invitation.id },
        },
      },
    });

    await this.invitationsService.markInvitationAsUsed(token);

    return member;
  }

  async findAll() {
    return this.prisma.member.findMany({
      orderBy: {
        joinedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.member.findUnique({
      where: { id },
    });
  }
}
