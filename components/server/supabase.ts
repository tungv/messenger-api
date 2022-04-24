import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { AsyncLocalStorage } from "async_hooks";

interface Context {
  client: SupabaseClient;
}

async function createSupabaseClient() {
  const supabase = createClient(
    "https://ywdzxbvtlrcgdyocydtv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZHp4YnZ0bHJjZ2R5b2N5ZHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA3ODk1MjEsImV4cCI6MTk2NjM2NTUyMX0.NeGmtsw_B0zYZfn7MW8T0a1bg2nlyTgngw5lDi58Sm8"
  );

  return supabase;
}

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export async function withDb<T = unknown>(handler: () => Promise<T>) {
  const client = await createSupabaseClient();
  try {
    await asyncLocalStorage.run({ client }, handler);
  } finally {
    await client.removeAllSubscriptions();
  }
}

export function getClient(): Context["client"] {
  return asyncLocalStorage.getStore()!.client;
}
