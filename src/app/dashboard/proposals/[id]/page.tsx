import ProposalEditPageClient from "./page.client";

export default function ProposalEditPage({ params }: { params: { id: string } }) {
  return <ProposalEditPageClient id={params.id} />;
} 