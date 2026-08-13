"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, RefreshCw, Share2, UsersRound } from "lucide-react";
import { Ability } from "../../lib/ability";

const labels: Record<string, string> = { attack: "攻撃力", defense: "防御力", versatility: "汎用性", difficulty: "難易度", growth: "成長性" };

export default function AbilityPage() {
  const [ability, setAbility] = useState<Ability | null>(null);
  const [error, setError] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const generate = async () => {
    setError(false);
    const raw = sessionStorage.getItem("orbital-result");
    if (!raw) return;
    try {
      const response = await fetch("/api/generate-ability", { method: "POST", headers: { "Content-Type": "application/json" }, body: raw });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setAbility(data.ability);
      sessionStorage.setItem("orbital-ability", JSON.stringify(data.ability));
    } catch { setError(true); }
  };
  const download = () => {
    if (!ability) return;
    const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1350;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, "#0e1636"); gradient.addColorStop(1, "#080a18");
    context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1350);
    context.strokeStyle = "#55e6db"; context.lineWidth = 3; context.strokeRect(65, 65, 950, 1220);
    context.fillStyle = "#55e6db"; context.font = "500 30px sans-serif"; context.fillText("ORBITAL / PERSONAL ABILITY CARD", 110, 150);
    context.fillStyle = "#fff"; context.font = "900 88px sans-serif"; context.fillText(ability.type, 110, 300);
    context.fillStyle = "#9c78ff"; context.font = "700 52px sans-serif"; context.fillText(ability.abilityName, 110, 410);
    context.fillStyle = "#cbd5f1"; context.font = "34px sans-serif"; context.fillText(ability.shortDescription.slice(0, 30), 110, 490);
    let y = 620; context.font = "500 36px sans-serif";
    Object.entries(ability.rating).forEach(([key, value]) => { context.fillStyle = "#cbd5f1"; context.fillText(labels[key], 110, y); context.fillStyle = "#55e6db"; context.fillRect(340, y - 28, value * 5, 22); context.fillStyle = "#fff"; context.fillText(String(value), 880, y); y += 95; });
    context.fillStyle = "#9ba8c7"; context.font = "28px sans-serif"; context.fillText("ORBITAL — PERSONAL ABILITY CARD", 110, 1180);
    const link = document.createElement("a"); link.href = canvas.toDataURL("image/png"); link.download = "orbital-ability-card.png"; link.click();
  };
  const share = async () => {
    if (!ability) return;
    const raw = sessionStorage.getItem("orbital-result");
    if (!raw) return;
    setShareMessage("");
    try {
      const response = await fetch("/api/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ diagnosis: JSON.parse(raw), ability }) });
      const data = await response.json();
      if (!data.id) throw new Error(data.error);
      await navigator.clipboard.writeText(`${location.origin}/share/${data.id}`);
      setShareMessage("共有URLをコピーしました。友達に送ると共闘診断に使えます。");
    } catch (cause) { setShareMessage(cause instanceof Error ? cause.message : "共有URLを作成できませんでした。"); }
  };
  useEffect(() => { const saved = sessionStorage.getItem("orbital-ability"); if (saved) setAbility(JSON.parse(saved)); else generate(); }, []);
  if (!ability) return <main className="shell hero"><div className="eyebrow">GENERATING YOUR ABILITY</div><h1>{error ? "生成に失敗しました" : "能力を設計中…"}</h1><button className="btn" onClick={generate}>{error ? "もう一度試す" : "少々お待ちください"}</button></main>;
  return <main className="shell"><nav className="nav"><Link className="logo" href="/">ORBITAL</Link><span className="pill">YOUR ABILITY</span></nav><section className="result-head"><div className="eyebrow">{ability.type}</div><h1 className="ability-name">{ability.abilityName}</h1><p className="muted">{ability.shortDescription}</p></section><section className="card"><div className="label">ABILITY PROFILE</div><p style={{ lineHeight: 1.9 }}>{ability.description}</p><div className="grid two"><div><div className="label">発動条件</div><p>{ability.activation}</p></div><div><div className="label">制約・誓約</div><p>{ability.restriction}<br />{ability.oath}</p></div></div><div className="label">弱点</div><p>{ability.weakness}</p></section><section className="card"><div className="label">STATUS</div>{Object.entries(ability.rating).map(([key, value]) => <div className="stat" key={key}><span>{labels[key]}</span><span className="bar"><i style={{ width: `${value}%` }} /></span><b>{value}</b></div>)}</section><section className="card"><div className="label">WHY THIS FITS YOU</div><p className="muted" style={{ lineHeight: 1.9 }}>{ability.reason}</p></section><section className="card ability-card-guide"><div className="label">ABILITY CARD IMAGE</div><h2>能力カードを保存・共有</h2><p className="muted">名前、タイプ、能力値を1080×1350の縦長PNGカードにして保存できます。</p></section><div className="grid two"><button className="btn" onClick={download}><Download size={17} />能力カードをPNG保存</button><button className="btn secondary" onClick={generate}><RefreshCw size={17} />能力を再生成</button></div><button className="btn secondary" style={{ width: "100%" }} onClick={share}><Share2 size={17} />共有URLをコピー</button>{shareMessage && <p className="share-message">{shareMessage}</p>}<Link className="btn co-op-link" href="/co-op"><UsersRound size={18} />友達との相性・共闘診断へ</Link></main>;
}
