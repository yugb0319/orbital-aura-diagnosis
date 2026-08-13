import { AuraType, Scores } from "./types";

export type Ability = {
  abilityName: string;
  type: AuraType;
  shortDescription: string;
  description: string;
  activation: string;
  restriction: string;
  oath: string;
  weakness: string;
  strengths: string[];
  rating: { attack: number; defense: number; versatility: number; difficulty: number; growth: number };
  reason: string;
};

const abilities: Record<AuraType, Omit<Ability, "type" | "rating" | "reason">> = {
  "強化系": {
    abilityName: "集中加速（フォーカス・ブースト）",
    shortDescription: "決めた作業を続けるほど、体力・集中力・手先の正確さが上がる能力。",
    description: "ひとつの目標に取り組み続けている間だけ、自分の身体能力と集中力を段階的に高めます。勉強、スポーツ、細かな作業など『続ける力』が必要な場面で特に役立ちます。",
    activation: "始める前に、今から達成する目標を一文で決める。例：『この30分でレポートの構成を作る』。",
    restriction: "同時に強化できる目標は1つだけ。別のことを始めると、上がった力はすぐ元に戻ります。",
    oath: "達成できた日は、得た時間や成果の一部を誰かの役に立つことに使う。",
    weakness: "目的が曖昧な時、途中で何度も目標を変える時はほとんど効果が出ません。",
    strengths: ["長く続けるほど効果が高い", "日常・学業・運動で使いやすい", "明確な目標と相性が良い"],
  },
  "変化系": {
    abilityName: "気分変調（ムード・シフト）",
    shortDescription: "自分の感情を切り替え、状況に合う集中モードを作る能力。",
    description: "短時間だけ、自分の気分と集中の質を『落ち着く』『ひらめく』『大胆になる』の3モードに切り替えます。相手の心を操る力ではなく、自分のコンディションを整える能力です。",
    activation: "深呼吸を3回し、使うモードを頭の中で宣言する。",
    restriction: "一度選んだモードは10分間変更できません。連続使用は1日3回までです。",
    oath: "感情を切り替えた状態で、他人を傷つけるための判断はしない。",
    weakness: "疲労や睡眠不足が強い日は、切り替えに失敗して逆に集中しづらくなります。",
    strengths: ["場面に合わせて切り替えられる", "発想や会話の助けになる", "自分の内面だけに作用するため安全"],
  },
  "放出系": {
    abilityName: "合図の余波（シグナル・ウェーブ）",
    shortDescription: "短い声や動作で、離れた仲間に『今動くべき』という気づきを届ける能力。",
    description: "自分が強く意識して出した合図を、見える範囲にいる相手が気づきやすい形で伝えます。命令したり考えを読んだりはできませんが、緊急時の連携や注意喚起に役立ちます。",
    activation: "相手の方向を見て、決めた短い合図を1回だけ出す。",
    restriction: "届くのは約30mまで。使える合図は1回につき1種類で、内容の細かな説明はできません。",
    oath: "助けを求める合図を、冗談や人を困らせる目的で使わない。",
    weakness: "騒がしい場所や、相手が完全に別のことへ集中している時は届きません。",
    strengths: ["離れた相手と素早く連携できる", "緊急時に使いやすい", "効果が分かりやすい"],
  },
  "操作系": {
    abilityName: "行動設計（ステップ・コード）",
    shortDescription: "複雑な作業を、今やるべき小さな一歩に分けて見えるようにする能力。",
    description: "頭の中で散らかった情報を整理し、次に取るべき行動を最大3つまで具体的な手順に変えます。未来を予知する能力ではなく、手持ちの情報を冷静に並べ替える補助能力です。",
    activation: "紙やスマホに、困っていることを一文で書き出す。",
    restriction: "材料になる情報が少ない時は使えません。結果は『提案』であり、必ず成功する保証はありません。",
    oath: "他人の選択を勝手に決めるためには使わず、最終判断は本人に任せる。",
    weakness: "感情が大きく乱れている時や、急なトラブルには分析が追いつきません。",
    strengths: ["優先順位を決めやすい", "チーム作業と相性が良い", "日常の問題解決に使える"],
  },
  "具現化系": {
    abilityName: "段取り箱（プラン・ポケット）",
    shortDescription: "準備した小物を、必要な時にすぐ取り出せる一時保管能力。",
    description: "前日までに自分で用意した小さな道具を、5個まで見えない『段取り箱』に保管できます。必要な時に手元へ取り出せるため、準備力を実際の行動へつなげられます。",
    activation: "保管する物に用途を書いたメモを添え、前日のうちに箱へ入れる。",
    restriction: "保管できるのは片手で持てる物だけ。食べ物・生き物・他人の物は入れられません。",
    oath: "取り出した道具は、使い終わったら自分で元の場所へ片付ける。",
    weakness: "急に必要になった物は出せません。事前の準備を忘れるとただの空箱です。",
    strengths: ["忘れ物を減らせる", "準備した分だけ強くなる", "生活や仕事で実用的"],
  },
  "特質系": {
    abilityName: "違和感の羅針盤（オフビート・コンパス）",
    shortDescription: "見落とされがちな『いつもと違う点』を見つけやすくする能力。",
    description: "場所、会話、計画の中にある小さな違和感を、直感として受け取ります。答えを教えてくれる能力ではありませんが、『ここをもう一度確認しよう』というヒントを得られます。",
    activation: "気になる状況を10秒間静かに観察し、自分の第一印象を言葉にする。",
    restriction: "1つの場所・話題につき使えるのは1日1回。答えではなく、方向だけが分かります。",
    oath: "違和感だけで人を決めつけず、必ず事実を確かめる。",
    weakness: "先入観が強い時は、ただの思い込みを拾ってしまうことがあります。",
    strengths: ["見落としを減らせる", "企画や観察で役立つ", "自分らしい視点を活かせる"],
  },
};

export function fallbackAbility(type: AuraType, scores: Scores): Ability {
  const base = abilities[type];
  return { ...base, type, rating: { attack: Math.min(88, scores[type]), defense: 58, versatility: 78, difficulty: 64, growth: 90 }, reason: `診断で表れた${type}の傾向を、日常で無理なく使える分かりやすい形にした能力です。` };
}
