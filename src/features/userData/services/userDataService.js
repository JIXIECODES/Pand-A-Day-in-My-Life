import { supabase } from "../../../lib/supabase.js";

const USER_DATA_TABLE = "user_data";
const RETURNING_FIELDS = "data, schema_version, updated_at";

export async function fetchUserData(userId) {
  const { data, error } = await supabase
    .from(USER_DATA_TABLE)
    .select(RETURNING_FIELDS)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error("Unable to load account data.");
  return data || null;
}

export async function saveUserData(userId, data, expectedUpdatedAt = null) {
  const values = { data, schema_version: 1 };
  const query = expectedUpdatedAt
    ? supabase
      .from(USER_DATA_TABLE)
      .update(values)
      .eq("user_id", userId)
      .eq("updated_at", expectedUpdatedAt)
    : supabase
      .from(USER_DATA_TABLE)
      .insert({ ...values, user_id: userId });

  const { data: saved, error } = await query.select(RETURNING_FIELDS).maybeSingle();
  if (error || !saved) throw new Error("Unable to save account data safely.");
  return saved;
}