import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";

export function MessagesView(props: {}) {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const msgs = appContext.viewModel.model.gameState.messages
    return <div style={{overflow: "scroll", height: 300}}>
      {
        msgs.map((msg) => {
          return <div key={msg.id} style={{border: "1px solid black"}}>
            {msg.id}:{msg.description}
          </div>
        })
      }
    </div>
  }, [appContext.viewModel.model.gameState.messages])
  return render
}