import { requireAuth } from "@/shared/auth/require-auth";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { EmptyOrgsState } from "@/components/organizations/empty-orgs-state";

export default async function DashboardPage() {
  const session = await requireAuth();
  const orgs = await organizationRepository.findByUserId(session.id);

  if (orgs.length === 0) {
    return <EmptyOrgsState />;
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
    </div>
  );
}
