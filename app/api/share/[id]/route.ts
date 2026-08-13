import { NextResponse } from "next/server";
import { TYPES } from "../../../../lib/types";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "共有機能の設定がまだ完了していません。" }, { status: 503 });
  const response = await fetch(`${url}/rest/v1/diagnoses?diagnosis_id=eq.${encodeURIComponent(id)}&select=diagnosis_id,main_type,scores,ability`, {
    headers: { apikey: key },
    next: { revalidate: 60 },
  });
  if (!response.ok) return NextResponse.json({ error: "共有データを取得できませんでした。" }, { status: 502 });
  const [row] = await response.json();
  if (!row || !TYPES.includes(row.main_type) || !row.ability) return NextResponse.json({ error: "共有結果が見つかりません。" }, { status: 404 });
  return NextResponse.json({ id: row.diagnosis_id, mainType: row.main_type, scores: row.scores, ability: row.ability });
}
