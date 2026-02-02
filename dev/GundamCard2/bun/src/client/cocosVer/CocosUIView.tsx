import * as React from "react"
import { CocosAppCss } from "./CocosAppCss"
import { DeckSelectionView } from "./DeckSelectionView"

export const CocosUIView = () => {
    return (
        <div style={{ ...CocosAppCss.abs, ...CocosAppCss.leftTop } as React.CSSProperties}>
            <DeckSelectionView></DeckSelectionView>
        </div>
    )
}
