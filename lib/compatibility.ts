import { Ability } from "./ability";
import { AuraType } from "./types";

export type SharedProfile = {
  id?: string;
  mainType: AuraType;
  scores: Record<AuraType, number>;
  ability: Ability;
};

export type Compatibility = {
  score: number;
  grade: "S" | "A" | "B" | "C";
  style: string;
  summary: string;
  roles: [string, string];
  combo: string;
};

export type BattleAnalysis = {
  advantage: "あなたがやや有利" | "ほぼ互角" | "相手がやや有利";
  score: number;
  distance: string;
  opening: string;
  warning: string;
  tactic: string;
};

const typeRoles: Record<AuraType, string> = {
  "強化系": "前衛・突破役",
  "変化系": "迎撃・防御役",
  "放出系": "中衛・制圧役",
  "操作系": "戦術・かく乱役",
  "具現化系": "支援・装備役",
  "特質系": "索敵・切り札役",
};

const synergy: Record<AuraType, AuraType[]> = {
  "強化系": ["変化系", "具現化系"],
  "変化系": ["強化系", "放出系"],
  "放出系": ["変化系", "操作系"],
  "操作系": ["放出系", "具現化系"],
  "具現化系": ["操作系", "特質系"],
  "特質系": ["具現化系", "強化系"],
};

export function buildCompatibility(me: SharedProfile, friend: SharedProfile): Compatibility {
  const sameType = me.mainType === friend.mainType;
  const complementary = synergy[me.mainType].includes(friend.mainType);
  const attackGap = Math.abs(me.ability.rating.attack - friend.ability.rating.attack);
  const defenseGap = Math.abs(me.ability.rating.defense - friend.ability.rating.defense);
  const balance = Math.min(14, Math.round((attackGap + defenseGap) / 3));
  const score = Math.max(55, Math.min(98, 72 + (complementary ? 16 : sameType ? 5 : 9) + balance));
  const grade = score >= 92 ? "S" : score >= 82 ? "A" : score >= 70 ? "B" : "C";
  const style = complementary ? "補完型コンビ" : sameType ? "連携突破型コンビ" : "変則連携型コンビ";
  const first = typeRoles[me.mainType];
  const second = typeRoles[friend.mainType];
  const combo = `${me.ability.abilityName}で局面を作り、${friend.ability.abilityName}で有利を確定させる連携。`;
  const summary = complementary
    ? "互いの得意分野が重なりにくく、攻守の受け渡しがしやすい組み合わせです。"
    : sameType
      ? "同じ判断基準を共有しやすく、同時攻撃や撤退のタイミングを合わせやすい組み合わせです。"
      : "異なる視点を持つため、役割を先に決めるほど強みが出る組み合わせです。";
  return { score, grade, style, summary, roles: [first, second], combo };
}

export function buildBattle(me: SharedProfile, opponent: SharedProfile): BattleAnalysis {
  const mine = me.ability.rating;
  const theirs = opponent.ability.rating;
  const pressure = mine.attack * 0.42 + mine.defense * 0.2 + mine.versatility * 0.25 + mine.difficulty * 0.13;
  const resistance = theirs.attack * 0.42 + theirs.defense * 0.2 + theirs.versatility * 0.25 + theirs.difficulty * 0.13;
  const score = Math.max(35, Math.min(65, Math.round(50 + (pressure - resistance) / 3)));
  const advantage = score >= 55 ? "あなたがやや有利" : score <= 45 ? "相手がやや有利" : "ほぼ互角";
  const distance = mine.attack >= theirs.defense ? "中距離から相手の準備を崩し、得意な間合いへ入る" : "距離を保ち、相手の制約が見えるまで無理に踏み込まない";
  const opening = `${me.ability.abilityName}の発動条件を満たせる状況を先に作る。相手の${opponent.ability.abilityName}が使われた直後が最大の隙。`;
  const warning = `相手の「${opponent.ability.shortDescription}」を正面から受けないこと。${opponent.ability.weakness}`;
  const tactic = score >= 55 ? "先手で主導権を取り、短い交戦で決める" : score <= 45 ? "情報収集と防御を優先し、相手の回数制限を待つ" : "フェイントで能力の使いどころを引き出し、反撃の一手を残す";
  return { advantage, score, distance, opening, warning, tactic };
}
