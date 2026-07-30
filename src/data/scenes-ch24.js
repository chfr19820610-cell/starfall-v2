export default {
  ch2_start: {
    id: 'ch2_start',
    speaker: 'narrator',
    text: '星辰集市正式开幕，村里来了许多游客。\n热闹的气氛中，你感到一阵莫名的悸动。',
    scene: 'morning',
    next: 'ch2_kai_quest'
  },
  ch2_kai_quest: {
    id: 'ch2_kai_quest',
    speaker: 'kai',
    text: '嘿，你来得正好！\n集市那边出了点小状况——礼品摊缺人手。\n有空来帮忙吗？',
    scene: 'street',
    effects: { trust_kai: 3 },
    choices: [
      { text: '当然，我来帮忙', effects: { affection_kai: 5, trust_kai: 5 }, next: 'ch2_market_help' },
      { text: '我得先去找Lyra', effects: { curiosity_kai: 3 }, next: 'ch2_river' }
    ]
  },
  ch2_river: {
    id: 'ch2_river',
    speaker: 'lyra',
    text: '我正要去找你呢！河边今晚有放河灯的活动，\n要不要提前去占个好位置？——\n每年的星灯可漂亮了。',
    scene: 'stargaze',
    effects: { affection_lyra: 3, trust_lyra: 3 },
    next: 'ch2_lyra_event',
    choices: [
      { text: '好，一起去占位置', effects: { affection_lyra: 5 } },
      { text: '先去找Kai说一声', effects: { trust_kai: 3 } }
    ]
  },
  ch2_market_help: {
    id: 'ch2_market_help',
    speaker: 'kai',
    text: '谢了！有你帮忙至少能撑到中午。\n——其实礼品是给今晚的星辰仪式准备的。',
    scene: 'market',
    effects: { trust_kai: 5 },
    next: 'ch2_training'
  },
  ch2_training: {
    id: 'ch2_training',
    speaker: 'kai',
    text: '对了，帮我搬完这批礼品后，\n我带你去村里的小训练场看看——\n每年星落之夜都有个传统，叫"逐星赛跑"。',
    scene: 'street',
    effects: { trust_kai: 3, curiosity_kai: 3 },
    next: 'ch2_lyra_event',
    choices: [
      { text: '听起来很有趣', effects: { affection_kai: 3, curiosity_kai: 3 } },
      { text: '我不太擅长跑步', effects: { comfort_kai: 5 } }
    ]
  },
  ch2_lyra_event: {
    id: 'ch2_lyra_event',
    speaker: 'lyra',
    text: '——你在这里！我找了你好久。\n今晚有星辰仪式，据说能看到真正的星落。',
    scene: 'street',
    effects: { affection_lyra: 3, trust_lyra: 2 },
    next: 'ch2_ceremony',
    choices: [
      { text: '我一定会去的', effects: { affection_lyra: 5 } },
      { text: '仪式是什么？', effects: { curiosity_lyra: 3 } }
    ]
  },
  ch2_ceremony: {
    id: 'ch2_ceremony',
    speaker: 'narrator',
    text: '夜色渐深，全村的火把都点亮了。\nSelene站在祭坛前，手中捧着一颗发光的晶石。',
    scene: 'night',
    effects: { curiosity: 5 },
    next: 'ch2_selene_secret'
  },
  ch2_selene_secret: {
    id: 'ch2_selene_secret',
    speaker: 'selene',
    text: '星辰坠落之时，命运之门将开启。\n——但有些门，一旦打开就再也关不上了。\n你们……准备好了吗？',
    scene: 'stargaze',
    effects: { respect_selene: 5, curiosity_selene: 3 },
    next: 'ch2_found_stone',
    choices: [
      { text: '我已经准备好了', flags: ['ready_for_stone'], effects: { respect_selene: 3, trust_selene: 3 } },
      { text: '能再等等吗？', effects: { comfort_selene: 3 } }
    ]
  },
  ch2_found_stone: {
    id: 'ch2_found_stone',
    speaker: 'narrator',
    text: '仪式进行到一半，你突然感到地面震动。\n祭坛上那颗晶石碎裂——里面露出一枚古老的星辰石。',
    scene: 'cave',
    effects: { curiosity: 10 },
    next: 'ch2_choice',
    variants: [
      {
        conditions: { flags: ['ready_for_stone'] },
        text: '你大步上前，握住了那枚星辰石。\n温暖的光芒从指间流淌到全身——\n你感觉自己和这片土地建立了某种联系。',
        effects: { trust_lyra: 5, trust_selene: 5, respect_kai: 5 },
        choices: [{ text: '握住星辰石', flags: ['found_stone'], next: 'ch2_end' }]
      }
    ],
    choices: [
      { text: '小心翼翼地捡起星辰石', flags: ['found_stone'], effects: { curiosity: 5 }, next: 'ch2_end' },
      { text: '后退一步，让Selene处理', next: 'ch2_end' }
    ]
  },
  ch2_end: {
    id: 'ch2_end',
    speaker: 'narrator',
    text: '星辰仪式因意外提前结束了。\n但你很清楚——一切才刚刚开始。',
    scene: 'night',
    choices: [{ text: '继续第三章', flags: ['ch3_unlocked'], next: 'ch3_start' }]
  },

  ch3_start: {
    id: 'ch3_start',
    speaker: 'narrator',
    text: '星辰石的发现改变了村里的一切。\n有人欢喜，有人担忧。',
    scene: 'morning',
    next: 'ch3_tension'
  },
  ch3_tension: {
    id: 'ch3_tension',
    speaker: 'kai',
    text: '——说实话，我有点担心。\n那颗石头……村里老人说它会带来灾祸。',
    scene: 'street',
    effects: { trust_kai: 3 },
    choices: [
      { text: '我不会让灾祸发生的', effects: { trust_kai: 5, respect_kai: 5 }, next: 'ch3_lyra_hope' },
      { text: '你相信那些传说？', effects: { curiosity_kai: 3 }, next: 'ch3_lyra_hope' }
    ]
  },
  ch3_lyra_hope: {
    id: 'ch3_lyra_hope',
    speaker: 'lyra',
    text: '我觉得那颗石头很美——\n而且它选择了你，一定有原因。',
    scene: 'square',
    effects: { affection_lyra: 3, comfort_lyra: 3 },
    next: 'ch3_selene_warning',
    variants: [
      {
        conditions: { affection_lyra: { min: 45 } },
        text: '我相信你，不管发生什么。\n——而且，我会一直陪在你身边。',
        effects: { affection_lyra: 5, trust_lyra: 5 },
        choices: [{ text: '谢谢你', effects: { affection_lyra: 3 }, next: 'ch3_selene_warning' }]
      }
    ],
    choices: [
      { text: '有你在真好', effects: { affection_lyra: 5 } }
    ]
  },
  ch3_selene_warning: {
    id: 'ch3_selene_warning',
    speaker: 'selene',
    text: '我查阅了古籍。星辰石确实拥有强大的力量——\n但它也是一把钥匙。星落之夜，会有不速之客。',
    scene: 'library',
    effects: { trust_selene: 5, curiosity_selene: 3 },
    next: 'ch3_prepare',
    choices: [
      { text: '我们要怎么准备？', effects: { respect_selene: 5 }, next: 'ch3_prepare' },
      { text: '什么不速之客？', effects: { curiosity_selene: 3 }, next: 'ch3_prepare' }
    ]
  },
  ch3_prepare: {
    id: 'ch3_prepare',
    speaker: 'selene',
    text: '我们需要找到其他三枚星辰石碎片。\n它们散落在村庄周围的四个方向。\n时间不多了。',
    scene: 'library',
    effects: { respect_selene: 3 },
    next: 'ch3_choice',
    choices: [
      { text: '召集大家分头寻找', flags: ['search_party'], effects: { trust_kai: 3, trust_lyra: 3 }, next: 'ch3_forest' },
      { text: '我一个人去找', effects: { respect_kai: 3 }, next: 'ch3_mountain' },
      { text: '也许我们应该放弃星辰石', flags: ['doubt_stone'], effects: { trust_selene: -3 }, next: 'ch3_split' }
    ]
  },
  ch3_forest: {
    id: 'ch3_forest',
    speaker: 'narrator',
    text: '你们分头进入密林。枝叶间漏下的星光，照亮了青苔覆盖的古道。\nLyra在前面带路，Kai在后面断后。\n——东边的碎片似乎藏在瀑布后面。',
    scene: 'tree',
    effects: { trust_lyra: 3, trust_kai: 3, curiosity: 5 },
    next: 'ch3_split',
    choices: [
      { text: '潜入瀑布后寻找', effects: { curiosity: 5 }, next: 'ch3_split' },
      { text: '调查周围痕迹', effects: { respect_kai: 3 }, next: 'ch3_split' }
    ]
  },
  ch3_mountain: {
    id: 'ch3_mountain',
    speaker: 'narrator',
    text: '你独自踏上崎岖的山路。寒风中，星辰石碎片传来微微的暖意。\n山顶有一座废弃的观星台，石壁上刻满了古老的星座图。',
    scene: 'cave',
    effects: { respect_selene: 3, curiosity_selene: 3 },
    next: 'ch3_split',
    choices: [
      { text: '研究星座图', effects: { curiosity_selene: 5, respect_selene: 5 }, next: 'ch3_split' },
      { text: '继续往山顶走', effects: { curiosity: 5 }, next: 'ch3_split' }
    ]
  },
  ch3_split: {
    id: 'ch3_split',
    speaker: 'narrator',
    text: '你做出了选择。\n每个人的命运都因此走上了不同的道路。',
    scene: 'night',
    effects: { curiosity: 5 },
    next: 'ch3_fragment_search'
  },
  ch3_fragment_search: {
    id: 'ch3_fragment_search',
    speaker: 'narrator',
    text: '碎片散落在环村的四个方位。每一枚都散发着微弱的光芒。\n——你能感觉到它们在呼唤你。',
    scene: 'cave',
    effects: { curiosity: 5, curiosity_selene: 3 },
    next: 'ch3_end',
    choices: [
      { text: '感应碎片的指引', effects: { curiosity_selene: 5 } },
      { text: '循着直觉走', effects: { curiosity: 5, trust_kai: 3 } }
    ]
  },
  ch3_end: {
    id: 'ch3_end',
    speaker: 'narrator',
    text: '第三章 · 命运岔路 — 完\n\n风暴正在聚集。你感觉到了——\n有些事，即将揭晓。',
    scene: 'night',
    choices: [{ text: '继续第四章', flags: ['ch4_unlocked'], next: 'ch4_start' }]
  },

  ch4_start: {
    id: 'ch4_start',
    speaker: 'narrator',
    text: '离星落之夜还有三天。\n村里开始流传各种传言。',
    scene: 'morning',
    next: 'ch4_stargaze'
  },
  ch4_stargaze: {
    id: 'ch4_stargaze',
    speaker: 'lyra',
    text: '今晚的星星特别亮……像在说话。\n你感觉到了吗？它们好像在等什么。',
    scene: 'stargaze',
    effects: { curiosity_lyra: 3, trust_lyra: 2 },
    next: 'ch4_revelation',
    choices: [
      { text: '你在担心星落之夜吗', effects: { comfort_lyra: 5, affection_lyra: 3 } },
      { text: '星星确实不同寻常', effects: { curiosity_selene: 3 } }
    ]
  },
  ch4_revelation: {
    id: 'ch4_revelation',
    speaker: 'selene',
    text: '我有件事必须告诉你。\n——其实，我是星落的守护者后裔。\n这颗星辰石……是我家族世代守护的秘密。',
    scene: 'library',
    effects: { trust_selene: 8, respect_selene: 5 },
    next: 'ch4_truth',
    choices: [
      { text: '为什么不早点告诉我们？', effects: { trust_selene: 3 } },
      { text: '所以你早就知道这一切', effects: { curiosity_selene: 5 } }
    ]
  },
  ch4_truth: {
    id: 'ch4_truth',
    speaker: 'selene',
    text: '因为知道得越多，危险就越大。\n但现在已经没有退路了。\n——今晚，星门会在古树下开启。',
    scene: 'library',
    effects: { respect_selene: 3 },
    next: 'ch4_gathering',
    choices: [
      { text: '我们会一起面对', effects: { trust_lyra: 5, trust_kai: 5 }, next: 'ch4_gathering' },
      { text: '也许我们应该离开这里', flags: ['want_leave'], effects: { trust_selene: -3 }, next: 'ch4_lyra_fear' }
    ]
  },
  ch4_lyra_fear: {
    id: 'ch4_lyra_fear',
    speaker: 'lyra',
    text: '等等……你说离开？\n我们真的要考虑那个选项吗？\n——我……我不想大家分开。',
    scene: 'square',
    effects: { affection_lyra: 3, trust_lyra: 3 },
    next: 'ch4_gathering',
    choices: [
      { text: '我不会离开的', effects: { comfort_lyra: 5, affection_lyra: 5 } },
      { text: '有时候离开也是选择', effects: { curiosity: 3 } }
    ]
  },
  ch4_gathering: {
    id: 'ch4_gathering',
    speaker: 'narrator',
    text: '所有人都聚集在古树下。\n夜色如墨，星辰开始坠落。\n一道光门在树干上缓缓浮现。',
    scene: 'tree',
    effects: { curiosity: 10 },
    next: 'ch4_end'
  },
  ch4_end: {
    id: 'ch4_end',
    speaker: 'narrator',
    text: '第四章 · 真相之门 — 完\n\n光门之后，是终点，还是新的开始？\n只有穿过它才能知道。',
    scene: 'stargaze',
    choices: [{ text: '进入最终章', flags: ['ch5_unlocked'], next: 'ch5_start' }]
  }
};
