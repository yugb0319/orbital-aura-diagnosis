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
