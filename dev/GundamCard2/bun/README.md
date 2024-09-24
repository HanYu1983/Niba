# create project
```
bun create typescript
```

# 建立web專案
## 舊方法
```bash
# 先build index.js到public
bun build src\index.ts --outdir public

# copy script/data到public/data
xcopy /E /I /Y src\script\data public\data

# 修改public/index.ts中的
# await import(`./data/${prodid}.json`) => await import(`./data/${prodid}.json`, {with: {type: "json"}})
# await import(`./ext/${imgID}`) => await import(`./ext/${imgID}.js`)

# 再用tsc build src/script/ext資料夾中的所有ts
npm run build

# 再將tmp中的script/ext移到public/ext中
xcopy /E /I /Y tmp\script\ext public\ext
# 刪除tmp資料夾
# 測試WEB
cd public
run.bat
```
## 目前方法
```bash
bun build src\web.tsx --outdir public
runWeb.bat
```