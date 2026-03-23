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
  if (!user) throw new Error("Unauthorized");

  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminProfile?.is_admin) {
    console.error("Access Denied: User is not admin", user.email);
    throw new Error("Unauthorized Admin Only");
  }

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({ is_approved: approved })
    .eq("id", jewelerId);

  if (error) {
    console.error("Approve Jeweler Error:", error);
    throw error;
  }

  revalidatePath("/admin");
}

export async function toggleVIP(jewelerId: string, verified: boolean) {
  "use server";
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminProfile?.is_admin) {
    console.error("Access Denied: User is not admin", user.email);
    throw new Error("Unauthorized Admin Only");
  }

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({ is_verified: verified })
    .eq("id", jewelerId);

  if (error) {
    console.error("Toggle VIP Error:", error);
    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

// Automated Admin Provisioning
export async function ensureAdminProfile(userId: string, email: string) {
  const masterEmail = "ibrahmyldrim@gmail.com";
  if (email.toLowerCase() !== masterEmail.toLowerCase()) return null;

  const supabase = createClient();
  
  // Upsert the master admin profile
  const { data, error } = await supabase
    .from("jeweler_profiles")
    .upsert({
      user_id: userId,
      name: "Sistem Yöneticisi",
      slug: "platform-admin",
      address: "LIZBON-HQ",
      is_admin: true,
      is_approved: true,
      is_verified: true
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error("Admin Provisioning Error:", error);
    return null;
  }
  return data;
}

export async function updateJewelerAdmin(formData: FormData) {
  "use server";
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Admin Check
  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  // Master bypass
  const isMaster = user.email?.toLowerCase() === "ibrahmyldrim@gmail.com";
  if (!adminProfile?.is_admin && !isMaster) throw new Error("Unauthorized Admin Only");

  const jewelerId = formData.get("id") as string;
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const instagram = formData.get("instagram") as string;
  const website = formData.get("website") as string;
  const map_url = formData.get("map_url") as string;
  const description = formData.get("description") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;
  const is_approved = formData.get("is_approved") === "on";
  const is_verified = formData.get("is_verified") === "on";

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({
      name,
      address,
      phone,
      instagram,
      website,
      map_url,
      description,
      sort_order,
      is_approved,
      is_verified
    })
    .eq("id", jewelerId);

  if (error) {
    console.error("Update Jeweler Admin Error:", error);
    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/kuyumcular/[slug]`);
}

export async function createJewelerAdmin(formData: FormData) {
  "use server";
  const supabase = createClient();
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser) throw new Error("Unauthorized");

  // Admin Check
  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", adminUser.id)
    .maybeSingle();

  const isMaster = adminUser.email?.toLowerCase() === "ibrahmyldrim@gmail.com";
  if (!adminProfile?.is_admin && !isMaster) throw new Error("Unauthorized Admin Only");

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) throw new Error("Email ve Şifre gereklidir.");

  // 1. Create Auth User via Admin API
  const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (authError) {
    console.error("Auth Admin Create Error:", authError);
    throw new Error(`Kullanıcı oluşturulamadı: ${authError.message}`);
  }

  // 2. Generate slug
  let slug = turkishToEnglish(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  
  if (!slug) slug = `kuyumcu-${newUser.user.id.substring(0, 5)}`;

  // 3. Create Profile linked to the new user
  const { error: profileError } = await supabase
    .from("jeweler_profiles")
    .insert({
      user_id: newUser.user.id,
      name,
      slug,
      address,
      is_approved: true,
      is_verified: false,
      sort_order: 0
    });

  if (profileError) {
    console.error("Admin Profile Create Error:", profileError);
    // If it fails, we should ideally delete the auth user, but for now we throw
    throw new Error(`Mağaza profili oluşturulamadı: ${profileError.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
