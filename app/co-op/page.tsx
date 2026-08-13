"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Shield, Swords, UsersRound } from "lucide-react";
import { Ability } from "../../lib/ability";
import { BattleAnalysis, buildBattle, buildCompatibility, Compatibility, SharedProfile } from "../../lib/compatibility";
import { Diagnosis } from "../../lib/types";

type Mode = "co-op" | "battle";

function ownProfile(): SharedProfile | null {
  const diagnosis = sessionStorage.getItem("orbital-result");
  const ability = sessionStorage.getItem("orbital-ability");
  if (!diagnosis || !ability) return null;
  const result = JSON.parse(diagnosis) as Diagnosis;
  return { mainType: result.mainType, scores: result.scores, ability: JSON.parse(ability) as Ability };
}

function getId(value: string) {
  return value.trim().match(/(?:\/share\/)?([0-9a-f-]{36})\/?$/i)?.[1] ?? null;
}

export default function CoOpPage() {
  const [mode, setMode] = useState<Mode>("co-op");
  const [me, setMe] = useState<SharedProfile | null>(null);
  const [friendUrl, setFriendUrl] = useState("");
  const [friend, setFriend] = useState<SharedProfile | null>(null);
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [battle, setBattle] = useState<BattleAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMe(ownProfile());
    setMode(new URLSearchParams(window.location.search).get("mode") === "battle" ? "battle" : "co-op");
  }, []);

  const isBattle = mode === "battle";
  const title = isBattle ? "友達と対戦診断" : "共闘適性診断";

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
      setFriend(data);
      setCompatibility(isBattle ? null : buildCompatibility(me, data));
      setBattle(isBattle ? buildBattle(me, data) : null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "相手の結果を取得できませんでした。");
    } finally { setLoading(false); }
  }

  return <main className="shell">
    <nav className="nav"><Link className="logo" href="/">ORBITAL</Link><span className="pill">{isBattle ? "BATTLE SCAN" : "CO-OP SCAN"}</span></nav>
    <section className="result-head"><div className="eyebrow">{isBattle ? "TWO PERSON BATTLE" : "TWO PERSON SYNERGY"}</div><h1 className="ability-name">{title}</h1><p className="muted">{isBattle ? "友達の共有URLから、能力相性と勝ち筋をシミュレーションします。" : "友達の共有URLを読み込み、2人の役割と連携技を測定します。"}</p></section>
    <div className="grid two"><Link className={`btn ${!isBattle ? "" : "secondary"}`} href="/co-op">共闘適性診断</Link><Link className={`btn ${isBattle ? "" : "secondary"}`} href="/co-op?mode=battle"><Swords size={18} />友達と対戦する</Link></div>
    <section className="card"><div className="label">YOUR STATUS</div>{me ? <p><b>{me.mainType}</b> ・ {me.ability.abilityName}</p> : <><p className="muted">あなたの診断結果がこの端末にありません。</p><Link className="btn secondary" href="/diagnosis">先に診断する</Link></>}</section>
    <form className="card co-op-form" onSubmit={diagnose}>
      <label className="label" htmlFor="friend-url">FRIEND&apos;S SHARE URL</label>
      <input id="friend-url" value={friendUrl} onChange={(event) => setFriendUrl(event.target.value)} placeholder="https://…/share/xxxxxxxx" />
      <button className="btn" disabled={loading || !me}>{isBattle ? <Swords size={18} /> : <UsersRound size={18} />}{loading ? "測定中…" : isBattle ? "対戦をシミュレーションする" : "相性を測定する"}</button>
      {error && <p className="form-error">{error}</p>}
    </form>
    {compatibility && friend && <section className="co-op-result"><div className="compatibility-score"><span>COMPATIBILITY</span><b>{compatibility.score}%</b><strong>GRADE {compatibility.grade}</strong></div><div className="grid two"><article className="card"><div className="label">TEAM STYLE</div><h2>{compatibility.style}</h2><p className="muted">{compatibility.summary}</p></article><article className="card"><div className="label">YOUR ROLES</div><p><b>あなた：</b>{compatibility.roles[0]}</p><p><b>友達：</b>{compatibility.roles[1]}</p></article></div><article className="card"><div className="label"><Swords size={14} /> COMBO MOVE</div><h2>連携技・共闘コンボ</h2><p>{compatibility.combo}</p></article></section>}
    {battle && friend && <section className="co-op-result"><div className="compatibility-score"><span>WIN PROBABILITY</span><b>{battle.score}%</b><strong>{battle.advantage}</strong></div><div className="grid two"><article className="card"><div className="label">OPTIMAL DISTANCE</div><p>{battle.distance}</p></article><article className="card"><div className="label">OPENING MOVE</div><p>{battle.opening}</p></article></div><article className="card"><div className="label"><Swords size={14} /> BATTLE TACTIC</div><h2>勝ち筋</h2><p>{battle.tactic}</p><div className="label">注意点</div><p className="muted">{battle.warning}</p></article></section>}
    {friend && <article className="card"><div className="label"><Shield size={14} /> FRIEND PROFILE</div><p><b>{friend.mainType}</b> ・ {friend.ability.abilityName}</p><p className="muted">{friend.ability.shortDescription}</p></article>}
  </main>;
}
