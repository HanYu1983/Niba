import { CardController } from "./CardController";
import { CardModel } from "./CardModel";

const { regClass, property } = Laya;

@regClass()
export class DeckController extends Laya.Script {
    @property(Laya.Sprite3D)
    preCard: Laya.Sprite3D = null;

    @property(Laya.Sprite3D)
    proxy:Laya.Sprite3D = null;

    cards: Map<String, CardController> = new Map();

    onAwake(): void {
        this.proxy.active = false;
    }

    public addCard(card: CardModel): void {
        if (this.cards.has(card.uid)) return;
        this.cards.set(card.uid, this.generateCard(card));
    }

    public stack() {
        let i = 0;
        this.cards.forEach((card, key, map) => {
            const card3D = card.owner as Laya.Sprite3D;
            Laya.Tween.to(card3D.transform, { localPositionX: i++ * .6 }, 200, Laya.Ease.circOut, null, 10)
        });
    }

    generateCard(model: CardModel): CardController {
        const card = Laya.Sprite3D.instantiate(this.preCard, this.owner);
        
        card.transform.localPosition.set(0, 0, 0);

        // laya目前的版本在instantiate后，關聯不會保留，要手動加回來
        card.getComponent(CardController).mesh = card.getChildAt(0).getComponent(Laya.MeshRenderer);
        card.getComponent(CardController).setModel(model);

        card.active = true;
        return card.getComponent(CardController);
    }
}