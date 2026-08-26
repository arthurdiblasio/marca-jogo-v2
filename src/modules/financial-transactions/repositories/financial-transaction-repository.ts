import { prisma } from "@/lib/prisma";

export const financialTransactionRepository = {
  listByOrganization(organizationId: string) {
    return prisma.financialTransaction.findMany({
      where: { organizationId },
      include: { createdBy: { select: { id: true, profile: { select: { fullName: true } } } } },
      orderBy: { occurredAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.financialTransaction.findUnique({ where: { id } });
  },

  create(data: {
    organizationId: string;
    createdById: string;
    type: "INCOME" | "EXPENSE";
    amountCents: number;
    description: string;
    occurredAt: Date;
  }) {
    return prisma.financialTransaction.create({ data });
  },

  createMany(
    entries: {
      organizationId: string;
      createdById: string;
      type: "INCOME" | "EXPENSE";
      amountCents: number;
      description: string;
      occurredAt: Date;
    }[],
  ) {
    return prisma.financialTransaction.createMany({ data: entries });
  },

  updateStatus(id: string, status: "PENDING" | "PAID" | "CANCELLED") {
    return prisma.financialTransaction.update({ where: { id }, data: { status } });
  },

  remove(id: string) {
    return prisma.financialTransaction.delete({ where: { id } });
  },

  async getSummary(organizationId: string) {
    const [income, expense] = await Promise.all([
      prisma.financialTransaction.aggregate({
        where: { organizationId, type: "INCOME", status: "PAID" },
        _sum: { amountCents: true },
      }),
      prisma.financialTransaction.aggregate({
        where: { organizationId, type: "EXPENSE", status: "PAID" },
        _sum: { amountCents: true },
      }),
    ]);

    const incomeCents = income._sum.amountCents ?? 0;
    const expenseCents = expense._sum.amountCents ?? 0;

    return {
      incomeCents,
      expenseCents,
      balanceCents: incomeCents - expenseCents,
    };
  },
};
