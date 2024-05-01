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
  //throw new Error("waitAndCheck timeout")
}


// function addEnvGetter() {
//   console.log("addEnvGetter")

//   function getEnvRows() {
//     const elems = [...document.getElementsByClassName("awsui_row_wih1l_15664_301")]
//     const keyValues = elems.map(elem => {
//       const [keyElem, valueElem] = elem.getElementsByClassName("awsui_body-cell_c6tup_1finb_93")
//       return [keyElem, valueElem].map(i => i.textContent)
//     })
//     return keyValues
//   }

//   function getInsertElem() {
//     return getElementByXpath('/html/body/div[2]/div[2]/div/div[1]/div/div/div/main/div/div[3]/div/div/div[5]/div/div/div[2]/div/div[4]/div/div[1]/div/div/div')?.parentNode
//   }

//   const waitInsertElemShowP = waitAndCheck(async () => getInsertElem() != null)

//   const textAreaP = (async () => {
//     await waitInsertElemShowP
//     const textArea = document.createElement('textarea')
//     textArea.value = "wow"
//     return textArea
//   })()

//   const buttonCopyP = (async () => {
//     await waitInsertElemShowP
//     const buttonCopy = document.createElement('button')
//     buttonCopy.textContent = "copy"
//     return buttonCopy
//   })()

//   const addControlPanelP = (async () => {
//     await waitInsertElemShowP
//     const insertElem = getInsertElem()
//     insertElem.appendChild(await buttonCopyP)
//     insertElem.appendChild(await textAreaP)
//   })()

//   const addButtonCopyCallback = (async () => {
//     await addControlPanelP
//     const btn = await buttonCopyP
//     const textArea = await textAreaP
//     btn.onclick = function () {
//       const rows = getEnvRows()
//       const output = rows.map(([k, v]) => `${k}=${v}`).join("\n")
//       textArea.value = output
//     }
//   })()
//   return Promise.all([addControlPanelP, addButtonCopyCallback])
// }

// https://ap-northeast-1.console.aws.amazon.com/elasticbeanstalk/home?region=ap-northeast-1#/environment/configuration/updates-monitoring-logging?environmentId=e-yp3sc4mvaz
async function addEnvSetter() {
  console.log("addEnvSetter")

  function getInsertElem() {
    return getElementByXpath("/html/body/div[2]/div[2]/div/div[1]/div/div/div/main/div/div[3]/div/div/div/div[3]/div[1]/div/div[1]/div/div/div[5]/div/div/div[2]/div/div/div[5]/div/div[1]/div").parentNode
  }

  function getAddEnvButton() {
    return getElementByXpath("/html/body/div[2]/div[2]/div/div[1]/div/div/div/main/div/div[3]/div/div/div/div[3]/div[1]/div/div[1]/div/div/div[5]/div/div/div[2]/div/div/div[5]/div/div[2]/div/div[2]/div/div/div/div/div/div/button")
  }

  function getEnvRows() {
    const elems = [...document.getElementsByClassName("awsui_row_n4qlp_18kkw_161 awsui_root_18wu0_1tuc9_93 awsui_box_18wu0_1tuc9_207 awsui_m-bottom-s_18wu0_1tuc9_859 awsui_color-default_18wu0_1tuc9_207 awsui_font-size-default_18wu0_1tuc9_223 awsui_font-weight-default_18wu0_1tuc9_263")]
    const keyValues = elems.map(elem => {
      const [keyElem, valueElem] = elem.getElementsByClassName("awsui_grid-column_14yj0_1s3lb_135 awsui_colspan-6_14yj0_1s3lb_194")
      return [keyElem, valueElem].map(elem2 => {
        return elem2.getElementsByTagName("input")[0].value
      })
    })
    return keyValues
  }

  await waitAndCheck(async () => getInsertElem() != null)

  const waitAddEnvButtonP = waitAndCheck(async () => getAddEnvButton() != null)
  const addEnvButtonP = waitAddEnvButtonP.then(() => getAddEnvButton())

  async function appendNewEnv(k, v){
    const btn = await addEnvButtonP
    btn.click()
    await sleep(10)
    const elems = [...document.getElementsByClassName("awsui_row_n4qlp_18kkw_161 awsui_root_18wu0_1tuc9_93 awsui_box_18wu0_1tuc9_207 awsui_m-bottom-s_18wu0_1tuc9_859 awsui_color-default_18wu0_1tuc9_207 awsui_font-size-default_18wu0_1tuc9_223 awsui_font-weight-default_18wu0_1tuc9_263")]
    if(elems.length == 0){
      throw new Error('elems.length must > 0')
    }
    const latestElem = elems[elems.length-1]
    const keyInputElem = latestElem.getElementsByClassName("awsui_grid-column_14yj0_1s3lb_135 awsui_colspan-6_14yj0_1s3lb_194")?.[0].getElementsByTagName("input")?.[0]
    if(keyInputElem == null){
      throw new Error("keyInputElem must exist")
    }
    const valueInputElem = latestElem.getElementsByClassName("awsui_grid-column_14yj0_1s3lb_135 awsui_colspan-6_14yj0_1s3lb_194")?.[1].getElementsByTagName("input")?.[0]
    if(valueInputElem == null){
      throw new Error("valueInputElem must exist")
    }
    keyInputElem.value = "key"
    valueInputElem.value = "value"
    // 一將focus移掉，value就被清空，無法實作
  }

  const textAreaP = (async () => {
    const textArea = document.createElement('textarea')
    textArea.value = "wow"
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
      const rows = getEnvRows()
      const output = rows.map(([k, v]) => `${k}=${v}`).join("\n")
      textArea.value = output
    }
  })()

  const addButtonInsertCallback = (async () => {
    const addEnvButton = await addEnvButtonP
    console.log(addEnvButton)
    console.log(getAddEnvButton())
    const btn = await buttonInsertP
    btn.onclick = function () {
      // addEnvButton.click()
      // sleep(1000).then(() => addEnvButton.click())
      appendNewEnv().catch(e=>console.log(e))
    }
  })()

  return Promise.all([addControlPanelP, addButtonCopyCallback, addButtonInsertCallback])
}


//addEnvGetter().catch(e => console.log(e))

addEnvSetter().catch(e => console.log(e))

