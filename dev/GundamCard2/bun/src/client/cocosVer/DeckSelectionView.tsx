import * as React from "react"
import { useState, useMemo } from "react"
import { CocosAppCss } from "./CocosAppCss"
import { Button, Card, Space, Typography, Divider } from "antd"
import { createDecks } from "../../game/gameState/cardTextTestEnv"
import { OnEvent } from "../tool/appContext/eventCenter"
import { loadPrototype } from "../../script"

const { Title, Text } = Typography

export const DeckSelectionView = () => {
    const [playerDeckIndex, setPlayerDeckIndex] = useState<number | null>(null)
    const [opponentDeckIndex, setOpponentDeckIndex] = useState<number | null>(null)
    const decks = useMemo(() => createDecks(), [])

    const handleStartGame = async () => {
        if (playerDeckIndex === null || opponentDeckIndex === null) {
            alert("請選擇雙方的牌組")
            return
        }

        const deckA = decks[playerDeckIndex]
        const deckB = decks[opponentDeckIndex]
        const prototypeIds = [...deckA, ...deckB]
        
        await Promise.all(prototypeIds.map(loadPrototype))
            .then(() => console.log("loadOK"))
            .catch(console.error)
        
        OnEvent.next({ id: "OnClickNewGame", deckA, deckB })
    }

    const renderDecks = useMemo(() => {
        const deck = createDecks()
        const elems = deck.map((d, index) => {
            const isPlayerSelected = playerDeckIndex === index
            const isOpponentSelected = opponentDeckIndex === index
            
            return (
                <Card 
                    key={index} 
                    title={`牌組 ${index + 1}`}
                    hoverable
                    style={{
                        width: 200,
                        border: isPlayerSelected || isOpponentSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        backgroundColor: isPlayerSelected ? '#e6f7ff' : isOpponentSelected ? '#fff7e6' : 'white'
                    }}
                >
                    <Text type="secondary">{d[0]}</Text>
                    <br />
                    <Text type="secondary">共 {d.length} 張卡</Text>
                    <Space style={{ marginTop: 10 }}>
                        <Button 
                            size="small"
                            type={isPlayerSelected ? "primary" : "default"}
                            onClick={() => setPlayerDeckIndex(index)}
                        >
                            玩家
                        </Button>
                        <Button 
                            size="small"
                            type={isOpponentSelected ? "primary" : "default"}
                            onClick={() => setOpponentDeckIndex(index)}
                        >
                            對手
                        </Button>
                    </Space>
                </Card>
            )
        })
        return elems
    }, [playerDeckIndex, opponentDeckIndex])

    return (
        <div style={{ 
            ...CocosAppCss.rel, 
            ...CocosAppCss.leftTop, 
            width: "100%", 
            left: '10px', 
            top: '10px',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            maxHeight: '100vh',
            overflowY: 'auto'
        } as React.CSSProperties}>
            <Title level={3}>選擇對戰牌組</Title>
            <Text>玩家: {playerDeckIndex !== null ? `牌組 ${playerDeckIndex + 1}` : '未選擇'} | 對手: {opponentDeckIndex !== null ? `牌組 ${opponentDeckIndex + 1}` : '未選擇'}</Text>
            <Divider />
            <Space size={16} wrap>
                {renderDecks}
            </Space>
            <Divider />
            <Button 
                type="primary" 
                size="large"
                onClick={handleStartGame}
                disabled={playerDeckIndex === null || opponentDeckIndex === null}
            >
                開始遊戲
            </Button>
        </div>
    )
}