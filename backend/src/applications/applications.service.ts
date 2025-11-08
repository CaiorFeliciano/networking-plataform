import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    return this.prisma.memberApplication.create({
      data: createApplicationDto,
    });
  }

  async findAll() {
    return this.prisma.memberApplication.findMany({
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.memberApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async updateStatus(
    id: string,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    await this.findOne(id);

    return this.prisma.memberApplication.update({
      where: { id },
      data: {
        status: updateApplicationStatusDto.status,
        notes: updateApplicationStatusDto.notes,
        reviewedAt: new Date(),
      },
    });
  }
}
