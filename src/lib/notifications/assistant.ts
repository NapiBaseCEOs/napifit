import type { PostgrestError } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/types";
import type { createSupabaseRouteClient } from "@/lib/supabase/route";

type SupabaseRouteClient = ReturnType<typeof createSupabaseRouteClient>;
type AssistantNotificationInsert =
  Database["public"]["Tables"]["assistant_notifications"]["Insert"];

export type AssistantNotificationType = "assistant_chat" | "assistant_proactive";

interface CreateAssistantNotificationOptions {
  supabase: SupabaseRouteClient;
  userId: string;
  title: string;
  message: string;
  type: AssistantNotificationType;
  link?: string;
  metadata?: Record<string, unknown>;
  dedupeKey?: string | null;
}

export async function createAssistantNotification({
  supabase,
  userId,
  title,
  message,
  type,
  link,
  metadata,
  dedupeKey,
}: CreateAssistantNotificationOptions) {
  if (!userId) return null;

  const sanitizedTitle = title.length > 120 ? `${title.slice(0, 117)}...` : title;
  const sanitizedMessage = message.length > 500 ? `${message.slice(0, 497)}...` : message;

  const payload: AssistantNotificationInsert = {
    user_id: userId,
    title: sanitizedTitle,
    message: sanitizedMessage,
    type,
    link: link || null,
    metadata: (metadata ?? null) as Json | null,
    dedupe_key: dedupeKey || null,
  };

  const { data, error } = await supabase
    .from("assistant_notifications")
    .insert(payload)
    .select()
    .single();

  if (error) {
    if (isUniqueViolation(error) && dedupeKey) {
      return null;
    }
    console.error("Assistant notification insert error:", error);
    return null;
  }

  return data;
}

function isUniqueViolation(error: PostgrestError) {
  return error.code === "23505";
}

