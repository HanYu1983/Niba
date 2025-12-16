const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

async function run() {
  // File name will be visible in citations
  const fileSearchStore = await ai.fileSearchStores.create({
    config: { displayName: 'test_han_doc' }
  });

  let operation = await ai.fileSearchStores.uploadToFileSearchStore({
    file: 'doc.md',
    fileSearchStoreName: fileSearchStore.name,
    config: {
      displayName: 'file-name',
      mimeType: "text/plain"
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.get({ operation });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "故事中主角總共使用幾種程式語言，主角最喜歡哪一種？",
    config: {
      tools: [
        {
          fileSearch: {
            fileSearchStoreNames: [fileSearchStore.name]
          }
        }
      ]
    }
  });

  console.log(response.text);
}

run();