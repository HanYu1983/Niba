import * as React from "react"
import { CocosAppCss } from "./CocosAppCss"
import { Button, Card, Space } from "antd"
import { createDecks } from "../../game/gameState/cardTextTestEnv"
import { useMemo } from "react"

export const DeckSelectionView = () => {

    const renderDecks = useMemo(() => {
        const deck = createDecks()
        const elems = deck.map((d, index) => {
            return (
                <Card key={index} title={`Deck ${index + 1}`}>
                    <Space>
                        <Button>
                            玩家
                        </Button>
                        <Button>
                            對手
                        </Button>
                    </Space>

                </Card>
            )
        })
        return elems
    }, [])

    return (
        <div style={{ ...CocosAppCss.rel, ...CocosAppCss.leftTop, width: "100%", left: '10px', top: '10px' } as React.CSSProperties}>
            <Space size={16}>
                {renderDecks}
            </Space>
        </div>
    )
}