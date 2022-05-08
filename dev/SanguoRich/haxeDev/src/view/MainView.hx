package view;

import model.TreasureGenerator.TreasureCatelog;
import view.popup.TreasurePreviewView;
import view.widgets.PeopleListView;
import view.popup.PkPreviewView;
import view.popup.CostForBonusView;
import model.GridGenerator.BUILDING;
import haxe.ui.containers.Box;
import view.popup.BuildPreview;
import haxe.Exception;
import model.PeopleGenerator;
import model.PeopleGenerator.People;
import haxe.ui.containers.dialogs.Dialog;
import haxe.ui.containers.dialogs.MessageBox.MessageBoxType;
import haxe.ui.containers.dialogs.Dialogs;
import view.popup.StrategyPreviewView;
import model.Config;
import view.widgets.GridGridView;
import view.widgets.LeaderGridView;
import model.IModel.PlayerInfo;
import view.popup.TransferPreview;
import view.popup.FirePreviewView;
import view.popup.ResourcePreviewView;
import view.popup.ExploreSuccessView;
import view.popup.GrowView;
import view.popup.ExplorePreviewView;
import view.popup.HirePreviewView;
import view.popup.WarPreviewView;
import view.popup.NegoPreviewView;
import view.popup.SnatchPreviewView;
import model.GridGenerator.Grid;
import model.IModel.ActionInfo;
import model.IModel.ActionInfoID;
import model.IModel.EventInfo;
import tweenx909.TweenX;
import model.IModel.GameInfo;
import haxe.ui.events.UIEvent;
import haxe.ui.core.Component;
import haxe.ui.containers.VBox;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/main-view.xml"))
class MainView extends Box {
	var grids:Array<GridView> = [];
	var players:Array<PlayerView> = [];
	var leaderView:LeaderGridView;
	var gridView:GridGridView;
	var peopleListView:PeopleListView;
	var strategyPreviewView:StrategyPreviewView;
	var treasurePreviewView:TreasurePreviewView;
	var gridPeopleListView:PeopleListView;
	var warPreviewView:WarPreviewView;
	var snatchPreviewView:SnatchPreviewView;
	var negoPreviewView:NegoPreviewView;
	var pkPrevieView:PkPreviewView;
	var hirePreviewView:HirePreviewView;
	var costForBonusView:CostForBonusView;
	var explorePreviewView:ExplorePreviewView;
	var exploreSuccessView:ExploreSuccessView;
	var resourcePreviewView:ResourcePreviewView;
	var firePreviewView:FirePreviewView;
	var transferPreview:TransferPreview;
	var buildingPreview:BuildPreview;
	var growView:GrowView;

	var gridSize = 80;

	public function new() {
		super();

		for (i in 0...30) {
			var grid = new GridView();
			box_grids.addComponent(grid);
			grids.push(grid);
		}

		for (i in 0...2) {
			var p = new PlayerView(20, 20);
			switch (i) {
				case 0:
					p.boxColor = '#FF0000';
				case 1:
					p.boxColor = '#00FF00';
				case 2:
					p.boxColor = '#0000FF';
				case 3:
					p.boxColor = '#FFFF00';
			}
			players.push(p);
			box_players.addComponent(p);
		}

		box_popup.hide();

		leaderView = new LeaderGridView();
		box_playerView.addComponent(leaderView);

		gridView = new GridGridView();
		box_gridView.addComponent(gridView);

		warPreviewView = new WarPreviewView();
		warPreviewView.hide();
		box_popup.addComponent(warPreviewView);

		snatchPreviewView = new SnatchPreviewView();
		snatchPreviewView.hide();
		box_popup.addComponent(snatchPreviewView);

		negoPreviewView = new NegoPreviewView();
		negoPreviewView.hide();
		box_popup.addComponent(negoPreviewView);

		pkPrevieView = new PkPreviewView();
		pkPrevieView.hide();
		box_popup.addComponent(pkPrevieView);

		hirePreviewView = new HirePreviewView();
		hirePreviewView.hide();
		box_popup.addComponent(hirePreviewView);

		explorePreviewView = new ExplorePreviewView();
		explorePreviewView.hide();
		box_popup.addComponent(explorePreviewView);

		exploreSuccessView = new ExploreSuccessView();
		exploreSuccessView.hide();
		box_popup.addComponent(exploreSuccessView);

		resourcePreviewView = new ResourcePreviewView();
		resourcePreviewView.hide();
		box_popup.addComponent(resourcePreviewView);

		firePreviewView = new FirePreviewView();
		firePreviewView.hide();
		box_popup.addComponent(firePreviewView);

		transferPreview = new TransferPreview();
		transferPreview.hide();
		box_popup.addComponent(transferPreview);

		buildingPreview = new BuildPreview();
		buildingPreview.hide();
		box_popup.addComponent(buildingPreview);

		growView = new GrowView();
		growView.hide();
		box_popup.addComponent(growView);

		strategyPreviewView = new StrategyPreviewView();
		strategyPreviewView.hide();
		box_popup.addComponent(strategyPreviewView);

		treasurePreviewView = new TreasurePreviewView();
		treasurePreviewView.hide();
		box_popup.addComponent(treasurePreviewView);

		costForBonusView = new CostForBonusView();
		costForBonusView.hide();
		box_popup.addComponent(costForBonusView);

		peopleListView = new PeopleListView();
		box_playerPeopleList.addComponent(peopleListView);

		gridPeopleListView = new PeopleListView();
		box_gridPeopleList.addComponent(gridPeopleListView);
	}

