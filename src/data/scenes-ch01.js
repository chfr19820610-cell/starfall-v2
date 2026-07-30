export default {
  ch0_intro: {
    id: 'ch0_intro',
    speaker: 'narrator',
    text: '星落之夜，传说中星辰会坠落人间。\n你背着行囊，来到了这座叫星落村的小村庄……',
    scene: 'village',
    next: 'ch0_meet_lyra',
    choices: [{ text: '继续前行', next: 'ch0_meet_lyra' }]
  },
  ch0_meet_lyra: {
    id: 'ch0_meet_lyra',
    speaker: 'lyra',
    text: '你好，旅行者。你也是来看流星的吗？',
    scene: 'square',
    effects: { curiosity_lyra: 5 },
    next: 'ch0_meet_kai',
    choices: [
      { text: '是的，听说今晚有流星雨', effects: { affection_lyra: 3, comfort_lyra: 3 }, next: 'ch0_meet_kai' },
      { text: '我只是路过这里', effects: { curiosity_lyra: 3 }, next: 'ch0_meet_kai' }
    ],
    variants: [
      {
        conditions: { flags: ['veteran'] },
        text: '旅行者——你回来了。我就知道你会再来的。',
        effects: { affection_lyra: 5, trust_lyra: 3 },
        choices: [{ text: '我回来了', effects: { affection_lyra: 5 }, next: 'ch0_meet_kai' }]
      }
    ]
  },
  ch0_meet_kai: {
    id: 'ch0_meet_kai',
    speaker: 'kai',
    text: '喂，Lyra，你又随便搭讪路人！\n——不好意思，这家伙见到新面孔就兴奋。',
    scene: 'square',
    effects: { curiosity_kai: 5 },
    choices: [
      { text: '没关系，我叫[你的名字]', effects: { affection_kai: 2, comfort_kai: 3 } },
      { text: '她挺友善的', effects: { affection_lyra: 2, respect_kai: 2 } }
    ]
  },
  ch0_village_intro: {
    id: 'ch0_village_intro',
    speaker: 'narrator',
    text: 'Lyra和Kai热情地给你介绍了星落村。\n这个村子靠观星旅游为生，每年星落之夜是最热闹的时候。',
    scene: 'village',
    next: 'ch0_end'
  },
  ch0_end: {
    id: 'ch0_end',
    speaker: 'narrator',
    text: '就这样，你在这个陌生的村庄住下了。\n明天，故事才真正开始……',
    scene: 'night',
    effects: { curiosity_lyra: 3, curiosity_kai: 3 },
    choices: [{ text: '进入第一章', flags: ['ch1_unlocked'], next: 'ch1_start' }]
  },

  ch1_start: {
    id: 'ch1_start',
    speaker: 'narrator',
    text: '清晨的阳光洒在星落村。\n新的一天开始了。',
    scene: 'morning',
    next: 'ch1_lyra_visit'
  },
  ch1_lyra_visit: {
    id: 'ch1_lyra_visit',
    speaker: 'lyra',
    text: '早啊！今天村里有星辰集市，要不要一起去看看？',
    scene: 'street',
    effects: { affection_lyra: 2 },
    choices: [
      { text: '好啊，一起去', effects: { affection_lyra: 5, trust_lyra: 2 }, next: 'ch1_market' },
      { text: '我想自己逛逛', effects: { curiosity_lyra: 3 }, next: 'ch1_alone_explore' }
    ]
  },
  ch1_market: {
    id: 'ch1_market',
    speaker: 'lyra',
    text: '太好了！集市上有好多有趣的东西——\n有星辉石、星辰花，还有……哦对了，那边有占星摊！',
    scene: 'market',
    effects: { affection_lyra: 3, comfort_lyra: 3, trust_lyra: 2 },
    next: 'ch1_extra',
    choices: [
      { text: '先逛逛集市再说', effects: { curiosity_lyra: 3 }, next: 'ch1_extra' },
      { text: '直接去占星摊', effects: { curiosity_selene: 5 }, next: 'ch1_meet_selene' }
    ]
  },
  ch1_extra: {
    id: 'ch1_extra',
    speaker: 'narrator',
    text: '集市里人来人往，摊位一个接一个。\n手工饰品、点心小吃、还有人在吹奏星笛——\n星落村的集市，比想象的还热闹。',
    scene: 'market',
    effects: { curiosity: 5 },
    next: 'ch1_meet_selene',
    choices: [
      { text: '买点小吃', effects: { comfort_lyra: 3 }, next: 'ch1_meet_selene' },
      { text: '去看星笛表演', effects: { curiosity_kai: 3 }, next: 'ch1_meet_selene' }
    ]
  },
  ch1_alone_explore: {
    id: 'ch1_alone_explore',
    speaker: 'narrator',
    text: '你独自在村里闲逛。\n村口有一棵巨大的古树，枝叶间闪着星光。',
    scene: 'tree',
    effects: { curiosity_selene: 5 },
    next: 'ch1_meet_selene_alt'
  },
  ch1_meet_selene: {
    id: 'ch1_meet_selene',
    speaker: 'selene',
    text: '命运之线牵引着你们。\n你好，我是Selene——村里的占星师。',
    scene: 'market',
    effects: { curiosity_selene: 8, affection_selene: 3 },
    next: 'ch1_selene_ask',
    choices: [
      { text: '你好，这个集市真热闹', effects: { comfort_selene: 5 } },
      { text: '占星？你能看到我的命运吗', effects: { curiosity_selene: 5, respect_selene: 3 } }
    ]
  },
  ch1_meet_selene_alt: {
    id: 'ch1_meet_selene_alt',
    speaker: 'selene',
    text: '你感觉到了吗……古树在低语。\n我是Selene，守护这片星光的占星师。',
    scene: 'tree',
    effects: { affection_selene: 5, curiosity_selene: 5 },
    next: 'ch1_selene_ask',
    choices: [
      { text: '这棵树真美', effects: { comfort_selene: 5 } },
      { text: '你说它在低语？', effects: { curiosity_selene: 5 } }
    ]
  },
  ch1_selene_ask: {
    id: 'ch1_selene_ask',
    speaker: 'selene',
    text: '你身上有特别的气息……\n像是被星辰选中的人。\n——要不要我帮你看看星盘？',
    scene: 'stargaze',
    effects: { curiosity_selene: 3 },
    choices: [
      { text: '好的，请帮我看', effects: { trust_selene: 5, respect_selene: 5 }, next: 'ch1_selene_reading' },
      { text: '改天吧，我还没准备好', effects: { comfort_selene: 3 }, next: 'ch1_selene_reading' }
    ]
  },
  ch1_selene_reading: {
    id: 'ch1_selene_reading',
    speaker: 'selene',
    text: '你的星盘显示……你与这颗星球的命运紧密相连。\n星落之夜即将来临，而你会是关键。',
    scene: 'stargaze',
    effects: { trust_selene: 5 },
    next: 'ch1_return'
  },
  ch1_return: {
    id: 'ch1_return',
    speaker: 'narrator',
    text: '你带着满腹疑惑回到了住处。\n夜色降临，星辰开始闪烁。',
    scene: 'night',
    effects: { curiosity: 5 },
    next: 'ch1_end'
  },
  ch1_end: {
    id: 'ch1_end',
    speaker: 'narrator',
    text: '第一章 · 星辰之约 — 完\n\n你在星落村的第一天就这样结束了。\n明天，星辰集市会正式开幕。',
    scene: 'night',
    choices: [
      { text: '继续第二章', flags: ['ch2_unlocked'], next: 'ch2_start' },
      { text: '在村里自由探索', next: 'free_start' }
    ]
  }
};
