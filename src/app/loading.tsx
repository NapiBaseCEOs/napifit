import AiLoadingScreen from "@/components/ui/AiLoadingScreen";

export default function Loading() {
  return (
    <AiLoadingScreen
      title="NapiBase servisleri hazırlanıyor"
      message="Edge cache, Supabase session ve inference gateway senkronize ediliyor..."
      variant="fullscreen"
    />
  );
}

