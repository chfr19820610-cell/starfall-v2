export default {
  ch5_start: {
    id: 'ch5_start',
    speaker: 'narrator',
    text: '你穿过光门。\n眼前是一片星空——无尽、深邃、充满回响。',
    scene: 'void',
    next: 'ch5_farewell'
  },
  ch5_farewell: {
    id: 'ch5_farewell',
    speaker: 'selene',
    text: '穿过这扇门之后，一切都会不同。\n——你们每个人都有选择自己命运的权利。\n但记住，有些选择意味着告别。',
    scene: 'void',
    effects: { respect_selene: 5, trust_selene: 3 },
    next: 'ch5_final_choice',
    choices: [
      { text: '我已经准备好了', effects: { respect_selene: 3, trust_selene: 3 } },
      { text: '再等一下……', effects: { comfort_selene: 3 } }
    ]
  },
  ch5_final_choice: {
    id: 'ch5_final_choice',
    speaker: 'selene',
    text: '这里是星辰之间。\n每一颗星星都是一段命运。\n——你看到了吗？你的命运之星在哪？',
    scene: 'void',
    effects: { respect_selene: 5 },
    next: null,
    variants: [
      {
        // end_solitude: 无角色羁绊≥20 → 独自离开
        conditions: { affection_lyra: { max: 19 }, affection_kai: { max: 19 }, affection_selene: { max: 19 } },
        choices: [{ text: '……我谁也没有走向', next: 'end_solitude' }]
      },
      {
        // end_stone: flag_found_stone 且任一角色羁绊≥65 → 星辰石结局
        conditions: { flags: ['found_stone'], affection_lyra: { min: 65 } },
        choices: [
          { text: '握紧手中的星辰石', next: 'end_stone' },
          { text: '走向Lyra的星光', effects: { affection_lyra: 10 }, next: 'end_lyra' },
          { text: '走向Kai的星光', effects: { affection_kai: 10 }, next: 'end_kai' },
          { text: '走向Selene的星光', effects: { affection_selene: 10 }, next: 'end_selene' }
        ]
      },
      {
        // end_stone: Kai线
        conditions: { flags: ['found_stone'], affection_kai: { min: 65 } },
        choices: [
          { text: '握紧手中的星辰石', next: 'end_stone' },
          { text: '走向Lyra的星光', effects: { affection_lyra: 10 }, next: 'end_lyra' },
          { text: '走向Kai的星光', effects: { affection_kai: 10 }, next: 'end_kai' },
          { text: '走向Selene的星光', effects: { affection_selene: 10 }, next: 'end_selene' }
        ]
      },
      {
        // end_stone: Selene线
        conditions: { flags: ['found_stone'], affection_selene: { min: 65 } },
        choices: [
          { text: '握紧手中的星辰石', next: 'end_stone' },
          { text: '走向Lyra的星光', effects: { affection_lyra: 10 }, next: 'end_lyra' },
          { text: '走向Kai的星光', effects: { affection_kai: 10 }, next: 'end_kai' },
          { text: '走向Selene的星光', effects: { affection_selene: 10 }, next: 'end_selene' }
        ]
      },
      {
        // end_friendship: 所有角色羁绊≥40 且无人≥85 → 友情结局
        conditions: { affection_lyra: { min: 40, max: 84 }, affection_kai: { min: 40, max: 84 }, affection_selene: { min: 40, max: 84 } },
        choices: [
          { text: '伸出手，握住所有人的手', next: 'end_friendship' },
          { text: '走向Lyra的星光', effects: { affection_lyra: 10 }, next: 'end_lyra' },
          { text: '走向Kai的星光', effects: { affection_kai: 10 }, next: 'end_kai' },
          { text: '走向Selene的星光', effects: { affection_selene: 10 }, next: 'end_selene' }
        ]
      }
    ],
    choices: [
      { text: '走向Lyra的星光', effects: { affection_lyra: 10 }, next: 'end_lyra' },
      { text: '走向Kai的星光', effects: { affection_kai: 10 }, next: 'end_kai' },
      { text: '走向Selene的星光', effects: { affection_selene: 10 }, next: 'end_selene' },
      { text: '独自走向最深处的光', next: 'end_sacrifice' },
      { text: '收集周围所有的星光', flags: ['collected_all'], next: 'end_explorer' }
    ]
  },

  end_lyra: {
    id: 'end_lyra',
    speaker: 'lyra',
    text: '你选择了我的星光。\n从今以后，无论星落多少次——\n我都会在你身边。\n\n——结局：星与你的约定 ✦',
    scene: 'stargaze',
    choices: [
      { text: '尾声：种下星树', next: 'epilogue_lyra' },
      { text: '返回标题画面', next: 'end_screen' }
    ]
  },
  epilogue_lyra: {
    id: 'epilogue_lyra',
    speaker: 'narrator',
    text: '星落之夜过后，Lyra和你在村口种下了一棵星树。\n每年这个夜晚，树枝间会闪烁蓝色的微光——\n像是星辰的约定，永不熄灭。',
    scene: 'village',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_kai: {
    id: 'end_kai',
    speaker: 'kai',
    text: '——没想到你会选我这条路。\n不过，既然你选了，我就陪你走到黑。\n\n——结局：并肩的旅人 ✦',
    scene: 'stargaze',
    choices: [
      { text: '尾声：踏上旅途', next: 'epilogue_kai' },
      { text: '返回标题画面', next: 'end_screen' }
    ]
  },
  epilogue_kai: {
    id: 'epilogue_kai',
    speaker: 'narrator',
    text: 'Kai背起了行囊，你和他一起踏上了旅途。\n星辰在头顶铺成一条银色的道路。\n他说，世界很大，但有你同行就没那么远了。',
    scene: 'morning',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_selene: {
    id: 'end_selene',
    speaker: 'selene',
    text: '星辰指引你来到了我这里。\n我们的命运，从第一次占星就已经交织在一起。\n\n——结局：星辰的守护者 ✦',
    scene: 'stargaze',
    choices: [
      { text: '尾声：封印星辰石', next: 'epilogue_selene' },
      { text: '返回标题画面', next: 'end_screen' }
    ]
  },
  epilogue_selene: {
    id: 'epilogue_selene',
    speaker: 'narrator',
    text: 'Selene将星辰石重新封印在古树下。\n从那天起，她不再只是占星师——\n你和她一起守护着星落村的秘密，直到星辰再次坠落。',
    scene: 'tree',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_sacrifice: {
    id: 'end_sacrifice',
    speaker: 'narrator',
    text: '你用自己的光芒填补了星辰间的裂缝。\n星落之夜永远结束了——\n但你的名字，化作了一颗新的星星。\n\n——结局：永恒之星 ✦',
    scene: 'stargaze',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_friendship: {
    id: 'end_friendship',
    speaker: 'narrator',
    text: '你没有选择任何一颗星，而是选择了所有人。\nLyra、Kai、Selene——你们之间的纽带\n不是爱情，而是比星辰更坚固的友谊。\n\n——结局：星之友谊 ✦',
    scene: 'stargaze',
    choices: [
      { text: '尾声：星空下的约定', next: 'epilogue_friendship' },
      { text: '返回标题画面', next: 'end_screen' }
    ]
  },
  epilogue_friendship: {
    id: 'epilogue_friendship',
    speaker: 'narrator',
    text: '星落之夜过后，你们三人常常一起在山顶观星。\n没有谁独占谁的光芒——\n每一颗星，都照亮着彼此。',
    scene: 'stargaze',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_solitude: {
    id: 'end_solitude',
    speaker: 'narrator',
    text: '你独自走向星空深处。\n没有人陪伴，也没有人挽留。\n但星辰记得你的名字——\n那个在星落之夜独自前行的人。\n\n——结局：孤星 ✦',
    scene: 'void',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_stone: {
    id: 'end_stone',
    speaker: 'narrator',
    text: '你握紧手中的星辰石，它在你掌心发出温热的光。\n星辰石低语着远古的秘密——\n关于星落，关于约定，关于那些被遗忘的名字。\n你选择成为新的守护者，将这份光芒传承下去。\n\n——结局：星辰石守护者 ✦',
    scene: 'stargaze',
    choices: [
      { text: '尾声：封印传承', next: 'epilogue_stone' },
      { text: '返回标题画面', next: 'end_screen' }
    ]
  },
  epilogue_stone: {
    id: 'epilogue_stone',
    speaker: 'narrator',
    text: '你将星辰石重新嵌入古树之中。\n光芒缓缓扩散，覆盖了整个星落村。\n从今以后，你就是这里的守护者——\n直到下一颗星辰坠落。',
    scene: 'tree',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_explorer: {
    id: 'end_explorer',
    speaker: 'narrator',
    text: '你集齐了星辰石的全部碎片。\n每一段故事，每一次相遇，都刻在了星空中。\n——这个世界还有更多秘密等待你发现。\n\n——结局：星河探索者 ✦',
    scene: 'stargaze',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_friendship: {
    id: 'end_friendship',
    speaker: 'narrator',
    text: '你没有选择任何一颗星，而是选择了所有人。\nLyra、Kai、Selene——你们之间的纽带\n不是爱情，而是比星辰更坚固的友谊。\n\n——结局：星之友谊 ✦',
    scene: 'stargaze',
    choices: [
      { text: '尾声：星空下的约定', next: 'epilogue_friendship' },
      { text: '返回标题画面', next: 'end_screen' }
    ]
  },
  epilogue_friendship: {
    id: 'epilogue_friendship',
    speaker: 'narrator',
    text: '星落之夜过后，你们三人常常一起在山顶观星。\n没有谁独占谁的光芒——\n每一颗星，都照亮着彼此。',
    scene: 'stargaze',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_solitude: {
    id: 'end_solitude',
    speaker: 'narrator',
    text: '你独自走向星空深处。\n没有人陪伴，也没有人挽留。\n但星辰记得你的名字——\n那个在星落之夜独自前行的人。\n\n——结局：孤星 ✦',
    scene: 'void',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  end_stone: {
    id: 'end_stone',
    speaker: 'narrator',
    text: '你手中的星辰石发出耀眼的光芒。\n它选择的不是一个人，而是一段关系——\n那段在星落之夜中诞生的、最深刻的羁绊。\n\n——结局：星辰之约 ✦',
    scene: 'stargaze',
    choices: [
      { text: '尾声：封印星辰石', next: 'epilogue_stone' },
      { text: '返回标题画面', next: 'end_screen' }
    ]
  },
  epilogue_stone: {
    id: 'epilogue_stone',
    speaker: 'narrator',
    text: '星辰石重新沉入古树之下。\n但这一次，它的光芒不再属于一个人——\n而是属于你们共同的记忆。',
    scene: 'tree',
    choices: [{ text: '返回标题画面', next: 'end_screen' }]
  },

  free_start: {
    id: 'free_start',
    speaker: 'narrator',
    text: '自由模式 — 星落村日常\n\n你可以自由探索村庄，与角色互动，\n或者去集市逛逛。',
    scene: 'morning',
    choices: [
      { text: '去找Lyra聊天', effects: { affection_lyra: 2 }, next: 'free_lyra' },
      { text: '去找Kai', effects: { affection_kai: 2 }, next: 'free_kai' },
      { text: '去找Selene占星', effects: { affection_selene: 2 }, next: 'free_selene' },
      { text: '去集市逛逛', next: 'free_market' }
    ]
  },
  free_lyra: {
    id: 'free_lyra',
    speaker: 'lyra',
    text: '你来了！今天的星星也很美呢。\n要一起去观星吗？',
    scene: 'stargaze',
    effects: { affection_lyra: 2, comfort_lyra: 2 },
    next: 'free_start'
  },
  free_kai: {
    id: 'free_kai',
    speaker: 'kai',
    text: '哟，来得正好！我刚泡了壶茶。\n坐下来聊聊？',
    scene: 'house',
    effects: { affection_kai: 2, trust_kai: 2 },
    next: 'free_start'
  },
  free_selene: {
    id: 'free_selene',
    speaker: 'selene',
    text: '你来了。我正好在观星。\n今天的星象……很有趣。',
    scene: 'stargaze',
    effects: { affection_selene: 2, curiosity_selene: 2 },
    next: 'free_start'
  },
  free_market: {
    id: 'free_market',
    speaker: 'narrator',
    text: '集市里人来人往。\n你可以买东西、打工赚钱，或者只是四处看看。',
    scene: 'market',
    next: 'free_start'
  },

  end_screen: {
    id: 'end_screen',
    speaker: 'narrator',
    text: '— 星落之夜 v2.0 —\n\n感谢游玩。\n\n你可以重新开始，或者继续在自由模式探索。',
    scene: 'title',
    choices: [
      { text: '重新开始', flags: ['new_game'], next: 'ch0_intro' },
      { text: '进入自由模式', next: 'free_start' }
    ]
  }
};
