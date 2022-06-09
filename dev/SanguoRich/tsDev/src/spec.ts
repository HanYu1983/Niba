// 先定義類型, 為了給別的ts參照
export type Spec = {
  doA: (age: People) => string;
};

export type People = {
  age: number;
};

// 會被放在exports.spec
export const spec: Spec = {
  doA: (p) => {
    console.log(`test ts`, p);
    return "";
  },
};
