"use server";

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

export async function submitProfile(prevState: any, formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Oturum açılamadı. Lütfen tekrar giriş yapın." };

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;

    if (!name || !address) return { success: false, error: "Mağaza adı ve adres gereklidir." };
    
    const baseSlug = turkishToEnglish(name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `kuyumcu-${user.id.substring(0, 5)}`;

    let finalSlug = baseSlug;

    const { data: conflict } = await supabase
      .from("jeweler_profiles")
      .select("user_id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (conflict && conflict.user_id !== user.id) {
       finalSlug = `${baseSlug}-${Math.random().toString(36).substring(0, 4)}`;
    }

    const { error } = await supabase
      .from("jeweler_profiles")
      .upsert({
        user_id: user.id,
        name,
        slug: finalSlug,
        address,
        is_approved: false,
      }, { onConflict: 'user_id' });

    if (error) return { success: false, error: error.message };
    
    revalidatePath("/kuyumcu-paneli");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("FATAL: submitProfile failed:", err);
    return { success: false, error: err.message || "Profil oluşturulurken beklenmedik bir hata oluştu." };
  }
}

export async function updateOffset(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

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
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminProfile?.is_admin) {
    throw new Error("Unauthorized Admin Only");
  }

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({ is_approved: approved })
    .eq("id", jewelerId);

  if (error) throw error;

  revalidatePath("/admin");
}

export async function toggleVIP(jewelerId: string, verified: boolean) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminProfile?.is_admin) {
    throw new Error("Unauthorized Admin Only");
  }

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({ is_verified: verified })
    .eq("id", jewelerId);

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function ensureAdminProfile(userId: string, email: string) {
  const masterEmail = "ibrahmyldrim@gmail.com";
  if (email.toLowerCase() !== masterEmail.toLowerCase()) return null;

  const supabase = createClient();
  
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
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: adminProfile } = await supabase
    .from("jeweler_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  const isMaster = user.email?.toLowerCase() === "ibrahmyldrim@gmail.com";
  if (!adminProfile?.is_admin && !isMaster) throw new Error("Unauthorized Admin Only");

  const jewelerId = formData.get("id") as string;
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const is_approved = formData.get("is_approved") === "on";
  const is_verified = formData.get("is_verified") === "on";

  const { error } = await supabase
    .from("jeweler_profiles")
    .update({
      name,
      address,
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

export async function createJewelerAdmin(prevState: any, formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    if (!adminUser) return { success: false, error: "Oturum açılmamış." };

    const { data: adminProfile } = await supabase
      .from("jeweler_profiles")
      .select("is_admin")
      .eq("user_id", adminUser.id)
      .maybeSingle();

    const isMaster = adminUser.email?.toLowerCase() === "ibrahmyldrim@gmail.com";
    if (!adminProfile?.is_admin && !isMaster) return { success: false, error: "Yetkisiz işlem." };

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) return { success: false, error: "Email, Şifre ve Mağaza Adı gereklidir." };

    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (authError) return { success: false, error: `Kullanıcı oluşturma hatası: ${authError.message}` };

    const baseSlug = turkishToEnglish(name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `kuyumcu-${newUser.user.id.substring(0, 5)}`;
    
    let finalSlug = baseSlug;

    const { data: conflict } = await supabase
      .from("jeweler_profiles")
      .select("id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (conflict) {
       finalSlug = `${baseSlug}-${Math.random().toString(36).substring(0, 4)}`;
    }

    const { error: profileError } = await supabase
      .from("jeweler_profiles")
      .insert({
        user_id: newUser.user.id,
        name,
        slug: finalSlug,
        address,
        is_approved: true,
        is_verified: false,
      });

    if (profileError) {
       return { success: false, error: `Profil oluşturma hatası: ${profileError.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("FATAL: createJewelerAdmin failed:", err);
    return { success: false, error: err.message || "Beklenmedik bir hata oluştu." };
  }
}
