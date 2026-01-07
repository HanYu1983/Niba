import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CardsController')
export class CardsController extends Component {
    @property({ type: Node })
    public container: Node | null = null;

    @property({ type: Prefab })
    public cardPrefab: Prefab | null = null;
}