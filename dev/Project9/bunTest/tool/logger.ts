const hideCategory: string[] = [
  "triggerEvent",
  "getPlayEffects",
];
let filterCategory = true;

export const log = (category: string, ...msg: any[]) => {
  if (filterCategory) {
    if (hideCategory.find(c => c == category)) {
      return;
    }
  }
  console.log(`[${new Date().toLocaleTimeString()}][${category}]`, ...msg);
};
