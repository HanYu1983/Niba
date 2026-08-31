/** 對話觸發條件類型。採開放式字串，供未來擴充自訂條件。 */
export type DialogueTriggerCondition =
  | 'on-start'                // 關卡開局時觸發
  | 'on-objective-complete'   // 特定任務目標達成時觸發（triggerParam = objectiveId）
  | 'on-enter-region'         // 玩家進入指定區域時觸發（triggerParam = "row,column" 或 region id）
  | 'on-enter-area'           // 玩家進入編輯器定義的區域時觸發（triggerParam = areaId）
  | 'on-exit-area'            // 玩家離開編輯器定義的區域時觸發（triggerParam = areaId）
  | 'on-defeat-boss'          // 擊敗首領時觸發（triggerParam = creatureId）
  | 'on-round-reached'        // 到達指定回合時觸發（triggerParam = round number）
  | 'on-object-destroyed'     // 指定物件從地圖消失時觸發（triggerParam = objectId；含生物死亡、建築/防禦設施被破壞等）
  | 'on-failure'              // 失敗結算前觸發
  | 'on-victory'              // 勝利結算前觸發
  | string                    // 開放式擴充

/** 對話佇列中單一步驟的運行時狀態。 */
export type DialogueQueueEntry = {
  stepId: string              // 對應 ScenarioDialogueStep.id
  speakerName: string
  speakerIcon: string
  content: string
  triggerCondition: DialogueTriggerCondition
  triggerParam?: string
  /** 是否已顯示完畢（供跳過/還原用）。 */
  consumed?: boolean
}

/** 劇情模式運行時狀態（對話佇列 + 任務目標 + 失敗條件）。 */
export type CampaignState = {
  /** 當前章節索引（0 = 序章）。 */
  currentChapter: number
  /** 當前章節 key（storyDialogueCatalog 索引鍵）。 */
  chapterKey?: string
  /** 已觸發過的對話 stepId 集合（避免重複觸發）。 */
  triggeredDialogueIds: string[]
  /** 已執行過的觸發器 id 集合（狀態型條件只執行一次；舊存檔可能缺此欄位）。 */
  triggeredTriggerIds?: string[]
  /** 已解決的探索事件 id 集合（供 on-events-resolved 觸發器比對；舊存檔可能缺此欄位）。 */
  resolvedEventIds?: string[]
  /** 待顯示的對話佇列（FIFO；一次可能有多句排隊）。 */
  dialogueQueue: DialogueQueueEntry[]
  /** 本章節的對話定義（由 scenarioCompiler 從 ScenarioDefinition 注入）。 */
  dialogues?: Array<{
    id: string
    speakerName: string
    speakerIcon: string
    content: string
    triggerCondition: string
    triggerParam?: string
    endsChapter?: boolean
  }>
  /** 本章節的對話組定義（由 scenarioCompiler 注入，供觸發器 start-dialogue 使用）。 */
  dialogueGroups?: Record<string, {
    name: string
    steps: Array<{
      id: string
      speakerName: string
      speakerIcon: string
      content: string
    }>
  }>
  /** 本章節的事件觸發器定義（由 scenarioCompiler 注入）。 */
  triggers?: Array<{
    id: string
    condition: string
    conditionParam?: string
    action: 'start-dialogue' | 'spawn-creature'
    actionParam: string
  }>
  /** 編輯器定義的區域列表（供 on-enter-area / on-exit-area 觸發器使用）。 */
  scenarioAreas?: Array<{
    id: string
    name: string
    positions: Array<{ row: number; column: number }>
    /** 此區域的 on-enter-area 觸發器觸發一次後，即從地圖移除（一次性區域）。 */
    destroyWhenTriggered?: boolean
  }>
  /** 探索點消失後是否補充新探索點（劇本模式預設關閉）。 */
  replenishExplorationEvents?: boolean
  /** 任務目標運行時狀態。 */
  activeObjectives: Array<{
    id: string
    title: string
    type: string
    targetValue: number
    currentValue: number
    completed: boolean
    isOptional?: boolean
    /** 目標關聯的物件 id（如擊敗的 Boss creatureId）。 */
    targetId?: string
    /** 目標關聯的多個物件 id，全部互動/完成才計入目標（interact-object 用）。 */
    targetIds?: string[]
    /** 已完成的物件 id 集合（targetIds 目標用的運行時進度）。 */
    doneTargetIds?: string[]
    /** 目標指定的到達位置列（reach-position 目標用）。 */
    targetRow?: number
    /** 目標指定的到達位置欄（reach-position 目標用）。 */
    targetColumn?: number
    /** 目標指定的建築類型（build-building 目標用，如 'infirmary'）。 */
    buildingType?: string
    /** 目標指定的建築等級（build-building 目標用，如 3 表示三級）。 */
    buildingLevel?: number
    /** 目標指定的防禦設施類型（build-defense-structure 目標用）。 */
    structureType?: string
  }>
  /** 失敗條件運行時狀態。 */
  failConditions: {
    maxRounds?: number
    baseMustSurvive?: boolean
    playerMustSurvive?: boolean
    criticalBases?: string[]
    maxLostBasesCount?: number
  }
}

/** 挑戰關卡的全局共享狀態（所有角色共用，localStorage 持久化）。 */
export type ChallengeState = {
  /** 當前闖關等級（從 1 開始）。 */
  level: number
  /** 歷史最高到達等級。 */
  highestLevel: number
  /** 總通關次數。 */
  totalClears: number
}