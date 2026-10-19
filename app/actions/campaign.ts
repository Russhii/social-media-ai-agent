"use server";

import { createInsForgeServerClient } from "@/app/lib/insforge/server";
import { redirect } from "next/navigation";

export async function createCampaignAction(formData: FormData) {
  const insforge = await createInsForgeServerClient();
  const { data: auth, error: authError } = await insforge.auth.getCurrentUser();
  if (authError || !auth.user) redirect("/sign-in");

  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "✨");
  const officeImage = String(formData.get("office_image") ?? "");
  if (!name || name.length > 60 || !officeImage) redirect("/create-campaign?error=complete_setup");
  if (icon.length > 850_000 || !/^\/?offices\/(modern|wooden)-office\.png$/.test(officeImage)) {
    redirect("/create-campaign?error=invalid_setup");
  }

  const { data: existing, error: lookupError } = await insforge.database
    .from("campaign").select("id").eq("user_id", auth.user.id).limit(1);
  if (lookupError) redirect("/create-campaign?error=campaign_lookup");
  if (existing?.length) redirect("/dashboard");

  const { error } = await insforge.database.from("campaign").insert([{
    user_id: auth.user.id,
    name,
    icon,
    office_image: `/${officeImage}`,
  }]);
  if (error) redirect("/create-campaign?error=campaign_create");
  redirect("/dashboard");
}
