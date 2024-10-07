import { CSSProperties, useEffect, useMemo, useState } from "react"
import { createSelectBoxStyle, useSelectBoxInfo } from "../tool/SelectBox";

const CARD_W = 100
const CARD_H = 150

export const TableVer2 = (props: {
  clientId: string,
  width: number,
  height: number,
  style?: CSSProperties
}) => {
  // scale
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'z') {
        setScale(scale => scale === 1 ? 4 : 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  // 
  const [rowId, setRowId] = useState(0)
  const [colId, setColId] = useState(0)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'w':
          setRowId(rowId => rowId - 1);
          break;
        case 's':
          setRowId(rowId => rowId + 1);
          break;
        case 'a':
          setColId(colId => colId - 1);
          break;
        case 'd':
          setColId(colId => colId + 1);
          break;
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [rowId, colId])

  // selectbox 
  const selectBoxInfo = useSelectBoxInfo()
  const selectionBoxStyle: CSSProperties = useMemo(() => {
    return createSelectBoxStyle(selectBoxInfo)
  }, [selectBoxInfo])

  const renderCards = useMemo(() => {
    return <div style={{
      position: "absolute",
      border: " 1px solid black",
      backgroundColor: "darkgray",
      width: CARD_W,
      height: CARD_H,
      transition: "left 0.5s, top 0.5s, rotate 0.5s",
    }}>
      <img style={{width: "100%", height: "100%"}} src="https://particle-979.appspot.com/common/images/card/cardback_0.jpg"></img>
    </div>
  }, [props.clientId])

  const render = useMemo(() => {
    return <div>

      <div style={{
        position: "relative",
        width: props.width,
        height: props.height,
        transform: `translate(0px, 0px) scale(${scale})`,
        transition: "transform 0.5s",
      }}>
        <div style={{
          position: "absolute",
          backgroundColor: "gray",
          width: props.width,
          height: props.height,
          transform: `translate(${-colId * CARD_W}px, ${ -rowId * CARD_H}px)`,
          transition: "transform 0.5s",
        }}>
          {renderCards}
        </div>
      </div>
      <div style={selectionBoxStyle}></div>
    </div>

  }, [props, scale, rowId, colId, selectionBoxStyle, renderCards])

  return render
}