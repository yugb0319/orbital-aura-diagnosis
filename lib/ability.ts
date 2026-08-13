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
    abilityName: "一点突破（ブレイク・ライン）",
    shortDescription: "次の一撃か防御に限り、腕か脚の出力を20秒だけ高める能力。",
    description: "使う部位を腕か脚のどちらか一つに決め、その部位だけを短時間強化します。腕なら受け止める・押し返す・武器を振る、脚なら踏み込む・跳ぶ・距離を取る、といった一瞬の攻防に使えます。全身を強くする能力ではありません。",
    activation: "拳を握るか、足裏を地面に強くつけて、強化する部位を決める。",
    restriction: "効果は20秒、連続使用は3回まで。腕を強化中は脚、脚を強化中は腕を強化できません。",
    oath: "倒れた相手へ追撃する目的では使わない。",
    weakness: "発動後30秒は使った部位が重くなり、細かな動きが鈍くなります。",
    strengths: ["攻撃と防御を一瞬だけ底上げできる", "距離を詰める・離す判断に使える", "相手に読まれると対策されやすい"],
  },
  "変化系": {
    abilityName: "反発膜（リコイル・スキン）",
    shortDescription: "手のひらに、衝撃を横へ逃がす薄い膜を10秒だけ作る能力。",
    description: "手のひらで触れた一点にだけ、打撃や飛んできた小物の衝撃を横方向へそらす膜を作ります。相手を吹き飛ばすほどの力はありませんが、攻撃の軌道をずらして反撃の隙を作れます。",
    activation: "片手の指をそろえ、守りたい方向へ手のひらを向ける。",
    restriction: "膜は片手に一枚だけ、10秒で消えます。刃物、弾丸、重い物を完全に止めることはできません。",
    oath: "背後から不意打ちするためには使わない。",
    weakness: "正面から来る衝撃にしか反応せず、つかまれた状態では発動しにくくなります。",
    strengths: ["打撃の軌道をずらせる", "近距離の防御と反撃に向く", "攻撃力より位置取りを重視する"],
  },
  "放出系": {
    abilityName: "指向衝（ベクトル・ノック）",
    shortDescription: "30m以内へ、体勢を崩す程度の小さな衝撃を飛ばす能力。",
    description: "指で狙った方向に、扉をノックする程度の短い衝撃を飛ばします。相手を倒す威力はありませんが、腕をずらす、足元の物を動かす、注意を逸らすなど、距離を取るための隙を作れます。",
    activation: "対象を目で捉え、指を一度だけ弾く。",
    restriction: "射程は30m、1分に3回まで。狙えるのは見えている一点だけで、壁越しには届きません。",
    oath: "動けない相手を傷つけるためには使わない。",
    weakness: "重い物や踏ん張っている相手にはほとんど効かず、風や障害物で狙いがずれます。",
    strengths: ["離れた相手の姿勢を乱せる", "逃げ道を作りやすい", "攻撃より牽制に向く"],
  },
  "操作系": {
    abilityName: "軌道予約（リターン・ルート）",
    shortDescription: "手で触れた小物1つを、決めた直線上にだけ動かせる能力。",
    description: "石、ペン、空き缶など手で持てる小物に、最大5mの『進む直線』を予約します。投げた後や転がした後に、その物は少しだけ直線へ戻ろうとします。直接人を操る力ではありませんが、牽制や目くらましに使えます。",
    activation: "物に5秒触れ、指で進ませたい方向をなぞる。",
    restriction: "同時に予約できる物は1個だけ。生き物・刃物・重さ2kg超の物には使えません。",
    oath: "相手の視界を奪う目的で、危険物を顔へ向けない。",
    weakness: "強い衝撃を受けると予約は消え、曲がり角や障害物を避けることはできません。",
    strengths: ["遠くから小さな牽制ができる", "罠や注意そらしに使える", "事前準備があるほど有利"],
  },
  "具現化系": {
    abilityName: "防壁札（ガード・タグ）",
    shortDescription: "事前に書いた札を1枚だけ、30秒の簡易防壁に変える能力。",
    description: "自分で用意した紙の札を前へかざすと、腕一本分ほどの小さな透明な防壁になります。打撃を一度だけ弱めたり、飛んでくる小物を弾いたりできますが、人を閉じ込めるほど大きくはなりません。",
    activation: "前日に『守る』と書いた札を折り、危険を感じた時に前へ出す。",
    restriction: "札1枚につき防げるのは強い衝撃1回か、弱い衝撃3回まで。1日に3枚までしか使えません。",
    oath: "防壁の後ろから一方的に攻撃を続けない。",
    weakness: "側面と背後は守れず、雨で札が濡れると発動しません。",
    strengths: ["一瞬の防御に特化", "撤退や仲間の援護に使える", "準備不足では使えない"],
  },
  "特質系": {
    abilityName: "死角警報（ブラインド・ベル）",
    shortDescription: "自分の死角から近づく急な動きだけを、音として知らせる能力。",
    description: "自分から見えない範囲で、急に距離を詰める動きが起きた時だけ、耳元で小さなベルが鳴ります。相手の考えや未来は分からず、攻撃かどうかも判断できませんが、振り向くための一瞬を得られます。",
    activation: "両足を止め、周囲を一度見回してから3秒間静止する。",
    restriction: "半径8m以内、1回の発動で30秒まで。自分が走っている時や、騒音の中では使えません。",
    oath: "警報を理由に、確認せず先に相手を攻撃しない。",
    weakness: "ゆっくり近づく相手、最初から近くにいる相手、複数方向からの同時接近には弱いです。",
    strengths: ["不意打ちを避けやすい", "守りと撤退の判断に向く", "情報はヒントだけで万能ではない"],
  },
};

export function fallbackAbility(type: AuraType, scores: Scores): Ability {
  const base = abilities[type];
  return { ...base, type, rating: { attack: Math.min(88, scores[type]), defense: 58, versatility: 78, difficulty: 64, growth: 90 }, reason: `診断で表れた${type}の傾向を、日常で無理なく使える分かりやすい形にした能力です。` };
}
