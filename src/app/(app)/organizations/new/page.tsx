import { CreateOrganizationForm } from "@/components/organizations/create-organization-form";

export default function NewOrganizationPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <CreateOrganizationForm />
    </div>
  );
}
