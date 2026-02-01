import { useEffect, useRef } from "react"

export const CocosIframe = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 發送消息給 iframe 的方法
  const sendMessageToIframe = (data: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      console.log("發送消息給iframe:", data)
      iframeRef.current.contentWindow.postMessage(data, "*")
    } else {
      console.warn("iframe 尚未載入或無法訪問")
    }
  }

  useEffect(() => {
    // 監聽來自iframe的postMessage
    const handleMessage = (event: MessageEvent) => {
      // 驗證來源（可選但推薦）
      if (event.origin !== window.location.origin) return

      const data = event.data
      console.log("收到來自iframe的消息:", data)

      // 根據消息類型處理
      if (data.type === "ready") {
        console.log("iframe ready")
        // sendMessageToIframe({ type: "my ready", timestamp: Date.now() })
      } else if (data.type === "gameEvent") {
        console.log("遊戲事件:", data.event)
      }
      // 可在此添加其他消息類型的處理
    }

    // iframe 載入完成時的處理
    const handleIframeLoad = () => {
      console.log("iframe 載入完成")
      sendMessageToIframe({ type: "my ready", timestamp: Date.now() })
      // 延遲發送消息，確保 iframe 內部的監聽器已註冊
      // setTimeout(() => {
      //   sendMessageToIframe({ type: "ready", timestamp: Date.now() })
      // }, 1000)
    }

    // 添加監聽器
    window.addEventListener("message", handleMessage)
    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad)
    }

    // 清理監聽器
    return () => {
      window.removeEventListener("message", handleMessage)
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad)
      }
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