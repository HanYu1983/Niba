export type BaseBuildingActionType = 'mission' | 'heal' | 'repair'

export const BUILDING_TYPES = {
    BOARD: 'board',
    ITEM_SHOP: 'item-shop',
    EQUIPMENT_SHOP: 'equipment-shop',
    WALL: 'wall',
    BARRACKS: 'barracks',
    WAREHOUSE: 'warehouse',
    WORKSHOP: 'workshop',
    INFIRMARY: 'infirmary',
    WAYSTATION: 'waystation',
    EXCHANGE: 'exchange',
    REGIONAL_MANAGEMENT: 'regional-management',
    MARTIAL_HALL: 'martial-hall',
} as const

export type BaseBuilding = {
    id: string
    type: string
    name: string
    description: string
    constructionCost: number
    level?: number
    /** 解鎖此建築所需的最低官階；未指定時所有官階皆可建造。 */
    requiredRank?: number
    healthBonus?: number
    materialCapacityBonus?: number
    collectionBonus?: number
    actions?: BaseBuildingActionType[]
    schoolId?: string
}

export const buildingCatalog: BaseBuilding[] = [
    {
        id: 'building-type-board',
        type: 'board',
        name: '告示牌',
        description: '提供據點任務，完成後可獲得金錢。',
        constructionCost: 30,
        requiredRank: 1,
        actions: ['mission'],
    },
    {
        id: 'building-type-item-shop',
        type: 'item-shop',
        name: '道具商店',
        description: '購買療傷藥、回氣丹等消耗品。',
        constructionCost: 30,
        requiredRank: 1,
    },
    {
        id: 'building-type-equipment-shop',
        type: 'equipment-shop',
        name: '裝備商店',
        description: '購買武器、防具與配件。',
        constructionCost: 30,
        requiredRank: 1,
    },
    {
        id: 'building-type-warehouse',
        type: 'warehouse',
        name: '建料倉庫',
        description: '提高建料上限，並提升所屬據點資源點的採集量。',
        constructionCost: 30,
        requiredRank: 1,
        materialCapacityBonus: 50,
        collectionBonus: 5,
    },
    {
        id: 'building-type-martial-hall',
        type: 'martial-hall',
        name: '太虛武館',
        description: '傳授太虛流內功與外功；武館等級決定可學習的功法等級。',
        constructionCost: 30,
        requiredRank: 1,
        schoolId: 'void-spirit',
    },
    {
        id: 'building-type-workshop',
        type: 'workshop',
        name: '修理工坊',
        description: '提供裝備修理功能。',
        constructionCost: 30,
        requiredRank: 1,
        actions: ['repair'],
    },
    {
        id: 'building-type-martial-hall-golden-body', type: 'martial-hall', name: '金剛武館', description: '傳授金剛流內功與外功。', constructionCost: 30, requiredRank: 1, schoolId: 'golden-body',
    },
    {
        id: 'building-type-martial-hall-swift-wind', type: 'martial-hall', name: '追風武館', description: '傳授追風流內功與外功。', constructionCost: 30, requiredRank: 1, schoolId: 'swift-wind',
    },
    {
        id: 'building-type-martial-hall-scarlet-flame', type: 'martial-hall', name: '赤炎武館', description: '傳授赤炎流內功與外功。', constructionCost: 30, requiredRank: 1, schoolId: 'scarlet-flame',
    },
    {
        id: 'building-type-martial-hall-frost-water', type: 'martial-hall', name: '寒水武館', description: '傳授寒水流內功與外功。', constructionCost: 30, requiredRank: 1, schoolId: 'frost-water',
    },
    {
        id: 'building-type-martial-hall-earth-mountain', type: 'martial-hall', name: '厚土武館', description: '傳授厚土流內功與外功。', constructionCost: 30, requiredRank: 1, schoolId: 'earth-mountain',
    },
    {
        id: 'building-type-martial-hall-hundred-poison', type: 'martial-hall', name: '百毒武館', description: '傳授百毒流內功與外功。', constructionCost: 30, requiredRank: 1, schoolId: 'hundred-poison',
    },
    {
        id: 'building-type-infirmary',
        type: 'infirmary',
        name: '醫療室',
        description: '提供就醫功能，恢復氣血與內力。',
        constructionCost: 30,
        requiredRank: 1,
        actions: ['heal'],
    },
    {
        id: 'building-type-wall',
        type: 'wall',
        name: '強化城牆',
        description: '提升據點最大生命，並每回合恢復城牆生命。',
        constructionCost: 30,
        requiredRank: 1,
        healthBonus: 30,
    },
    {
        id: 'building-type-barracks',
        type: 'barracks',
        name: '防衛營',
        description: '據點鄰近的友軍每回合恢復氣血。',
        constructionCost: 30,
        requiredRank: 1,
        healthBonus: 2,
    },
    {
        id: 'building-type-trade-market',
        type: 'trade-market',
        name: '貿易市場',
        description: '本身無互動功能。建成時隨機賦予一項影響整局遊戲的全局靈氣；來源據點失守即失效。',
        constructionCost: 30,
        requiredRank: 1,
    },
    {
        id: 'building-type-waystation',
        type: 'waystation',
        name: '驛站',
        description: '支付少量金錢，傳送至任意其他據點。',
        constructionCost: 30,
        requiredRank: 1,
    },
    {
        id: 'building-type-exchange',
        type: 'exchange',
        name: '交易所',
        description: '開啟跨據點共享的公共倉庫。',
        constructionCost: 30,
        requiredRank: 1,
    },
    {
        id: 'building-type-regional-management',
        type: 'regional-management',
        name: '總管府',
        description: '管理所有據點的政策與建料調度。',
        constructionCost: 30,
        requiredRank: 1,
    }
]