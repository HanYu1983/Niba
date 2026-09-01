import type { ExplorationEventChoice, ExplorationEventPoolId, ExplorationEventType } from '../types'
import type { BaseBuilding } from '../catalogs/buildingCatalog'
import { buildingCatalog } from '../catalogs/buildingCatalog'
import { defenseStructureCatalog } from '../catalogs/defenseStructureCatalog'

export type ExplorationEventPoolDefinition = {
  id: ExplorationEventPoolId
  buildingType: string
  eventTypes: ExplorationEventType[]
}

export function getBuildingTypeDisplayName(buildingType: string): string {
  const building = buildingCatalog.find((candidate) => candidate.type === buildingType)
  if (building) return building.name

  const defenseStructure = defenseStructureCatalog.find((candidate) => candidate.type === buildingType)
  return defenseStructure?.name ?? buildingType
}

export const explorationEventPoolCatalog: ExplorationEventPoolDefinition[] = [
  { id: 'board-events', buildingType: 'board', eventTypes: ['lost-caravan', 'village-request', 'bandit-ransom'] },
  { id: 'item-shop-events', buildingType: 'item-shop', eventTypes: ['wandering-merchant', 'resource-cache', 'traveling-herbalist'] },
  { id: 'equipment-shop-events', buildingType: 'equipment-shop', eventTypes: ['ancient-ruins', 'beast-tracks', 'lost-caravan'] },
  { id: 'martial-hall-events', buildingType: 'martial-hall', eventTypes: ['wandering-scholar', 'ancient-ruins', 'strange-well', 'wandering-fighter', 'martial-script'] },
  { id: 'infirmary-events', buildingType: 'infirmary', eventTypes: ['wounded-traveler', 'village-request', 'storm-shelter'] },
  { id: 'warehouse-events', buildingType: 'warehouse', eventTypes: ['resource-cache', 'lost-caravan', 'beast-tracks'] },
  { id: 'workshop-events', buildingType: 'workshop', eventTypes: ['ancient-ruins', 'resource-cache', 'strange-well'] },
  { id: 'wall-events', buildingType: 'wall', eventTypes: ['abandoned-shrine', 'beast-tracks', 'bandit-ransom'] },
  { id: 'barracks-events', buildingType: 'barracks', eventTypes: ['beast-tracks', 'bandit-ransom', 'wounded-traveler'] },
  { id: 'waystation-events', buildingType: 'waystation', eventTypes: ['storm-shelter', 'wandering-merchant', 'lost-caravan'] },
  { id: 'exchange-events', buildingType: 'exchange', eventTypes: ['wandering-merchant', 'wandering-scholar', 'resource-cache'] },
  { id: 'exchange-events', buildingType: 'exchange', eventTypes: ['wandering-merchant', 'wandering-scholar', 'resource-cache'] },
  { id: 'regional-management-events', buildingType: 'regional-management', eventTypes: ['village-request', 'abandoned-shrine', 'traveling-herbalist'] },
  { id: 'trade-market-events', buildingType: 'trade-market', eventTypes: ['trade-route', 'commodity-surplus', 'wandering-merchant'] },
  // 防禦設施事件池：以設施類型解鎖（由據點防禦建造產生）。
  { id: 'barricade-events', buildingType: 'barricade', eventTypes: ['siege-alert', 'beast-tracks', 'bandit-ransom'] },
  { id: 'watchtower-events', buildingType: 'watchtower', eventTypes: ['watchtower-report', 'beast-tracks', 'wandering-scholar'] },
  { id: 'arrow-tower-events', buildingType: 'arrow-tower', eventTypes: ['arrow-ambush', 'siege-alert', 'beast-tracks'] },
]

export function getUnlockedExplorationEventPools(
  bases: Array<{ buildings: BaseBuilding[] }>,
  defenseStructureTypes: string[] = [],
): ExplorationEventPoolDefinition[] {
  const buildingTypes = new Set(bases.flatMap((base) => base.buildings.map((building) => building.type)))
  defenseStructureTypes.forEach((type) => buildingTypes.add(type))
  return explorationEventPoolCatalog.filter((pool) => buildingTypes.has(pool.buildingType))
}

/**
 * 將防禦設施類型正規化成對應的事件池建物類型。
 * 進階／小型變種（advanced-*、small-*）統一歸屬基礎設施的事件池。
 */
