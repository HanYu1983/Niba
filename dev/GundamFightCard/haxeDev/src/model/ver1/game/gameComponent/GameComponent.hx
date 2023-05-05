package model.ver1.game.gameComponent;

import model.ver1.game.component.CutComponent;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.component.ActiveEffectComponent;
import model.ver1.game.component.ActivePlayerComponent;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;
import model.ver1.game.component.TableComponent;
import model.ver1.game.component.CardStateComponent;
import model.ver1.game.component.PlayerStateComponent;
interface IGameComponent extends ICutComponent extends ICardProtoPoolComponent extends ISelectionComponent extends IMarkComponent extends ITimingComponent extends IActiveEffectComponent extends IActivePlayerComponent extends ITableComponent extends ICardStateComponent extends IPlayerStateComponent{}
