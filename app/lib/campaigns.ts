import { createInsForgeServerClient } from "@/app/lib/insforge/server";

export type Campaign = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  office_image: string;
  created_at: string;
};

export async function getUserCampaign(userId: string) {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.database
    .from("campaign")
    .select("id, user_id, name, icon, office_image, created_at")
    .eq("user_id", userId)
    .limit(1);

  if (error) throw new Error(error.message);
  return (data?.[0] as Campaign | undefined) ?? null;
}
