import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(request: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ message: "Dosya gerekli" }, { status: 400 });
    }

    // Dosya adını oluştur: user_id/timestamp.jpg
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${user.id}/${timestamp}.${fileExt}`;

    // Supabase Storage'a yükle (meals bucket'ına)
    const { error: uploadError } = await supabase.storage
      .from("meals")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { message: "Fotoğraf yüklenemedi: " + uploadError.message },
        { status: 500 }
      );
    }

    // Public URL'i al
    const { data: urlData } = supabase.storage
      .from("meals")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: fileName,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      {
        message: "Fotoğraf yüklenirken hata oluştu",
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}


