import { NextRequest, NextResponse } from "next/server";
import { validDiagnosis } from "../../../lib/server";
import { TYPES } from "../../../lib/types";

export const dynamic = "force-dynamic";

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_LEGACY_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { url, key } = getSupabaseConfig();
    const id = request.nextUrl.searchParams.get("id");
    if (!id || !url || !key) {
      return NextResponse.json({ error: "共有結果を取得できません。" }, { status: 400 });
    }
    const response = await fetch(`${url}/rest/v1/diagnoses?diagnosis_id=eq.${encodeURIComponent(id)}&select=diagnosis_id,main_type,scores,ability`, {
      headers: { apikey: key }, next: { revalidate: 60 },
    });
    const [row] = await response.json();
    if (!response.ok || !row) return NextResponse.json({ error: "共有結果が見つかりません。" }, { status: 404 });
    return NextResponse.json({ id: row.diagnosis_id, mainType: row.main_type, scores: row.scores, ability: row.ability });
  } catch {
    return NextResponse.json({ error: "共有結果を取得できません。" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, key } = getSupabaseConfig();
    if (!body?.ability || !TYPES.includes(body.ability.type)) {
      return NextResponse.json({ error: "Invalid share data" }, { status: 400 });
    }
    if (!url || !key) {
      return NextResponse.json({ error: "共有機能を有効にするにはSupabaseを設定してください。", configuration: { url: Boolean(url), key: Boolean(key) } }, { status: 503 });
    }
    const diagnosis = validDiagnosis(body.diagnosis) ? body.diagnosis : null;
    const mainType = diagnosis?.mainType ?? body.ability.type;
    const scores = diagnosis?.scores ?? Object.fromEntries(TYPES.map((type) => [type, type === mainType ? 100 : 40]));
    const id = crypto.randomUUID();
    const response = await fetch(`${url}/rest/v1/diagnoses`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ diagnosis_id: id, main_type: mainType, scores, personality: null, ability: body.ability, ability_rating: body.ability.rating }),
    });
    if (!response.ok) {
      return NextResponse.json({ error: "共有リンクを作成できませんでした。", upstreamStatus: response.status }, { status: 502 });
    }
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "共有リンクを作成できませんでした。" }, { status: 500 });
  }
}
