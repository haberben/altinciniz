import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Türkçe Karakterleri İngilizce Karakterlere Çeviren Fonksiyon
function turkishToEnglish(text: string) {
    return text
        .replace(/Ğ/g, "G")
        .replace(/ğ/g, "g")
        .replace(/Ü/g, "U")
        .replace(/ü/g, "u")
        .replace(/Ş/g, "S")
        .replace(/ş/g, "s")
        .replace(/İ/g, "I")
        .replace(/ı/g, "i")
        .replace(/Ö/g, "O")
        .replace(/ö/g, "o")
        .replace(/Ç/g, "C")
        .replace(/ç/g, "c");
}

export async function submitProfile(formData: FormData) {
  "use server";
  
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const instagram = formData.get("instagram") as string;
  const website = formData.get("website") as string;
  
  // Güclendirilmiş Slug Jeneratörü
  const slug = turkishToEnglish(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // Create or Update profile
  const { error } = await supabase
    .from("jeweler_profiles")
    .upsert({
      user_id: user.id,
      name,
      slug: slug || `kuyumcu-${user.id.substring(0, 5)}`,
      address,
      instagram,
      website,
      is_approved: false, // Onay bekliyor olarak baslar
    }, { onConflict: 'user_id' });

  if (error) {
    console.error("Profile Submit Error:", error);
    throw new Error(`Veritabanı Hatası: ${error.message}`);
  }
  
  revalidatePath("/kuyumcu-paneli");
}

export async function updateOffset(formData: FormData) {
  "use server";

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get jeweler id
  const { data: profile } = await supabase
    .from("jeweler_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) throw new Error("Profil bulunamadı. Önce profil oluşturun.");

  const assetSlug = formData.get("asset_slug") as string;
  const buyOffset = parseFloat(formData.get("buy_offset") as string) || 0;
  const sellOffset = parseFloat(formData.get("sell_offset") as string) || 0;

  const { error } = await supabase
    .from("price_offsets")
    .upsert({
      jeweler_id: profile.id,
      asset_slug: assetSlug,
      buy_offset: buyOffset,
      sell_offset: sellOffset,
      updated_at: new Date().toISOString()
    }, { onConflict: 'jeweler_id,asset_slug' });

  if (error) throw error;

  revalidatePath("/kuyumcu-paneli");
  revalidatePath("/kuyumcular/[slug]");
}

export async function approveJeweler(jewelerId: string, approved: boolean) {
  "use server";
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user?.id)
    .single();

  if (!adminProfile?.is_admin) throw new Error("Unauthorized Admin Only");

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({ is_approved: approved })
    .eq("id", jewelerId);

  if (error) throw error;
  revalidatePath("/admin");
}

export async function toggleVIP(jewelerId: string, verified: boolean) {
  "use server";
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user?.id)
    .single();

  if (!adminProfile?.is_admin) throw new Error("Unauthorized Admin Only");

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({ is_verified: verified })
    .eq("id", jewelerId);

  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/");
}
