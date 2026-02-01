import { useEffect, useRef } from "react"

export const CocosIframe = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // 監聽來自iframe的postMessage
    const handleMessage = (event: MessageEvent) => {
      // 驗證來源（可選但推薦）
      // if (event.origin !== window.location.origin) return

      const data = event.data
      console.log("收到來自iframe的消息:", data)

      // 根據消息類型處理
      if (data.type === "gameReady") {
        console.log("遊戲已準備就緒")
      } else if (data.type === "gameEvent") {
        console.log("遊戲事件:", data.event)
      }
      // 可在此添加其他消息類型的處理

      // 回傳消息給iframe（可選）
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "response", received: true },
          "*"
        )
      }
    }

    // 添加監聽器
    window.addEventListener("message", handleMessage)

    // 清理監聽器
    return () => {
      window.removeEventListener("message", handleMessage)
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