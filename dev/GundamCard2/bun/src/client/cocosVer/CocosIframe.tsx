import { useEffect, useRef } from "react"

export const CocosIframe = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

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

      switch(data.name){
        case "cocos ready":
          console.log("Cocos 已準備好")
          sendMessageToIframe({ type: "test call cocos" })
          break
      }
    }

    // const handleIframeLoad = () => {
    //   console.log("iframe 載入完成")
    //   sendMessageToIframe({ type: "my ready", timestamp: Date.now() })
    // }

    window.addEventListener("message", handleMessage)
    // const iframe = iframeRef.current
    // if (iframe) {
    //   iframe.addEventListener("load", handleIframeLoad)
    // }

    return () => {
      window.removeEventListener("message", handleMessage)
      // if (iframe) {
      //   iframe.removeEventListener("load", handleIframeLoad)
      // }
    }
  }, [])

  return (
    <div style={{ width: "100%", height: "100%" }}>
        <iframe 
          ref={iframeRef}
          src="cocos/cocosIndex.html" 
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
    </div>
  )
}