# install bun
```bash
npm i -g bun
```

# test

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# 建立web專案
```bash
# 先build index.js到public
bun build index.ts --outdir public

# copy script/data到public/data
xcopy /E /I /Y script\data public\data

# 修改public/index.ts中的
# await import(`./data/${prodid}.json`) => await import(`./data/${prodid}.json`, {with: {type: "json"}})
# await import(`./ext/${imgID}`) => await import(`./ext/${imgID}.js`)

# 再用tsc build script/ext資料夾中的所有ts
bun tsc ext.ts -m esnext --outdir tmp

# 再將tmp中的script/ext移到public/ext中
xcopy /E /I /Y tmp\script\ext public\ext
# 刪除tmp資料夾
# 測試WEB
cd public
run.bat
```