export function getDefenseStructurePoolKey(structureType: string): string {
  if (structureType === 'barricade') return 'barricade'
  if (structureType === 'watchtower' || structureType === 'advanced-watchtower' || structureType === 'small-watchtower') return 'watchtower'
  if (structureType === 'arrow-tower' || structureType === 'advanced-arrow-tower' || structureType === 'small-arrow-tower') return 'arrow-tower'
  return ''
}

export type EventRequirement =
  | { type: 'adjacent-to-event' }
  | { type: 'active-player' }
  | { type: 'player-alive' }
  | { type: 'money-at-least'; amount: number }
  | { type: 'item-owned'; itemId: string; quantity: number }
  | { type: 'building-exists'; buildingType: string }

export type EventEffect =
  | { type: 'money'; amount: number }
  | { type: 'prestige'; amount: number }
  | { type: 'item'; itemId: string; quantity: number }
  | { type: 'learn-skill'; skillType: 'inner' | 'external'; skillId?: string }
  | { type: 'spawn-creature'; creatureId: string }
  | { type: 'spawn-event'; eventId: string }
  | { type: 'spawn-base'; baseId: string }
  | { type: 'spawn-nest'; nestId: string }
  | { type: 'start-dialogue'; dialogueId: string }

export type ExplorationEventChoiceDefinition = ExplorationEventChoice & {
  requirements: EventRequirement[]
  effects: EventEffect[]
}

export type ExplorationEventDefinition = {
  type: ExplorationEventType
  name: string
  description: string
  icon: string
  choices: ExplorationEventChoiceDefinition[]
}

