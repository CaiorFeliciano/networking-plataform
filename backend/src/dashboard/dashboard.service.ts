import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getPerformanceMetrics() {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const [
      activeMembers,
      monthlyReferrals,
      monthlyThanks,
      totalReferrals,
      totalThanks,
      pendingApplications,
    ] = await Promise.all([
      this.prisma.member.count({
        where: { status: 'ACTIVE' },
      }),

      this.prisma.referral.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      this.prisma.thank.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      this.prisma.referral.count(),

      this.prisma.thank.count(),

      this.prisma.memberApplication.count({
        where: { status: 'PENDING' },
      }),
    ]);

    const referralSuccessRate =
      totalReferrals > 0
        ? Math.round((monthlyReferrals / totalReferrals) * 100)
        : 0;

    const memberEngagementRate =
      activeMembers > 0 ? Math.round((monthlyThanks / activeMembers) * 100) : 0;

    return {
      overview: {
        activeMembers,
        monthlyReferrals,
        monthlyThanks,
        pendingApplications,
      },
      totals: {
        totalReferrals,
        totalThanks,
      },
      rates: {
        referralSuccessRate,
        memberEngagementRate,
      },
      period: {
        month: currentDate.toLocaleString('default', { month: 'long' }),
        year: currentDate.getFullYear(),
      },
    };
  }

  async getRecentActivity() {
    const [recentReferrals, recentThanks, recentMembers] = await Promise.all([
      this.prisma.referral.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          fromMember: { select: { firstName: true, lastName: true } },
          toMember: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.thank.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          fromMember: { select: { firstName: true, lastName: true } },
          toMember: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.member.findMany({
        take: 5,
        orderBy: { joinedAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company: true,
          joinedAt: true,
        },
      }),
    ]);

    return {
      recentReferrals,
      recentThanks,
      recentMembers,
    };
  }
}
