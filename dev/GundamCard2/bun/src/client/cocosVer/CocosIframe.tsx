import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../tool/appContext"
import { OnViewModel } from "../tool/appContext/OnViewModel"
import { CocosAppCss } from "./CocosAppCss"
import { OnEvent } from "../tool/appContext/eventCenter"
import { props } from "ramda"

export const CocosIframe = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const appContext = useContext(AppContext)

  const sendMessageToIframe = (data: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      console.log("發送消息給iframe:", data)
      iframeRef.current.contentWindow.postMessage(data, "*")
    } else {
      console.warn("iframe 尚未載入或無法訪問")
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      const data = event.data
      console.log("收到來自iframe的消息:", data)

      switch (data.type) {
        case "onCocosReady":
          console.log("Cocos 已準備好")
          // sendMessageToIframe({ type: "test call cocos" })
          break
        case 'onCocosGameFlow':
          console.log('flow', data.data.flow, 'id', data.data.clientId, 'version', data.data.versionID )
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientId: data.data.clientId || "unknown",
            flow: data.data.flow,
            versionID: data.data.versionID
          });
          break;
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  useEffect(() => {
    const subscription = OnViewModel.subscribe((viewModel) => {
      console.log("CocosIframe 收到 ViewModel 更新:", viewModel)
      sendMessageToIframe({ type: "onWebGameUpdate", data: viewModel })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div style={{ ...CocosAppCss.fullsize, ...CocosAppCss.rel } as React.CSSProperties}>
      <iframe
        ref={iframeRef}
        src="cocos/cocosIndex.html"
        style={{ ...CocosAppCss.fullsize, ...CocosAppCss.rel, border: "none" } as React.CSSProperties}
      ></iframe>
    </div>
  )
}