	public function onShowPopup() {
		box_popup.fadeIn();
	}

	public function onHidePopup() {
		box_popup.fadeOut();
	}

	public function onTransferPreviewConfirmClick(data:Dynamic) {
		final gameInfo = Main.model.gameInfo();
		final p:PlayerInfo = data[0];
		final g:Grid = data[1];
		Main.model.takeTransfer(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p, g, syncViewByInfo);
	}

	public function onNegoPreviewConfirmNegoClick(p1Id:Int, p2Id:Int) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeNegoOn(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, p2Id, syncViewByInfo);
	}

	public function onExplorePreviewConfirmClick(p1Id:Int) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeExplore(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, syncViewByInfo);
	}

	public function onHirePreviewViewConfirmClick(p1Id:Int, p2Id:Int) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeHire(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, p2Id, syncViewByInfo);
	}

	public function onFirePreviewViewConfirmClick(pId:Array<Int>) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeFire(gameInfo.currentPlayer.id, pId, syncViewByInfo);
	}

	public function onWarPreviewConfirmClick(p1Id:Int, p2Id:Int, p1Army:Float, p2Army:Float) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeWarOn(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, p2Id, p1Army, p2Army, syncViewByInfo);
	}

	public function onSnatchPreviewConfirmClick(p1Id:Int, p2Id:Int, isOccupation:Bool) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeSnatchOn(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, p2Id, isOccupation, syncViewByInfo);
	}

	public function onResourcePreviewConfirmClick(p1Id:Int, market:model.IModel.MARKET, resource:model.IModel.RESOURCE) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeResource(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, market, resource, syncViewByInfo);
	}

	public function onExploreSuccessViewConfirmClick() {
		onBtnHireClick(null);
	}

	@:bind(this, UIEvent.READY)
	function onUIReady(e:UIEvent) {
		for (index => grid in grids) {
			grid.left = (index % 10) * gridSize;
			grid.top = Math.floor(index / 10) * gridSize;
		}

		btn_camp.text = '${btn_camp.text}(${ENERGY_COST_ON_COST_FOR_FUN})';
		btn_practice.text = '${btn_practice.text}(${ENERGY_COST_ON_COST_FOR_FUN})';
		btn_payForFun.text = '${btn_payForFun.text}(${ENERGY_COST_ON_COST_FOR_FUN})';
		btn_showStrategy.text = '${btn_showStrategy.text}(${ENERGY_COST_ON_STRATEGY})';
		btn_negotiate.text = '${btn_negotiate.text}(${ENERGY_COST_ON_NEGO})';
		btn_pk.text = '${btn_pk.text}(${ENERGY_COST_ON_PK})';
		btn_snatch.text = '${btn_snatch.text}(${ENERGY_COST_ON_SNATCH})';
		btn_occupation.text = '${btn_occupation.text}(${ENERGY_COST_ON_WAR})';
		btn_explore.text = '${btn_explore.text}(${ENERGY_COST_ON_EXPLORE})';
		btn_hire.text = '${btn_hire.text}(${ENERGY_COST_ON_HIRE})';
		btn_buyArmy.text = '${btn_buyArmy.text}(${ENERGY_COST_ON_RESOURCE})';
		btn_buyFood.text = '${btn_buyFood.text}(${ENERGY_COST_ON_RESOURCE})';
		btn_earnMoney.text = '${btn_earnMoney.text}(${ENERGY_COST_ON_RESOURCE})';
		btn_sellArmy.text = '${btn_sellArmy.text}(${ENERGY_COST_ON_RESOURCE})';
		btn_sellFood.text = '${btn_sellFood.text}(${ENERGY_COST_ON_RESOURCE})';
	}

	@:bind(btn_save, MouseEvent.CLICK)
	function onBtnSaveClick(e) {
		Main.model.save((success:Bool) -> {
			final msg = success ? '成功記錄' : '記錄失敗';
			Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_INFO);
		});
	}

	@:bind(btn_load, MouseEvent.CLICK)
	function onBtnLoadClick(e) {
		Main.model.load((success:Bool, gameInfo:GameInfo) -> {
			final msg = success ? '成功讀取' : '讀取失敗';
			if (success) {
				syncViewByInfo(gameInfo);
			}
			Dialogs.messageBox(msg, msg, MessageBoxType.TYPE_INFO);
		});
	}

	@:bind(btn_pk, MouseEvent.CLICK)
	function onBtnPKClick(e:MouseEvent) {
		final gameInfo:GameInfo = Main.model.gameInfo();
		switch (gameInfo.currentPlayer) {
			case {atGridId: gameInfo.grids[_].people.length == 0 => true}:
				Dialogs.messageBox('對方沒有武將可以單挑', '', MessageBoxType.TYPE_INFO);
			case {people: _.length == 0 => true}:
				Dialogs.messageBox('沒有武將可以單挑', '', MessageBoxType.TYPE_INFO);
			case _:
				pkPrevieView.showPopup(null);
		}
	}

	@:bind(btn_go, MouseEvent.CLICK)
	function onBtnGoClick(e:MouseEvent) {
		Main.model.playerDice(syncView);
	}

	@:bind(btn_payForFun, MouseEvent.CLICK)
	function onBtnPayForFunClick(e) {
		costForBonusView.showPopup({type: 2});
	}

	@:bind(btn_camp, MouseEvent.CLICK)
	function onBtnCampClick(e) {
		costForBonusView.showPopup({type: 0});
	}

	@:bind(btn_practice, MouseEvent.CLICK)
	function onBtnPracticeClick(e) {
		costForBonusView.showPopup({type: 1});
	}

	@:bind(btn_firePeople, MouseEvent.CLICK)
	function onBtnFirePeopleClick(e:MouseEvent) {
		var player = Main.model.gameInfo().currentPlayer;
		if (player.people.length > 0) {
			firePreviewView.showPopup(null);
		}
	}

	@:bind(btn_earnMoney, MouseEvent.CLICK)
	function onBtnEarnMoneyClick(e) {
		var player = Main.model.gameInfo().currentPlayer;
		final market = model.IModel.MARKET.BUY;
		final resource = model.IModel.RESOURCE.MONEY;
		var previewInfo:Dynamic = Main.model.getTakeResourcePreview(player.id, player.atGridId, market, resource);
		previewInfo.market = market;
		previewInfo.resource = resource;
		resourcePreviewView.showPopup(previewInfo);
	}

	@:bind(btn_buyFood, MouseEvent.CLICK)
	function onBtnBuyFoodClick(e) {
		var player = Main.model.gameInfo().currentPlayer;
		if (player.money < 1.0) {
			Dialogs.messageBox('你沒有足夠的金錢哦!', '主公啊…', MessageBoxType.TYPE_WARNING);
			return;
		}
		final market = model.IModel.MARKET.BUY;
		final resource = model.IModel.RESOURCE.FOOD;
		var previewInfo:Dynamic = Main.model.getTakeResourcePreview(player.id, player.atGridId, market, resource);
		previewInfo.market = market;
		previewInfo.resource = resource;
		resourcePreviewView.showPopup(previewInfo);
	}

	@:bind(btn_buyArmy, MouseEvent.CLICK)
	function onBtnBuyArmyClick(e) {
		var player = Main.model.gameInfo().currentPlayer;
		if (player.money < 1.0) {
			Dialogs.messageBox('你沒有足夠的金錢哦!', '主公啊…', MessageBoxType.TYPE_WARNING);
			return;
		}
		final market = model.IModel.MARKET.BUY;
		final resource = model.IModel.RESOURCE.ARMY;
		var previewInfo:Dynamic = Main.model.getTakeResourcePreview(player.id, player.atGridId, market, resource);
		previewInfo.market = market;
		previewInfo.resource = resource;
		resourcePreviewView.showPopup(previewInfo);
	}

	@:bind(btn_sellFood, MouseEvent.CLICK)
	function onBtnSellFoodClick(e) {
		var player = Main.model.gameInfo().currentPlayer;
		if (player.food < 1.0) {
			Dialogs.messageBox('你沒有足夠的糧食哦!', '主公啊…', MessageBoxType.TYPE_WARNING);
			return;
		}
		final market = model.IModel.MARKET.SELL;
		final resource = model.IModel.RESOURCE.FOOD;
		var previewInfo:Dynamic = Main.model.getTakeResourcePreview(player.id, player.atGridId, market, resource);
		previewInfo.market = market;
		previewInfo.resource = resource;
		resourcePreviewView.showPopup(previewInfo);
	}

	@:bind(btn_sellArmy, MouseEvent.CLICK)
	function onBtnSellArmyClick(e) {
		var player = Main.model.gameInfo().currentPlayer;
		if (player.army < 1.0) {
			Dialogs.messageBox('你沒有足夠的士兵哦!', '主公啊…', MessageBoxType.TYPE_WARNING);
			return;
		}
		final market = model.IModel.MARKET.SELL;
		final resource = model.IModel.RESOURCE.ARMY;
		var previewInfo:Dynamic = Main.model.getTakeResourcePreview(player.id, player.atGridId, market, resource);
		previewInfo.market = market;
		previewInfo.resource = resource;
		resourcePreviewView.showPopup(previewInfo);
	}

	@:bind(btn_transfer, MouseEvent.CLICK)
	function onBtnTransferClick(e:MouseEvent) {
		transferPreview.showPopup(null);
	}

	@:bind(btn_build, MouseEvent.CLICK)
	function onBtnBuildClick(e:MouseEvent) {
		buildingPreview.showPopup(null);
	}

	@:bind(btn_negotiate, MouseEvent.CLICK)
	function onBtnNegotiateClick(e:MouseEvent) {
		var player = Main.model.gameInfo().currentPlayer;
		var previewInfo = Main.model.getTakeNegoPreview(player.id, player.atGridId);
		switch (previewInfo) {
			case {p1ValidPeople: _.length < 1 => true}:
				Dialogs.messageBox('沒有武將可以執行', '主公啊…', MessageBoxType.TYPE_INFO);
			case {p2ValidPeople: _.length < 1 => true}:
				Dialogs.messageBox('對方沒有武將可以交涉', '主公啊…', MessageBoxType.TYPE_INFO);
			case _:
				negoPreviewView.showPopup(previewInfo);
		}
	}

	function takeWar() {
		takeSnatch(true);
	}

	@:bind(btn_occupation, MouseEvent.CLICK)
	function onBtnOccupationClick(e:MouseEvent) {
		takeWar();
	}

	function takeSnatch(isOccupation = false) {
		var player = Main.model.gameInfo().currentPlayer;
		var previewInfo = Main.model.getTakeSnatchPreview(player.id, player.atGridId);

		Reflect.setField(previewInfo, 'isOccupation', isOccupation);
		switch (previewInfo) {
			case {p1ValidPeople: _.length < 1 => true}:
				Dialogs.messageBox('沒有武將可以執行', '主公啊…', MessageBoxType.TYPE_INFO);
			case {p2ValidPeople: _.length < 1 => true}:
				Dialogs.messageBox('沒有武將可以占領', '主公啊…', MessageBoxType.TYPE_INFO);
			case {isP1ArmyValid: _ => false}
				| {isP2ArmyValid: _ => false}:
				if (!isOccupation) {
					Dialogs.messageBox('搶奪條件（雙方兵力至少都要有${SNATCH_ARMY_AT_LEAST}）不足，是否進入攻城模式', '主公啊…', MessageBoxType.TYPE_QUESTION, true, (target) -> {
						if (target == DialogButton.YES) {
							Reflect.setField(previewInfo, 'isOccupation', true);
							snatchPreviewView.showPopup(previewInfo);
						}
					});
				} else {
					snatchPreviewView.showPopup(previewInfo);
				}
			case _:
				snatchPreviewView.showPopup(previewInfo);
		}
	}

	@:bind(btn_snatch, MouseEvent.CLICK)
	function onBtnSnatchClick(e:MouseEvent) {
		takeSnatch();
	}

	@:bind(btn_explore, MouseEvent.CLICK)
	function onBtnExploreClick(e:MouseEvent) {
		var gameInfo = Main.model.gameInfo();
		var previewInfo = Main.model.getTakeExplorePreview(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId);
		if (previewInfo.p1ValidPeople.length < 1) {
			Dialogs.messageBox('沒有武將可以執行', '主公啊…', MessageBoxType.TYPE_WARNING);
			return;
		}
		explorePreviewView.showPopup(previewInfo);
	}

	@:bind(btn_hire, MouseEvent.CLICK)
	function onBtnHireClick(e:MouseEvent) {
		var gameInfo = Main.model.gameInfo();
		var previewInfo = Main.model.getTakeHirePreview(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId);
		if (previewInfo.p1ValidPeople.length < 1) {
			Dialogs.messageBox('沒有武將可以執行', '主公啊…', MessageBoxType.TYPE_WARNING);
			return;
		}
		if (previewInfo.p2ValidPeople.length < 1) {
			Dialogs.messageBox('主公啊…', '沒有武將可以聘用', MessageBoxType.TYPE_WARNING);
			return;
		} else {
			hirePreviewView.showPopup(previewInfo);
		}
	}

	@:bind(btn_start, MouseEvent.CLICK)
	function onBtnStartClick(e:MouseEvent) {
		Main.model.gameStart(() -> {
			for (index => player in Main.model.gameInfo().players) {
				if (index < players.length) {
					players[index].name = player.name.substr(0, 1);
				}
			}

			tab_whichInfo.onChange = function(e) {
				syncGameInfo(Main.model.gameInfo());
			}

			syncView();
		});
	}

	@:bind(btn_end, MouseEvent.CLICK)
	function onBtnEndClick(e:MouseEvent) {
		Main.model.playerEnd(syncView);
	}

	@:bind(btn_showTreasure, MouseEvent.CLICK)
	function onBtnShowTreasureClick(e:MouseEvent) {
		treasurePreviewView.showPopup(null);
	}

	@:bind(btn_showStrategy, MouseEvent.CLICK)
	function onBtnShowStrategyClick(e:MouseEvent) {
		final gameInfo = Main.model.gameInfo();
		if (gameInfo.currentPlayer.people.length == 0) {
			Dialogs.messageBox('沒有武將可以使用', '', MessageBoxType.TYPE_INFO);
			return;
		}
		strategyPreviewView.showPopup(null);
	}

	function getGridPositionByGridId(pid:Int, gridId:Int) {
		var grid = grids[gridId];
		return offsetPlayerPos(pid, grid.left, grid.top);
	}

	public function syncView() {
		var gameInfo = Main.model.gameInfo();

		// ui可以直接更新
		syncUI(gameInfo);

		// 播放同步前的所有動畫
		var tweens = [];
		playBeforeSync(gameInfo, tweens);

		tweens.push(TweenX.func(() -> {
			syncViewByInfo(gameInfo);
		}));

		TweenX.serial(tweens);

		trace('被沒收寶物的武將會扣一半的體力');
		trace('被打爆的城裡的所有寶物都歸打爆者所有，現在可以給佔領事件(最後給，因為玩家要操作)跟寶物一起給了。因為得到寶物前端不能立刻裝備了。');
	}

	function syncViewByInfo(gameInfo:GameInfo) {
		syncUI(gameInfo);
		syncGameInfo(gameInfo);
		syncGridViews(gameInfo);
		syncPlayerViews(gameInfo);
		playEvents(gameInfo);
	}

	function playBeforeSync(gameInfo:GameInfo, tweens:Array<TweenX>) {
		playActions(gameInfo.actions, tweens);
	}

	function playActions(actions:Array<ActionInfo>, tweens:Array<TweenX>) {
		for (id => action in actions) {
			switch (action.id) {
				case ActionInfoID.MOVE:
					var pv = players[action.value.playerId];
					var toPos = getGridPositionByGridId(action.value.playerId, action.value.toGridId);

					tweens.push(TweenX.to(pv, {"left": toPos[0], "top": toPos[1]}));
				case _:
			}
		}
	}

	function offsetPlayerPos(pid:Int, x:Float, y:Float) {
		var newPos = switch (pid) {
			case 0: [x, y + 40];
			case 1: [x + 20, y + 40];
			case 2: [x, y + 20 + 40];
			case 3: [x + 20, y + 20 + 40];
			case _: [x, y];
		}
		return newPos;
	}

	var events:Array<EventInfo>;

	function playEvents(gameInfo:GameInfo) {
		events = gameInfo.events;
		doOneEvent(gameInfo);
	}

	function doOneEvent(gameInfo:GameInfo) {
		if (events.length > 0) {
			var event = events.shift();
			switch (event.id) {
				case WALK_STOP:
				case FIND_TREASURE_RESULT:
					final info:Dynamic = event.value;
					final treasures:Array<TreasureCatelog> = info.treasures;
					var title = '發現寶物 ';
					for (t in treasures) {
						title += '${t.name} ';
					}

					Dialogs.messageBox(title, '發現寶物', MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

					// var msg = '${title}\n';
					// msg += '是否直接賜予武將?';
					// Dialogs.messageBox(msg, title, MessageBoxType.TYPE_QUESTION, true, (b) -> {
					// 	if (b == DialogButton.YES) {
					// 		onBtnShowTreasureClick(null);
					// 	}
					// });
				case GRID_BORN_EVENT:
					final info:Dynamic = event.value;
					final grid:Grid = info.grid;
					final title = '異軍突起';
					var msg = '${title}\n';
					msg += '地點:${grid.name}';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});
				case GRID_RESOURCE_EVENT:
					final gameInfo = Main.model.gameInfo();
					final info:Dynamic = event.value;
					final grids:Array<{gridBefore:Grid, gridAfter:Grid}> = info.grids;
					final title = info.describtion;
					var msg = '${title}\n\n';
					for (result in grids) {
						final before = result.gridBefore;
						final after = result.gridAfter;
						final owner = switch (before.belongPlayerId) {
							case null: '無';
							case _: gameInfo.players[before.belongPlayerId].name;
						}
						msg += '地點:${before.name}\n';
						msg += '所有:${owner}\n';
						msg += '金錢:${Main.getCompareString(before.money, after.money, 0)} \n';
						msg += '糧草:${Main.getCompareString(before.food, after.food, 0)} \n';
						msg += '士兵:${Main.getCompareString(before.army, after.army, 0)} \n';
						msg += '\n';
					}
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});
				case PK_RESULT:
					final info:Dynamic = event.value;
					final title = if (info.success) {
						'成功號召士兵';
					} else {
						'號召士兵失敗';
					}
					var msg = '武將:${info.people.name}\n';
					msg += '士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)} (${Main.getFixNumber(info.armyAfter - info.armyBefore, 0)})';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});
				case COST_FOR_BONUS_RESULT:
					final info:Dynamic = event.value;
					final title = switch (info.costType) {
						case 0: '札營完畢！ 武將們回復體力';
						case 1: '練兵完畢! 武將們提高功績';
						case 2: '作樂完畢！ 武將們回復體力';
						case _: '';
					}

					final pBefore:Array<People> = info.peopleBefore;
					var msg = '';
					for (index => peopleBefore in pBefore) {
						final peopleAfter = info.peopleAfter[index];
						final recoverType = switch (info.costType) {
							case 0 | 2: '體力';
							case 1: '功績';
							case _: '';
						};
						final recover = switch (info.costType) {
							case 0 | 2: Main.getFixNumber(peopleAfter.energy - peopleBefore.energy);
							case 1: Main.getFixNumber(peopleAfter.exp - peopleBefore.exp);
							case _: 0;
						};
						msg += '${peopleAfter.name} ${recoverType} 上升 ${recover}\n';
					}
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

				case HIRE_RESULT:
					final info:Dynamic = event.value;
					final title = info.success ? '雇用任務成功' : '雇用任務失敗';
					var msg = '武將:${info.people.name}\n';
					msg += '體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n';
					msg += '金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n';
					msg += '糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n';
					msg += '士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

				case FIRE_RESULT:
					final info:Dynamic = event.value;
					var people:Array<People> = info.people;
					var msg = '解雇:${people.map((p) -> p.name).join(',')}\n';
					msg += '薪俸:${Main.getFixNumber(info.maintainMoneyBefore, 2)} => ${Main.getFixNumber(info.maintainMoneyAfter, 2)}\n';

					Dialogs.messageBox(msg, '解雇完成', MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

				case NEGOTIATE_RESULT:
					final info:Dynamic = event.value;
					final title = info.success ? '交涉任務成功' : '交涉任務失敗';
					var msg = '武將:${info.people.name}\n';
					msg += '體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n';
					msg += '金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n';
					msg += '糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n';
					msg += '士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n';
					msg += '友好:${Main.getFavorString(info.favorBefore)} => ${Main.getFavorString(info.favorAfter)}\n';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

				case EXPLORE_RESULT:
					exploreSuccessView.showMessage(event.value);

				case WAR_RESULT:
					final info:Dynamic = event.value;
					var msg = '武將:${info.people.name}\n';
					msg += '體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n';
					msg += '金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n';
					msg += '糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n';
					msg += '士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n';
					if (info.success) {
						Dialogs.messageBox(msg, '占領成功', MessageBoxType.TYPE_INFO, true, (target) -> {
							transferPreview.showPopup(null);
						});
					} else {
						Dialogs.messageBox(msg, '占領失敗', MessageBoxType.TYPE_INFO, true, (b) -> {
							doOneEvent(gameInfo);
						});
					}

				case SNATCH_RESULT:
					final info:Dynamic = event.value;
					final title = info.success ? '搶奪成功' : '搶奪失敗';
					var msg = '武將:${info.people.name}\n';
					msg += '體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n';
					msg += '金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n';
					msg += '糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n';
					msg += '士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

				case RESOURCE_RESULT:
					final info:Dynamic = event.value;
					var msg = '武將:${info.people ? info.people.name : ""}\n';
					msg += '體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n';
					msg += '金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n';
					msg += '糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n';
					msg += '士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n';
					Dialogs.messageBox(msg, '交易完成', MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

				case STRATEGY_RESULT:
					final info:Dynamic = event.value;
					final title = info.success ? '計策成功' : '計策失敗';
					var msg = title;
					msg += '武將:${info.people ? info.people.name : ""}\n';
					msg += '計策:${info.strategy ? info.strategy.name : ""}\n';
					msg += '體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});
				case BUILDING_RESULT:
					final info:Dynamic = event.value;
					final catelog = Main.getBuildingCatelog(info.building);
					var msg = '武將:${info.people.name:""}\n';
					msg += '已擴建 ${catelog.name}\n';
					Dialogs.messageBox(msg, '擴建完畢', MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});
				case WORLD_EVENT:
					growView.showPopup(event.value, () -> {
						doOneEvent(gameInfo);
					});
				case PEOPLE_LEVEL_UP_EVENT:
					final info:Dynamic = event.value;
					final title = '功績到達，職位升等!';
					final p1:People = info.peopleBefore;
					final p2:People = info.peopleAfter;
					var msg = '將領:${p1.name}\n';
					msg += '職等:${PeopleGenerator.getInst().getPeopleTypeName(p1.type)} => ${PeopleGenerator.getInst().getPeopleTypeName(p2.type)}\n';
					switch (p2.type) {
						case WENGUAN(level):
							msg += '智力:${p1.intelligence} => ${p2.intelligence}\n';
							msg += '政治:${p1.political} => ${p2.political}\n';
						case WUJIANG(level):
							msg += '智力:${p1.force} => ${p2.force}\n';
							msg += '政治:${p1.command} => ${p2.command}\n';
						case _:
					}
					msg += '魅力:${p1.charm} => ${p2.charm}\n';
					msg += '體力:${p1.energy} => ${p2.energy}\n';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});

				case PAY_FOR_OVER_ENEMY_GRID:
					final info:Dynamic = event.value;
					final title = '走到其他主公的領地，過路費…';
					var msg = '走到其他主公的領地，過路費…\n';
					msg += '金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n';
					msg += '糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n';
					msg += '士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n';
					Dialogs.messageBox(msg, title, MessageBoxType.TYPE_INFO, true, (b) -> {
						doOneEvent(gameInfo);
					});
			}
		}
	}

	function disabledAllCommands() {
		btn_go.hide();
		btn_showTreasure.hide();
		btn_showStrategy.hide();
		btn_firePeople.hide();
		btn_negotiate.hide();
		btn_pk.hide();
		btn_snatch.hide();
		btn_occupation.hide();
		btn_hire.hide();
		btn_payForFun.hide();
		btn_camp.hide();
		btn_practice.hide();
		btn_explore.hide();
		btn_earnMoney.hide();
		btn_buyFood.hide();
		btn_sellFood.hide();
		btn_buyArmy.hide();
		btn_sellArmy.hide();
		btn_transfer.hide();
		btn_build.hide();
		btn_end.hide();
	}

	function moveCursorToGrid(gridId:Int) {
		var pos = getGridPositionByGridId(99, gridId);
		box_cursor.left = pos[0];
		box_cursor.top = pos[1];
	}

	function syncUI(gameInfo:GameInfo) {
		gameInfo.isPlaying ? btn_start.hide() : btn_start.show();

		disabledAllCommands();

		var currentPlayer = gameInfo.currentPlayer;
		for (cmd in currentPlayer.commands) {
			switch (cmd) {
				case MOVE:
					btn_go.show();
				case TREASURE:
					btn_showTreasure.show();
				case STRATEGY:
					btn_showStrategy.show();
				case FIRE:
					btn_firePeople.show();
				case NEGOTIATE:
					btn_negotiate.show();
				case PK:
					btn_pk.show();
				case SNATCH:
					btn_snatch.show();
				case OCCUPATION:
					btn_occupation.show();
				case HIRE:
					btn_hire.show();
				case EXPLORE:
					btn_explore.show();
				case PAY_FOR_FUN:
					btn_payForFun.show();
				case EARN_MONEY:
					btn_earnMoney.show();
				case BUY_FOOD:
					btn_buyFood.show();
				case SELL_FOOD:
					btn_sellFood.show();
				case BUY_ARMY:
					btn_buyArmy.show();
				case SELL_ARMY:
					btn_sellArmy.show();
				case TRANSFER:
					btn_transfer.show();
				case BUILD:
					btn_build.show();
				case END:
					btn_end.show();
				case CAMP:
					btn_camp.show();
				case PRACTICE:
					btn_practice.show();
			};
		}

		var pid = currentPlayer.id;
		syncPlayerInfo(pid);
		syncGameInfo(gameInfo);

		moveCursorToGrid(currentPlayer.atGridId);

		stage.unregisterEvents();
		if (gameInfo.isPlayerTurn) {
			stage.registerEvent(MouseEvent.MOUSE_MOVE, function(e:MouseEvent) {
				var gx = Math.floor(e.localX / gridSize);
				var gy = Math.floor(e.localY / gridSize);
				var gridId = gx + gy * 10;
				gridId = Math.floor(Math.min(gridId, gameInfo.grids.length - 1));
				moveCursorToGrid(gridId);
				syncGridInfo(gridId);
			});

			stage.registerEvent(MouseEvent.MOUSE_OUT, function(e:MouseEvent) {
				syncGridInfo(currentPlayer.atGridId);
				moveCursorToGrid(currentPlayer.atGridId);
			});
		}
	}

	function syncGameInfo(gameInfo:GameInfo) {
		final playerInfos = switch (tab_whichInfo.selectedIndex) {
			case 0: gameInfo.playerTotals;
			case 1: gameInfo.players;
			case 2: gameInfo.playerGrids;
			case _: throw new Exception("no type");
		}

		tab_allPlayers.dataSource.clear();
		for (p in playerInfos) {
			var info:Dynamic = Main.cloneObject(p);
			info.money = '${Main.getFixNumber(p.money, 0)} (${Main.getFixNumber(p.maintainPeople)})';
			info.food = '${Main.getFixNumber(p.food, 0)} (${Main.getFixNumber(p.maintainArmy)})';
			info.army = '${Main.getFixNumber(p.army, 0)} (${Main.getFixNumber(p.armyGrow)})';
			info.peopleCount = p.people.length;
			info.cityCount = p.grids.length;
			info.treasureCount = p.treasures.length;
			tab_allPlayers.dataSource.add(info);
		}
		lbl_gameInfo.value = '第${gameInfo.currentTurn + 1}回合，${gameInfo.currentPlayer.name}正在行動';
	}

	function syncPlayerInfo(id:Int) {
		var gameInfo = Main.model.gameInfo();
		var p = gameInfo.players[id];

		leaderView.setInfo(p);
		peopleListView.setPeopleList(p.people);

		syncGridInfo(gameInfo.players[id].atGridId);
	}

	function syncGridInfo(gridId:Int) {
		var gameInfo = Main.model.gameInfo();
		var grid:Grid = gameInfo.grids[gridId];
		gridView.setInfo(grid);

		gridPeopleListView.setPeopleList(grid.people);
	}

	function syncGridViews(gameInfo:GameInfo) {
		for (index => info in gameInfo.grids) {
			if (index < grids.length) {
				var grid = grids[index];
				grid.setInfo(info);
			}
		}
	}

	function syncPlayerViews(gameInfo:GameInfo) {
		for (index => playerInfo in gameInfo.players) {
			if (index < players.length) {
				var playerView = players[index];

				var pos = getGridPositionByGridId(playerInfo.id, playerInfo.atGridId);
				playerView.left = pos[0];
				playerView.top = pos[1];
			}
		}
	}

	public function onStrategyPreviewConfirmClick(peopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int) {
		Main.model.takeStrategy(peopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId, syncViewByInfo);
	}

	public function onBuildingPreviewConfirmClick(peopleId:Int, current:BUILDING, to:BUILDING) {
		final gameInfo = Main.model.gameInfo();
		Main.model.takeBuilding(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, peopleId, current, to, syncViewByInfo);
	}

	public function onCostForBonusConfirmClick(pId:Int, costType:Int) {
		final gameInfo = Main.model.gameInfo();
		Main.model.takeCostForBonus(gameInfo.currentPlayer.id, pId, costType, syncViewByInfo);
	}

	public function onPkPreviewConfirmNegoClick(p1PeopleId:Int, p2PeopleId:Int) {
		final gameInfo = Main.model.gameInfo();
		Main.model.takePk(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1PeopleId, p2PeopleId, syncViewByInfo);
	}
}
