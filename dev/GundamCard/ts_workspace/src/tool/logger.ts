const enabledCategory = [""];
let ignoreCategory = true;

export const log = (category: string, msg: any) => {
  if (ignoreCategory == false) {
    if (enabledCategory.includes(category) == false) {
      return false;
    }
  }
  console.log(`[${category}] [${new Date().toLocaleTimeString()}] ${msg}`);
};
