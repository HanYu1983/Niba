const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

async function run() {
  // File name will be visible in citations
  // const sampleFile = await ai.files.upload({
  //   file: 'doc.md',
  //   config: { name: 'file-name2', mimeType: "text/plain" },
  // });

  // console.log(sampleFile.name)

  // const fileSearchStore = await ai.fileSearchStores.create({
  //   config: { displayName: 'your-fileSearchStore-name' }
  // });

  // console.log(fileSearchStore.name)

  // let operation = await ai.fileSearchStores.importFile({
  //   fileSearchStoreName: fileSearchStore.name,
  //   fileName: "files/file-name2"
  // });

  // while (!operation.done) {
  //   await new Promise(resolve => setTimeout(resolve, 5000));
  //   operation = await ai.operations.get({ operation: operation });
  // }

  // const fileSearchStores = await ai.fileSearchStores.list();
  // for await (const store of fileSearchStores) {
  //   console.log(store);
  // }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "主角第一次遇到挫折是在哪個章節？",
    config: {
      tools: [
        {
          fileSearch: {
            fileSearchStoreNames: ["fileSearchStores/yourfilesearchstorename-stdy89e4hsg4"]
          }
        }
      ]
    }
  });

  console.log(response.text);
}

run();