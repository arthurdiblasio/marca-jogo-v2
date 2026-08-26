import { redirect } from "next/navigation";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { StatStrip } from "@/components/football/stat-strip";
import { CreateTransactionForm } from "@/components/finance/create-transaction-form";
import { TransactionList } from "@/components/finance/transaction-list";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { financialTransactionRepository } from "@/modules/financial-transactions/repositories/financial-transaction-repository";
import { formatPriceCents } from "@/modules/game-listings/lib/format";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export default async function PeladaFinanceiroPage() {
  const session = await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const membership = await requireOrgMembership(session.id, activeOrgId);
  const isManager = MANAGER_ROLES.includes(membership.role);

  const [transactions, summary] = await Promise.all([
    financialTransactionRepository.listByOrganization(activeOrgId),
    financialTransactionRepository.getSummary(activeOrgId),
  ]);

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Pelada"
        title="Financeiro"
        description="Mensalidades, avulsos e despesas da pelada em um só lugar."
      />

      <StatStrip
        items={[
          { label: "Saldo", value: formatPriceCents(summary.balanceCents) },
          { label: "Entradas", value: formatPriceCents(summary.incomeCents) },
          { label: "Saídas", value: formatPriceCents(summary.expenseCents) },
        ]}
      />

      {isManager && <CreateTransactionForm organizationId={activeOrgId} />}

      <TransactionList transactions={transactions} isManager={isManager} />
    </PageTransition>
  );
}
