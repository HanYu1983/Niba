/* 相容出口：對話規則已下沉至 rules/dialogueRules。 */
export {
  dequeueDialogue,
  enqueueDialogue,
  getDialogueQueue,
  getTriggeredDialogueIds,
  isDialogueQueueEmpty,
  markDialogueTriggered,
  markDialoguesTriggered,
  skipAllDialogue,
} from '../rules/dialogueRules'
