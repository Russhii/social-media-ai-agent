import { redirect } from "next/navigation";
import { createInsForgeServerClient } from "@/app/lib/insforge/server";
import { getUserCampaign } from "@/app/lib/campaigns";
import { CampaignWizard } from "@/app/components/campaign-wizard";

export default async function CreateCampaignPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data.user) redirect("/sign-in");
  let campaignExists = false;
  try {
    campaignExists = Boolean(await getUserCampaign(data.user.id));
  } catch {
    // Keep setup visible; the create action will show a recoverable error if the table is unavailable.
  }
  if (campaignExists) redirect("/dashboard");
  const params = await searchParams;
  const errorMessages: Record<string, string> = {
    complete_setup: "Add a campaign name and choose an office to continue.",
    invalid_setup: "That campaign setup is invalid. Please try again.",
    campaign_lookup: "We couldn't check your campaigns. Please try again.",
    campaign_create: "We couldn't create your campaign. Please try again.",
  };
  return <CampaignWizard error={errorMessages[params.error ?? ""]} />;
}
