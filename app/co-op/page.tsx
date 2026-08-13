"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Shield, Swords, UsersRound } from "lucide-react";
import { Ability } from "../../lib/ability";
import { buildCompatibility, Compatibility, SharedProfile } from "../../lib/compatibility";
import { Diagnosis } from "../../lib/types";

function ownProfile(): SharedProfile | null {
  const diagnosis = sessionStorage.getItem("orbital-result");
  const ability = sessionStorage.getItem("orbital-ability");
  if (!diagnosis || !ability) return null;
  const d = JSON.parse(diagnosis) as Diagnosis;
  return { mainType: d.mainType, scores: d.scores, ability: JSON.parse(ability) as Ability };
}

function getId(value: string) {
  const match = value.trim().match(/(?:\/share\/)?([0-9a-f-]{36})\/?$/i);
  return match?.[1] ?? null;
}

export default function CoOpPage() {
  const [me, setMe] = useState<SharedProfile | null>(null);
  const [friendUrl, setFriendUrl] = useState("");
  const [friend, setFriend] = useState<SharedProfile | null>(null);
  const [result, setResult] = useState<Compatibility | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setMe(ownProfile()), []);

  async function diagnose(event: FormEvent) {
    event.preventDefault();
    const id = getId(friendUrl);
    if (!id) return setError("友達の共有URLをそのまま貼り付けてください。");
    if (!me) return setError("先にあなた自身の診断と能力生成を完了してください。");
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/share/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFriend(data); setResult(buildCompatibility(me, data));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "相性を測定できませんでした。"); }
    finally { setLoading(false); }
  }

  return <main className="shell">
    <nav className="nav"><Link className="logo" href="/">ORBITAL</Link><span className="pill">CO-OP SCAN</span></nav>
    <section className="result-head"><div className="eyebrow">TWO PERSON SYNERGY</div><h1 className="ability-name">共闘適性診断</h1><p className="muted">友達の共有URLを読み込み、2人の役割と連携技を測定します。</p></section>
    <section className="card">
      <div className="label">YOUR STATUS</div>
      {me ? <p><b>{me.mainType}</b> ／ {me.ability.abilityName}</p> : <><p className="muted">あなたの診断結果がこの端末にありません。</p><Link className="btn secondary" href="/diagnosis">先に診断する</Link></>}
    </section>
    <form className="card co-op-form" onSubmit={diagnose}>
      <label className="label" htmlFor="friend-url">FRIEND&apos;S SHARE URL</label>
      <input id="friend-url" value={friendUrl} onChange={(e) => setFriendUrl(e.target.value)} placeholder="https://…/share/xxxxxxxx" />
      <button className="btn" disabled={loading || !me}><UsersRound size={18}/>{loading ? "測定中…" : "相性を測定する"}</button>
      {error && <p className="form-error">{error}</p>}
    </form>
    {result && friend && <section className="co-op-result">
      <div className="compatibility-score"><span>COMPATIBILITY</span><b>{result.score}%</b><strong>GRADE {result.grade}</strong></div>
      <div className="grid two"><article className="card"><div className="label">TEAM STYLE</div><h2>{result.style}</h2><p className="muted">{result.summary}</p></article><article className="card"><div className="label">YOUR ROLES</div><p><b>あなた：</b>{result.roles[0]}</p><p><b>友達：</b>{result.roles[1]}</p></article></div>
      <article className="card"><div className="label"><Swords size={14}/> COMBO MOVE</div><h2>二重軌道・共鳴連携</h2><p>{result.combo}</p></article>
      <article className="card"><div className="label"><Shield size={14}/> FRIEND PROFILE</div><p><b>{friend.mainType}</b> ／ {friend.ability.abilityName}</p><p className="muted">{friend.ability.shortDescription}</p></article>
    </section>}
  </main>;
}