const baseExplorationEventCatalog: ExplorationEventDefinition[] = [
  {
    type: 'wandering-merchant',
    name: '流浪商人',
    description: '一名流浪商人推著貨車，願意用優惠價格交換物資。',
    icon: '🛒',
    choices: [
      { id: 'buy-health', label: '購買療傷藥', description: '支付 12 金錢，獲得療傷藥。', endsPlayerTurn: false, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 12 }], effects: [{ type: 'money', amount: -12 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }] },
      { id: 'buy-inner-power', label: '購買聚氣丹', description: '支付 15 金錢，獲得聚氣丹。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 15 }], effects: [{ type: 'money', amount: -15 }, { type: 'item', itemId: 'gather-qi-pill', quantity: 1 }] },
    ],
  },
  {
    type: 'abandoned-shrine',
    name: '荒廢祠堂',
    description: '破敗祠堂的香火未滅，似乎仍有某種力量守護著它。',
    icon: '⛩️',
    choices: [
      { id: 'pray', label: '虔誠祈禱', description: '獲得聲望與金錢。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 10 }, { type: 'money', amount: 15 }] },
      { id: 'take-offering', label: '取走供品', description: '獲得療傷藥，但聲望下降。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: -3 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }] },
    ],
  },
  {
    type: 'resource-cache',
    name: '遺落物資箱',
    description: '草叢中藏著一只結實的物資箱，箱面布滿風沙。',
    icon: '📦',
    choices: [{ id: 'open', label: '打開物資箱', description: '獲得金錢與回氣丹。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 20 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 1 }] }],
  },
  {
    type: 'wandering-scholar',
    name: '遊方學者',
    description: '學者正在整理殘卷，願意以知識換取一些旅費。',
    icon: '📚',
    choices: [{ id: 'listen', label: '聽取講解', description: '支付 8 金錢，獲得聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 8 }], effects: [{ type: 'money', amount: -8 }, { type: 'prestige', amount: 12 }] }],
  },
  {
    type: 'beast-tracks',
    name: '異獸足跡',
    description: '泥地上留下巨大的足跡，附近散落著尚未腐敗的獵物。',
    icon: '🐾',
    choices: [{ id: 'scavenge', label: '搜刮獵物', description: '取得食物與少量聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }, { type: 'prestige', amount: 3 }] }],
  },
  {
    type: 'village-request',
    name: '村民求助',
    description: '附近村民請求援助，希望你能提供旅途所需的藥品。',
    icon: '🏘️',
    choices: [
      { id: 'donate', label: '捐出療傷藥', description: '消耗療傷藥，獲得大量聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'item-owned', itemId: 'heal-wound-medicine', quantity: 1 }], effects: [{ type: 'item', itemId: 'heal-wound-medicine', quantity: -1 }, { type: 'prestige', amount: 15 }] },
      { id: 'assist-villagers', label: '協助村民', description: '花費時間安撫與協助村民，獲得少量聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 5 }] },
    ],
  },
  {
    type: 'storm-shelter',
    name: '暴雨避難所',
    description: '暴雨即將來襲，簡陋的避難所可以讓你暫時休整。',
    icon: '🌧️',
    choices: [{ id: 'rest', label: '進入避難所', description: '消耗少量金錢，獲得補給。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 5 }], effects: [{ type: 'money', amount: -5 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 1 }, { type: 'prestige', amount: 2 }] }],
  },
  {
    type: 'bandit-ransom',
    name: '山賊勒索',
    description: '山賊攔住去路，要求金錢，否則便要搶走你的物資。',
    icon: '🏴‍☠️',
    choices: [{ id: 'pay', label: '支付贖金', description: '支付 20 金錢換取平安，並取得山賊留下的療傷藥與回氣丹。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 20 }], effects: [{ type: 'money', amount: -20 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 1 }] }, { id: 'defy', label: '拒絕勒索', description: '堅守立場，獲得聲望但沒有物資。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 8 }] }],
  },
  {
    type: 'traveling-herbalist',
    name: '採藥郎中',
    description: '郎中正在尋找藥材，願意用丹藥交換你的協助。',
    icon: '🌿',
    choices: [{ id: 'assist', label: '協助採藥', description: '獲得療傷藥與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }, { type: 'prestige', amount: 7 }] }],
  },
  {
    type: 'forest-herb-gatherer',
    name: '密林採藥人',
    description: '密林深處，一名採藥人正在辨認靈草，向你尋求協助。',
    icon: '🌲',
    choices: [
      { id: 'gather-herbs', label: '協助採集靈草', description: '獲得療傷藥與少量聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }, { type: 'prestige', amount: 6 }] },
      { id: 'identify-herbs', label: '用探地符辨識藥性', description: '消耗一枚探地符，獲得回氣丹與較高聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'item-owned', itemId: 'scout-talisman', quantity: 1 }], effects: [{ type: 'item', itemId: 'scout-talisman', quantity: -1 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 1 }, { type: 'prestige', amount: 12 }] },
    ],
  },
  {
    type: 'deep-forest-beast',
    name: '密林異獸蹤跡',
    description: '林間留下巨大爪痕與折斷的樹枝，附近似乎有異獸徘徊。',
    icon: '🐾',
    choices: [
      { id: 'track-beast', label: '追蹤異獸', description: '取得獵物留下的材料與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'hobble-rope', quantity: 1 }, { type: 'prestige', amount: 9 }] },
      { id: 'set-trap', label: '設下陷阱', description: '需要防衛營的訓練才能安全布置獵場。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'barracks' }], effects: [{ type: 'item', itemId: 'immobilize-rope', quantity: 1 }, { type: 'prestige', amount: 15 }] },
    ],
  },
  {
    type: 'ancient-tree-enlightenment',
    name: '千年古木悟道',
    description: '古木根部靈氣凝聚，枝葉間傳來悠遠的吐納聲。',
    icon: '🌳',
    choices: [{ id: 'meditate', label: '靜坐調息', description: '獲得回氣丹與悟道聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'recover-qi-pill', quantity: 1 }, { type: 'prestige', amount: 12 }] }],
  },
  {
    type: 'mountain-bandit-ambush',
    name: '險峰山賊伏擊',
    description: '山道被巨石堵住，山賊從高處現身索要過路錢。',
    icon: '⛰️',
    choices: [{ id: 'pay-mountain-bandits', label: '支付過路錢', description: '支付 15 金錢換取安全通行與補給。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 15 }], effects: [{ type: 'money', amount: -15 }, { type: 'item', itemId: 'recall-base-talisman', quantity: 1 }] }, { id: 'break-through', label: '突破伏擊', description: '拒絕山賊要求，獲得聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 12 }] }],
  },
  {
    type: 'cliff-carved-scripture',
    name: '絕壁石刻殘篇',
    description: '絕壁上刻著殘缺的武學文字，似乎記載著古老的運氣法門。',
    icon: '📜',
    choices: [{ id: 'study-cliff-scripture', label: '研讀石刻', description: '領悟一項尚未學會的內功心法。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'learn-skill', skillType: 'inner' }] }, { id: 'copy-cliff-scripture', label: '拓印石刻', description: '將殘篇帶回江湖，換取聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 20 }, { type: 'prestige', amount: 8 }] }],
  },
  {
    type: 'mountain-spring-well',
    name: '雲頂靈泉',
    description: '山巔湧出清澈靈泉，飲下後經脈頓覺清涼。',
    icon: '💧',
    choices: [{ id: 'drink-spring', label: '飲用靈泉', description: '獲得凝元丹與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'condense-yuan-pill', quantity: 1 }, { type: 'prestige', amount: 10 }] }],
  },
  {
    type: 'ferry-merchant',
    name: '渡口神秘水商',
    description: '水商在渡口停船，展示著來自寒潭深處的奇異丹藥。',
    icon: '🛶',
    choices: [{ id: 'buy-water-supply', label: '購買水行補給', description: '支付 18 金錢，取得水域丹藥。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 18 }], effects: [{ type: 'money', amount: -18 }, { type: 'item', itemId: 'gather-qi-pill', quantity: 1 }] }],
  },
  {
    type: 'waterfront-fisher',
    name: '碧波漁叟',
    description: '漁叟坐在水邊垂釣，似乎知道附近所有水路與暗礁。',
    icon: '🎣',
    choices: [{ id: 'hear-fisher-tale', label: '聽取江湖傳聞', description: '獲得金錢與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 12 }, { type: 'prestige', amount: 8 }] }],
  },
  {
    type: 'flooded-temple',
    name: '水淹沉寺',
    description: '半座古寺沉在水下，殘破佛像旁閃著微弱的金光。',
    icon: '🌊',
    choices: [{ id: 'salvage-temple', label: '打撈沉寺寶物', description: '取得寒冰針與少量聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'cold-ice-needle', quantity: 1 }, { type: 'prestige', amount: 10 }] }],
  },
  {
    type: 'desert-mirage',
    name: '荒漠海市蜃樓',
    description: '烈日下出現一座虛幻城池，只有看破幻象才能找到真正的道路。',
    icon: '🏜️',
    choices: [{ id: 'break-mirage', label: '勘破幻象', description: '需要探地符辨識地形，取得火行符籙。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'item-owned', itemId: 'scout-talisman', quantity: 1 }], effects: [{ type: 'item', itemId: 'scout-talisman', quantity: -1 }, { type: 'item', itemId: 'fire-thunder-talisman', quantity: 1 }, { type: 'prestige', amount: 14 }] }, { id: 'leave-mirage', label: '離開幻境', description: '放棄追逐幻象，安全離開。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 3 }] }],
  },
  {
    type: 'buried-caravan',
    name: '風沙埋沒車隊',
    description: '風沙掩埋了一支商隊，只剩車輪與木箱露在沙面上。',
    icon: '🐪',
    choices: [{ id: 'dig-caravan', label: '挖掘車隊', description: '取得金錢、療傷藥與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 35 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }, { type: 'prestige', amount: 8 }] }],
  },
  {
    type: 'wandering-ascetic',
    name: '苦行散修',
    description: '一名苦行武者在荒漠中獨自修行，願以武學交換一段同行之誼。',
    icon: '🔥',
    choices: [{ id: 'learn-ascetic-skill', label: '請教江湖外功', description: '習得一項尚未學會的外功招式。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'learn-skill', skillType: 'external' }] }, { id: 'speak-ascetic', label: '論道切磋', description: '獲得金錢與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 15 }, { type: 'prestige', amount: 10 }] }],
  },
  {
    type: 'strange-well',
    name: '奇異古井',
    description: '古井水面映出陌生星辰，井底似乎藏著被遺忘的財物。',
    icon: '🕳️',
    choices: [{ id: 'draw-water', label: '汲取井水', description: '恢復旅途所需的內力補給。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'item', itemId: 'gather-qi-pill', quantity: 1 }, { type: 'prestige', amount: 4 }] }],
  },
  {
    type: 'ancient-ruins',
    name: '古代遺跡',
    description: '荒野中殘留著古代遺跡，等待探索者發掘。',
    icon: '🏛️',
    choices: [{ id: 'search', label: '搜索遺跡', description: '獲得金錢與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 30 }, { type: 'prestige', amount: 5 }] }],
  },
  {
    type: 'wounded-traveler',
    name: '受傷旅人',
    description: '一名受傷旅人倒在路旁，似乎需要援助。',
    icon: '🩹',
    choices: [{ id: 'help', label: '協助旅人', description: '獲得聲望與療傷藥。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 8 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }] }],
  },
  {
    type: 'lost-caravan',
    name: '失散商隊',
    description: '一支失散的商隊正在等待你的決定。你可以交易、護送或掠奪。',
    icon: '🧭',
    choices: [
      {
        id: 'trade',
        label: '交易',
        description: '支付 10 金錢，獲得一件回氣丹。',
        endsPlayerTurn: false,
        requirements: [
          { type: 'adjacent-to-event' },
          { type: 'active-player' },
          { type: 'player-alive' },
          { type: 'money-at-least', amount: 10 },
        ],
        effects: [
          { type: 'money', amount: -10 },
          { type: 'item', itemId: 'recover-qi-pill', quantity: 1 },
        ],
      },
      {
        id: 'escort',
        label: '護送',
        description: '協助商隊離開危險區域，聲望 +5。',
        endsPlayerTurn: true,
        requirements: [
          { type: 'adjacent-to-event' },
          { type: 'active-player' },
          { type: 'player-alive' },
        ],
        effects: [{ type: 'prestige', amount: 5 }],
      },
      {
        id: 'plunder',
        label: '掠奪',
        description: '取得商隊物資，但聲望 -5。',
        endsPlayerTurn: true,
        requirements: [
          { type: 'adjacent-to-event' },
          { type: 'active-player' },
          { type: 'player-alive' },
        ],
        effects: [
          { type: 'prestige', amount: -5 },
          { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 },
        ],
      },
    ],
  },
  {
    type: 'wandering-fighter',
    name: '雲遊武師',
    description: '一位雲遊四方的武者途經此地，提議以切磋換來一招半式的指點。',
    icon: '🥋',
    choices: [
      { id: 'learn-external', label: '請教外功', description: '習得一項尚未學會的外功招式。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'learn-skill', skillType: 'external' }] },
      { id: 'spar', label: '與之切磋', description: '切磋過後獲得金錢與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 15 }, { type: 'prestige', amount: 8 }] },
    ],
  },
  {
    type: 'martial-script',
    name: '武學殘卷',
    description: '遺落的竹簡上記載著殘缺的內功心法，散發著沉穩的氣息。',
    icon: '📜',
    choices: [
      { id: 'study-script', label: '研讀殘卷', description: '領悟一項未學會的內功心法。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'learn-skill', skillType: 'inner' }] },
    ],
  },
  {
    type: 'trade-route',
    name: '商旅通途',
    description: '長途商旅途經此地，願意以貨換貨或交換情報。',
    icon: '🛣️',
    choices: [
      { id: 'trade-goods', label: '交換貨物', description: '支付 12 金錢，獲得療傷藥與回氣丹。', endsPlayerTurn: false, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 12 }], effects: [{ type: 'money', amount: -12 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 1 }] },
      { id: 'gain-market', label: '打聽市價', description: '分享商隊的市場情報，獲得金錢。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 12 }, { type: 'prestige', amount: 5 }] },
    ],
  },
  {
    type: 'commodity-surplus',
    name: '物資溢餘',
    description: '一群商販囤積過多物資，正尋求脫手去處。',
    icon: '📦',
    choices: [
      { id: 'buy-bulk', label: '大量收購', description: '支付 30 金錢，取得大量補給與建料情報。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'money-at-least', amount: 30 }], effects: [{ type: 'money', amount: -30 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 2 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 2 }, { type: 'prestige', amount: 10 }] },
      { id: 'broker-fee', label: '幫商隊牽線', description: '以聲望為勸樣獲取仲介人賞金。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 12 }, { type: 'money', amount: 15 }] },
    ],
  },
  {
    type: 'siege-alert',
    name: '備戰警訊',
    description: '遠方揚起煙塵，一支敵意部隊可能正朝此處逼近。',
    icon: '⚔️',
    choices: [
      { id: 'fortify', label: '加強防禦', description: '投入時間與物資加固，獲得聲望與經驗。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 15 }] },
      { id: 'scout-out', label: '主動探查', description: '冒着風險偵察敵情，取得金錢回報。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 20 }, { type: 'prestige', amount: 6 }] },
    ],
  },
  {
    type: 'watchtower-report',
    name: '斥候回報',
    description: '哨站的斥候帶來一份關於附近地形的詳細報告。',
    icon: '🔭',
    choices: [
      { id: 'read-report', label: '研讀報告', description: '領悟斥候的經驗，獲得金錢與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'money', amount: 10 }, { type: 'prestige', amount: 12 }] },
    ],
  },
  {
    type: 'arrow-ambush',
    name: '箭雨伏擊',
    description: '棗陰處的射手將怪物逼入絕境，鬆開弓弦等你補刀。',
    icon: '🏹',
    choices: [
      { id: 'finish-off', label: '協助掃除', description: '與射手配合殲滅殘敵，獲得經驗與聲望。', endsPlayerTurn: true, requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }], effects: [{ type: 'prestige', amount: 10 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }] },
    ],
  },
]

const buildingEnhancedChoices: Partial<Record<ExplorationEventType, ExplorationEventChoiceDefinition>> = {
  'wandering-merchant': {
    id: 'shop-bulk-order',
    label: '使用道具商店採購',
    description: '透過據點商店管道大量採購補給，獲得兩種藥品。',
    endsPlayerTurn: false,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'item-shop' }, { type: 'money-at-least', amount: 20 }],
    effects: [{ type: 'money', amount: -20 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 1 }],
  },
  'abandoned-shrine': {
    id: 'wall-reinforce-shrine',
    label: '以城防理念修復祠堂',
    description: '借用強化城牆的修築經驗，取得更高聲望。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'wall' }],
    effects: [{ type: 'prestige', amount: 25 }],
  },
  'resource-cache': {
    id: 'warehouse-secure-cache',
    label: '交由建料倉庫清點',
    description: '使用倉庫管理流程整理物資，取得更高收益。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'warehouse' }],
    effects: [{ type: 'money', amount: 45 }, { type: 'prestige', amount: 5 }, { type: 'item', itemId: 'recover-qi-pill', quantity: 1 }],
  },
  'beast-tracks': {
    id: 'barracks-organized-hunt',
    label: '派遣防衛營追蹤',
    description: '利用軍事訓練追蹤異獸，取得情報與戰利品。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'barracks' }],
    effects: [{ type: 'money', amount: 25 }, { type: 'prestige', amount: 15 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }],
  },
  'village-request': {
    id: 'infirmary-medical-aid',
    label: '啟用醫療室救援',
    description: '以醫療室的專業能力救治村民，換取大量聲望。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'infirmary' }],
    effects: [{ type: 'prestige', amount: 30 }],
  },
  'storm-shelter': {
    id: 'waystation-route-support',
    label: '啟用驛站路線支援',
    description: '利用驛站網絡取得更完整的避雨補給。',
    endsPlayerTurn: false,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'waystation' }],
    effects: [{ type: 'item', itemId: 'recover-qi-pill', quantity: 1 }, { type: 'item', itemId: 'gather-qi-pill', quantity: 1 }, { type: 'prestige', amount: 8 }],
  },
  'bandit-ransom': {
    id: 'barracks-guard-intervention',
    label: '派遣防衛營介入',
    description: '由防衛營出面驅離山賊，保住物資並建立威信。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'barracks' }],
    effects: [{ type: 'prestige', amount: 20 }, { type: 'money', amount: 20 }],
  },
  'traveling-herbalist': {
    id: 'infirmary-herbal-exchange',
    label: '送往醫療室合作',
    description: '以醫療室的照護能力交換更完整的藥材。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'infirmary' }],
    effects: [{ type: 'item', itemId: 'heal-wound-medicine', quantity: 2 }, { type: 'prestige', amount: 15 }],
  },
  'strange-well': {
    id: 'workshop-well-inspection',
    label: '交由工坊檢查井機關',
    description: '透過工坊技術取得井底的完整補給。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'workshop' }],
    effects: [{ type: 'item', itemId: 'gather-qi-pill', quantity: 2 }, { type: 'prestige', amount: 12 }],
  },
  'ancient-ruins': {
    id: 'equipment-shop-relic-appraisal',
    label: '交由裝備商店鑑定遺物',
    description: '使用裝備商店的鑑定管道，取得遺跡的真正價值。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'equipment-shop' }],
    effects: [{ type: 'money', amount: 60 }, { type: 'prestige', amount: 15 }],
  },
  'wounded-traveler': {
    id: 'infirmary-rescue',
    label: '送往醫療室救治',
    description: '以醫療室的設施穩定旅人傷勢，獲得額外回報。',
    endsPlayerTurn: true,
    requirements: [{ type: 'adjacent-to-event' }, { type: 'active-player' }, { type: 'player-alive' }, { type: 'building-exists', buildingType: 'infirmary' }],
    effects: [{ type: 'prestige', amount: 25 }, { type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }],
  },
}

export const explorationEventCatalog: ExplorationEventDefinition[] = baseExplorationEventCatalog.map((event) => {
  const enhancedChoice = buildingEnhancedChoices[event.type]
  return enhancedChoice ? { ...event, choices: [...event.choices, enhancedChoice] } : event
})

export function getExplorationEventDefinition(type: ExplorationEventType) {
  return explorationEventCatalog.find((definition) => definition.type === type)
}
