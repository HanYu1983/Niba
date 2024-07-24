function sleep(s) {
  return new Promise((res, rej) => {
    setTimeout(res, s)
  })
}

function getElementByXpath(path) {
  // chrome copy full xpath
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

async function waitAndCheck(checkFn) {
  for (let i = 0; i < 20; ++i) {
    if (await checkFn()) {
      return
    }
    await sleep(2000)
  }
  throw new Error("waitAndCheck timeout")
}

// https://ap-northeast-1.console.aws.amazon.com/elasticbeanstalk/home?region=ap-northeast-1#/environment/configuration/updates-monitoring-logging?environmentId=e-yp3sc4mvaz
async function addEnvSetter() {
  console.log("addEnvSetter")

  function getInsertElem() {
    return getElementByXpath("/html/body/div[2]/div[2]/div/div[1]/div/div/div/main/div/div[3]/div/div/div[2]/div/div[1]/div/div/div[5]/div/div/div[2]/div/div/div[5]/div/div[1]/div/h3").parentNode
  }

  function getAddEnvButton() {
    return getElementByXpath("/html/body/div[2]/div[2]/div/div[1]/div/div/div/main/div/div[3]/div/div/div[2]/div/div[1]/div/div/div[5]/div/div/div[2]/div/div/div[5]/div/div[2]/div/div[2]/div/div/div/div/div/div/button")
  }

  function getKeyValueRootTags(){
    return document.getElementsByClassName("awsui_grid_14yj0_ak6xz_97 awsui_grid_vvxn7_1f735_132 awsui_grid-columns-2_vvxn7_1f735_159 awsui_no-gutters_14yj0_ak6xz_136 awsui_grid-breakpoint-xs_vvxn7_1f735_156")
  }

  function getKeyValuePairTagByRootTags(keyValueRootTag){
    const ret = keyValueRootTag.getElementsByClassName("awsui_grid-column_14yj0_ak6xz_141 awsui_colspan-6_14yj0_ak6xz_202")
    if(ret.length < 2){
      throw new Error("Key Value Pair not right")
    }
    return ret
  }

  function getEnvRows() {
    const elems = [...getKeyValueRootTags()]
    if (elems.length == 0) {
      throw new Error("找不到環境屬性的TAG")
    }
    const keyValues = elems.map(elem => {
      const [keyElem, valueElem] = [...getKeyValuePairTagByRootTags(elem)]
      return [keyElem, valueElem].map(elem2 => {
        return elem2.getElementsByTagName("input")[0].value
      })
    })
    return keyValues
  }

  await waitAndCheck(async () => getInsertElem() != null).catch(e => {
    console.log(e)
    throw new Error("找不到將要插入按鈕的節點")
  })

  const waitAddEnvButtonP = waitAndCheck(async () => getAddEnvButton() != null).catch(e => {
    console.log(e)
    throw new Error("找不到將要新增環境屬性按鈕")
  })
  const addEnvButtonP = waitAddEnvButtonP.then(() => getAddEnvButton())

  async function appendNewEnv(k, v) {
    const btn = await addEnvButtonP
    btn.click()
    await sleep(10)
    const elems = [...getKeyValueRootTags()]
    if (elems.length == 0) {
      throw new Error("找不到環境屬性的TAG")
    }
    const latestElem = elems[elems.length - 1]
    const [keyInputElem, valueInputElem] = [...getKeyValuePairTagByRootTags(latestElem)].map(elem=>{
      return elem.getElementsByTagName("input")?.[0]
    })
    if(keyInputElem == null){
      throw new Error("keyInputElem not found")
    }
    if(valueInputElem == null){
      throw new Error("valueInputElem not found")
    }
    keyInputElem.value = "key"
    valueInputElem.value = "value"
    // 一將focus移掉，value就被清空，無法實作
  }

  const textAreaP = (async () => {
    const textArea = document.createElement('textarea')
    textArea.value = "a=test"
    return textArea
  })()

  const buttonCopyP = (async () => {
    const buttonCopy = document.createElement('button')
    buttonCopy.textContent = "copy"
    return buttonCopy
  })()

  const buttonInsertP = (async () => {
    const btn = document.createElement('button')
    btn.textContent = "insert"
    return btn
  })()

  const addControlPanelP = (async () => {
    const insertElem = getInsertElem()
    insertElem.appendChild(await buttonCopyP)
    insertElem.appendChild(await textAreaP)
    insertElem.appendChild(await buttonInsertP)
  })()

  const addButtonCopyCallback = (async () => {
    const btn = await buttonCopyP
    const textArea = await textAreaP
    btn.onclick = function () {
      try {
        const rows = getEnvRows()
        const output = rows.map(([k, v]) => `${k}=${v}`).join("\n")
        textArea.value = output
      } catch (e) {
        console.error(e)
        alert(e.message)
      }
    }
  })()

  const addButtonInsertCallback = (async () => {
    const btn = await buttonInsertP
    btn.onclick = function () {
      (async () => {
        try {
          await appendNewEnv("test k", "test v")
        } catch (e) {
          console.error(e)
          alert(e.message)
        }
      })()
    }
  })()

  return Promise.all([addControlPanelP, addButtonCopyCallback, addButtonInsertCallback])
}

addEnvSetter().catch(e => console.log(e))

