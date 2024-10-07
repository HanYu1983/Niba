import { prop } from "ramda"
import { CSSProperties, useMemo } from "react"
import { TableVer2 } from "./TableVer2"
import { PlayerA } from "../../game/define/PlayerID"

export const AppVer2 = (props: {
  style?: CSSProperties
}) => {
  return <div>
    <TableVer2 clientId={PlayerA} width={1000} height={1000}></TableVer2>
  </div>
}