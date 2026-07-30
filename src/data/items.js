export const ITEMS = [
  { id: 'gift_flower', name: '星辰花', type: 'gift', price: 50, effect: { affection: 5 }, icon: '🌸', desc: '散发星光的蓝色花朵' },
  { id: 'gift_gem', name: '星辉石', type: 'gift', price: 120, effect: { affection: 12, curiosity: 5 }, icon: '💎', desc: '蕴含星辰之力的宝石' },
  { id: 'gift_cookie', name: '月光曲奇', type: 'gift', price: 30, effect: { comfort: 8 }, icon: '🍪', desc: '自制的酥脆曲奇' },
  { id: 'gift_scarf', name: '星云围巾', type: 'gift', price: 80, effect: { comfort: 10, trust: 5 }, icon: '🧣', desc: '柔软的星云图案围巾' },
  { id: 'gift_book', name: '星图手记', type: 'gift', price: 60, effect: { curiosity: 10, respect: 5 }, icon: '📖', desc: '记载星座传说的手记' },
  { id: 'food_tea', name: '星露茶', type: 'food', price: 20, effect: { energy: 1 }, icon: '🍵', desc: '回复1行动点' },
  { id: 'food_meal', name: '星光套餐', type: 'food', price: 40, effect: { energy: 2 }, icon: '🍱', desc: '回复2行动点' },
  { id: 'deco_pin', name: '星辰胸针', type: 'deco', price: 100, effect: { charm: 1 }, icon: '📌', desc: '装备后对话好感+1' },
  { id: 'deco_ring', name: '月环戒', type: 'deco', price: 200, effect: { charm: 3 }, icon: '💍', desc: '装备后对话好感+3' },
  { id: 'deco_crown', name: '星冠', type: 'deco', price: 500, effect: { charm: 5 }, icon: '👑', desc: '装备后对话好感+5' }
];

export const JOBS = [
  { id: 'job_farm', name: '农场帮忙', reward: 30, energyCost: 2, desc: '在村头农场帮忙干活' },
  { id: 'job_shop', name: '商店帮手', reward: 25, energyCost: 1, desc: '帮老店主整理货架' },
  { id: 'job_clean', name: '广场清扫', reward: 20, energyCost: 1, desc: '清扫广场上的落叶' },
  { id: 'job_explore', name: '野外探索', reward: 40, energyCost: 2, desc: '探索周边区域收集物资' },
  { id: 'job_star', name: '观星指引', reward: 50, energyCost: 2, desc: '为游客讲解星座故事' }
];
