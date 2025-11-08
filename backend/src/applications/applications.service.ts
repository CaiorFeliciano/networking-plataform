import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const existingApplication = await this.prisma.memberApplication.findUnique({
      where: { email: createApplicationDto.email },
    });

    if (existingApplication) {
      throw new BadRequestException('Já existe uma aplicação com este email');
    }

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
    if (id.length < 20) {
      throw new BadRequestException('ID inválido');
    }

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
    const application = await this.findOne(id);

    // Impede mudar status de aplicações já revisadas (opcional)
    if (application.reviewedAt && application.status !== 'PENDING') {
      throw new BadRequestException('Esta aplicação já foi revisada');
    }

    return this.prisma.memberApplication.update({
      where: { id },
      data: {
        status: updateApplicationStatusDto.status,
        notes: updateApplicationStatusDto.notes,
        reviewedAt: new Date(),
      },
    });
  }

  // Novo método para estatísticas (útil para admin)
  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.memberApplication.count(),
      this.prisma.memberApplication.count({ where: { status: 'PENDING' } }),
      this.prisma.memberApplication.count({ where: { status: 'APPROVED' } }),
      this.prisma.memberApplication.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }
}
