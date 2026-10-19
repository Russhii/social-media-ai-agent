import { redirect } from "next/navigation";
import { createInsForgeServerClient } from "@/app/lib/insforge/server";
import { getUserCampaign } from "@/app/lib/campaigns";
import { DashboardWorkspace } from "@/app/components/dashboard-workspace";

export default async function DashboardPage() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data.user) redirect("/sign-in");

  let campaign;
  try {
    campaign = await getUserCampaign(data.user.id);
  } catch {
    redirect("/create-campaign?error=campaign_lookup");
  }
  if (!campaign) redirect("/create-campaign");

  const profile = data.user as typeof data.user & { profile?: { name?: string; avatar_url?: string } };
  const name = profile.profile?.name || profile.email?.split("@")[0] || "there";
  return <DashboardWorkspace campaign={campaign} name={name} email={data.user.email ?? ""} />;
}
