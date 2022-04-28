package view;

// import model.ModelVer2.ENERGY_COST_ON_SNATCH;
// import model.ModelVer2.ENERGY_COST_ON_NEGO;
// import model.ModelVer2.ENERGY_COST_ON_WAR;
// import model.ModelVer2.ENERGY_COST_ON_RESOURCE;
// import model.ModelVer2.ENERGY_COST_ON_HIRE;
// import model.ModelVer2.ENERGY_COST_ON_EXPLORE;
import model.ver2.Config;
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
import view.popup.MessageView;
import view.popup.NegoPreviewView;
import view.popup.WarPreviewView;
import view.popup.SnatchPreviewView;
import model.GridGenerator.BUILDING;
import haxe.ui.components.OptionBox;
import haxe.ui.containers.Absolute;
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
class MainView extends Absolute {
	var grids:Array<GridView> = [];
	var players:Array<PlayerView> = [];
	var leaderView:LeaderGridView;
	var gridView:GridGridView;
	var peopleListView:PeopleListView;
	var gridPeopleListView:PeopleListView;
	var warPreviewView:WarPreviewView;
	var snatchPreviewView:SnatchPreviewView;
	var negoPreviewView:NegoPreviewView;
	var messageView:MessageView;
	var hirePreviewView:HirePreviewView;
	var explorePreviewView:ExplorePreviewView;
	var exploreSuccessView:ExploreSuccessView;
	var resourcePreviewView:ResourcePreviewView;
	var firePreviewView:FirePreviewView;
	var transferPreview:TransferPreview;
	var growView:GrowView;

	var gridSize = 80;

	public function new() {
		super();

		for (i in 0...30) {
			var grid = new GridView();
			box_grids.addComponent(grid);
			grids.push(grid);
		}

		for (i in 0...4) {
			var p = new PlayerView(25, 25);
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

		messageView = new MessageView();
		messageView.hide();
		box_popup.addComponent(messageView);

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

		growView = new GrowView();
		growView.hide();
		box_popup.addComponent(growView);

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

	public function onFirePreviewViewConfirmClick(pId:Int) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeFire(gameInfo.currentPlayer.id, pId, syncViewByInfo);
	}

	public function onWarPreviewConfirmClick(p1Id:Int, p2Id:Int, p1Army:Float, p2Army:Float) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeWarOn(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, p2Id, p1Army, p2Army, syncViewByInfo);
	}

	public function onSnatchPreviewConfirmClick(p1Id:Int, p2Id:Int) {
		var gameInfo = Main.model.gameInfo();
		Main.model.takeSnatchOn(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId, p1Id, p2Id, syncViewByInfo);
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
			grid.name = index + "";
			grid.left = (index % 10) * gridSize;
			grid.top = Math.floor(index / 10) * gridSize;
		}
		box_npcCmds.hide();
		box_enemyCmds.hide();

		btn_negotiate.text = '${btn_negotiate.text}(${ENERGY_COST_ON_NEGO})';
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

	@:bind(btn_go, MouseEvent.CLICK)
	function onBtnGoClick(e:MouseEvent) {
		Main.model.playerDice(syncView);

		box_npcCmds.hide();
		box_enemyCmds.hide();
	}

	@:bind(btn_assignPeople, MouseEvent.CLICK)
	function onBtnAssignPeopleClick(e:MouseEvent) {
		final p = peopleListView.selectedItem;
		if (p) {}
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
			messageView.showMessage('你沒有足夠的金錢哦!');
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
			messageView.showMessage('你沒有足夠的金錢哦!');
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
			messageView.showMessage('你沒有足夠的糧食哦!');
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
			messageView.showMessage('你沒有足夠的士兵哦!');
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

	@:bind(btn_negotiate, MouseEvent.CLICK)
	function onBtnNegotiateClick(e:MouseEvent) {
		var player = Main.model.gameInfo().currentPlayer;
		var previewInfo = Main.model.getTakeNegoPreview(player.id, player.atGridId);
		negoPreviewView.showPopup(previewInfo);
	}

	function takeWar() {
		var player = Main.model.gameInfo().currentPlayer;
		var previewInfo = Main.model.getTakeWarPreview(player.id, player.atGridId);
		if (previewInfo.p1ValidPeople.length < 1) {
			messageView.showMessage('沒有武將可以執行');
			return;
		}
		if (previewInfo.p2ValidPeople.length < 1) {
			messageView.showMessage('沒有武將可以占領');
			return;
		} else {
			warPreviewView.showPopup(previewInfo);
		}
	}

	@:bind(btn_occupationPlayer, MouseEvent.CLICK)
	function onBtnOccupationPlayerClick(e:MouseEvent) {
		takeWar();
	}

	@:bind(btn_occupation, MouseEvent.CLICK)
	function onBtnOccupationClick(e:MouseEvent) {
		takeWar();
	}

	function takeSnatch() {
		var player = Main.model.gameInfo().currentPlayer;
		var previewInfo = Main.model.getTakeSnatchPreview(player.id, player.atGridId);
		switch (previewInfo) {
			case {p1ValidPeople: _.length < 1 => true}:
				messageView.showMessage('沒有武將可以執行');
			case {p2ValidPeople: _.length < 1 => true}:
				messageView.showMessage('沒有武將可以占領');
			case {isP1ArmyValid: _ => false}:
				messageView.showMessage('主公兵力不足100');
			case {isP2ArmyValid: _ => false}:
				messageView.showMessage('攻擊地點兵力不足100');
			case _:
				snatchPreviewView.showPopup(previewInfo);
		}
	}

	@:bind(btn_snatchPlayer, MouseEvent.CLICK)
	function onBtnSnatchPlayerClick(e:MouseEvent) {
		takeSnatch();
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
			messageView.showMessage('沒有武將可以執行');
			return;
		}
		explorePreviewView.showPopup(previewInfo);
	}

	@:bind(btn_hire, MouseEvent.CLICK)
	function onBtnHireClick(e:MouseEvent) {
		var gameInfo = Main.model.gameInfo();
		var previewInfo = Main.model.getTakeHirePreview(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId);
		if (previewInfo.p1ValidPeople.length < 1) {
			messageView.showMessage('沒有武將可以執行');
			return;
		}
		if (previewInfo.p2ValidPeople.length < 1) {
			messageView.showMessage('沒有武將可以聘用');
			return;
		} else {
			hirePreviewView.showPopup(previewInfo);
		}
	}

	@:bind(btn_start, MouseEvent.CLICK)
	function onBtnStartClick(e:MouseEvent) {
		Main.model.gameStart(() -> {
			for (index => player in Main.model.gameInfo().players) {
				players[index].name = player.name;
			}
			syncView();
		});
	}

	@:bind(btn_end, MouseEvent.CLICK)
	function onBtnEndClick(e:MouseEvent) {
		Main.model.playerEnd(syncView);
	}

	@:bind(opt_p1, MouseEvent.CLICK)
	function onBtnShowP1Click(e:MouseEvent) {
		syncPlayerInfo(0);
	}

	@:bind(opt_p2, MouseEvent.CLICK)
	function onBtnShowP2Click(e:MouseEvent) {
		syncPlayerInfo(1);
	}

	@:bind(opt_p3, MouseEvent.CLICK)
	function onBtnShowP3Click(e:MouseEvent) {
		syncPlayerInfo(2);
	}

	@:bind(opt_p4, MouseEvent.CLICK)
	function onBtnShowP4Click(e:MouseEvent) {
		syncPlayerInfo(3);
	}

	@:bind(btn_showStrategy, MouseEvent.CLICK)
	function onBtnShowStrategyClick(e:MouseEvent) {}

	// @:bind(btn_smallWar, MouseEvent.CLICK)
	// function onBtnWarClick(e:MouseEvent){
	//     var player = Main.model.gameInfo().currentPlayer;
	//     var previewInfo = Main.model.getTakeWarPreview(player.id, player.atGridId);
	//     // warPreviewView.showPreviewWar(previewInfo);
	// }

	@:bind(btn_warStrategy, MouseEvent.CLICK)
	function onBtnWarStrategyClick(e:MouseEvent) {}

	// @:bind(btn_give, MouseEvent.CLICK)
	// function onBtnGiveClick(e:MouseEvent){
	// }

	function getGridPositionByGridId(pid:Int, gridId:Int) {
		var grid = grids[gridId];
		return offsetPlayerPos(pid, grid.left, grid.top);
	}

	function syncView() {
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

		trace('經商，買賣糧食，買賣士兵，不能拿超過格子本身的一半');
		trace('目前聘用的後端如果金錢不夠沒有防呆，我前段先防了');
		trace('野戰的時候，敵人要調成沒有防守加成');
		trace('nego的result事件也要給favorBefore, favorAfter');
	}

	function syncViewByInfo(gameInfo:GameInfo) {
		syncUI(gameInfo);
		// syncGameInfo(gameInfo);
		syncGridViews(gameInfo);
		syncPlayerViews(gameInfo);
		playEvents(gameInfo);
	}

	function playBeforeSync(gameInfo:GameInfo, tweens:Array<TweenX>) {
		playActions(gameInfo.actions, tweens);
	}

	function playActions(actions:Array<ActionInfo>, tweens:Array<TweenX>) {
		for (id => action in actions) {
			// setActionInfo(action);
			switch (action.id) {
				case ActionInfoID.MOVE:
					var pv = players[action.value.playerId];
					var toPos = getGridPositionByGridId(action.value.playerId, action.value.toGridId);

					tweens.push(TweenX.to(pv, {"left": toPos[0], "top": toPos[1]}));
			}
		}
	}

	function offsetPlayerPos(pid:Int, x:Float, y:Float) {
		var newPos = switch (pid) {
			case 0: [x, y];
			case 1: [x + 25, y];
			case 2: [x, y + 25];
			case 3: [x + 25, y + 25];
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
			disabledAllCommands();

			var event = events.shift();
			// setEventInfo(event);
			switch (event.id) {
				case WALK_STOP:
					var g:Grid = event.value.grid;
					if (g.buildtype == BUILDING.EMPTY) {
						box_emptyCmds.show();
					} else {
						if (g.belongPlayerId == null) {
							box_npcCmds.show();

							switch (g) {
								case {
									buildtype: CITY,
									favor: _[gameInfo.currentPlayer.id] >= 2 => true
								}:
									box_moneyCmds.show();
									box_foodCmds.show();
									box_armyCmds.show();
								case {
									buildtype: MARKET,
									favor: _[gameInfo.currentPlayer.id] >= 1 => true
								}:
									box_moneyCmds.show();
								case {
									buildtype: FARM,
									favor: _[gameInfo.currentPlayer.id] >= 1 => true
								}:
									box_foodCmds.show();
								case {
									buildtype: VILLAGE,
									favor: _[gameInfo.currentPlayer.id] >= 1 => true
								}:
									box_armyCmds.show();
								case _:
							}
						} else {
							if (g.belongPlayerId == gameInfo.currentPlayer.id) {
								box_myAreaCmds.show();
							} else {
								box_enemyCmds.show();
							}
						}
					}
					btn_end.show();
				case HIRE_RESULT:
					final info:Dynamic = event.value;
					final msg = '${info.success ? '雇用任務成功' : '雇用任務失敗'}\n
武將:${info.people.name}\n
體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n
金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n
糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n
士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n
                    ';
					messageView.showMessage(msg);
					btn_end.show();
				case FIRE_RESULT:
					final info:Dynamic = event.value;
					final msg = '解雇完成\n
武將:${info.people.name}\n
薪俸:${Main.getFixNumber(info.maintainMoneyBefore, 2)} => ${Main.getFixNumber(info.maintainMoneyAfter, 2)}\n
                    ';
					messageView.showMessage(msg);
					box_basicCmds.show();
				case NEGOTIATE_RESULT:
					final info:Dynamic = event.value;
					final msg = '${info.success ? '任務成功' : '任務失敗'}\n
武將:${info.people.name}\n
體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n
金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n
糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n
士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n
友好:${Main.getFavorString(info.favorBefore)} => ${Main.getFavorString(info.favorAfter)}\n
                    ';
					messageView.showMessage(msg);
					btn_end.show();
				case EXPLORE_RESULT:
					exploreSuccessView.showMessage(event.value);
					btn_end.show();
				case WAR_RESULT:
					final info:Dynamic = event.value;
					final msg = '${info.success ? '占領成功' : '攻城失敗'}\n
武將:${info.people.name}\n
體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n
金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n
糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n
士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n
                    ';
					if (info.success) {
						messageView.showMessage(msg, null, () -> {
							transferPreview.showPopup(null);
						});
					} else {
						messageView.showMessage(msg);
					}
					btn_end.show();
				case SNATCH_RESULT:
					final info:Dynamic = event.value;
					final msg = '${info.success ? '搶奪成功' : '搶奪失敗'}\n
武將:${info.people.name}\n
體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n
金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n
糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n
士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n
                    ';
					messageView.showMessage(msg);
					btn_end.show();
				case RESOURCE_RESULT:
					final info:Dynamic = event.value;

					final msg = '任務完成\n
武將:${info.people ? info.people.name : ""}\n
體力:${Main.getFixNumber(info.energyBefore, 0)} => ${Main.getFixNumber(info.energyAfter, 0)}\n
金錢:${Main.getFixNumber(info.moneyBefore, 0)} => ${Main.getFixNumber(info.moneyAfter, 0)}\n
糧草:${Main.getFixNumber(info.foodBefore, 0)} => ${Main.getFixNumber(info.foodAfter, 0)}\n
士兵:${Main.getFixNumber(info.armyBefore, 0)} => ${Main.getFixNumber(info.armyAfter, 0)}\n
                    ';
					messageView.showMessage(msg);
					btn_end.show();
				case WORLD_EVENT:
					growView.showPopup(event.value);
					box_basicCmds.show();
			}
		}
	}

	// function setEventInfo(event:EventInfo){
	//     switch(event.id){
	//         case FIRE_RESULT:
	//         case HIRE_RESULT:
	//             pro_currentEvent.value = "探索停止。等待指令中";
	//         case EXPLORE_RESULT:
	//             pro_currentEvent.value = "聘用停止。等待指令中";
	//         case WALK_STOP:
	//             pro_currentEvent.value = "行走停止。等待指令中";
	//         case WAR_RESULT:
	//             pro_currentEvent.value = "戰爭結果。等待指令中";
	//         case NEGOTIATE_RESULT:
	//             pro_currentEvent.value = "交涉結果。等待指令中";
	//         case RESOURCE_RESULT:
	//         case WORLD_EVENT:
	//     };
	// }
	// function setActionInfo(action:ActionInfo) {
	//     switch (action.id){
	//         case MOVE:
	//             pro_currentEvent.value = '由${action.value.fromGridId}往${action.value.toGridId}行走中...';
	//     }
	// }
	// function syncActions(gameInfo:GameInfo) {
	//     var tweens = [];
	//     for(id => action in gameInfo.actions){
	//         function getInfo(_gameInfo:GameInfo){
	//             return _gameInfo;
	//         }
	//         tweens.push(TweenX.func(()->{syncViewByInfo(getInfo(action.gameInfo));}).delay(2));
	//     }
	//     if(tweens.length > 0) {
	//         TweenX.serial(tweens);
	//     }
	// }

	function disabledAllCommands() {
		box_basicCmds.hide();
		box_npcCmds.hide();
		box_enemyCmds.hide();
		box_emptyCmds.hide();
		btn_end.hide();
		box_moneyCmds.hide();
		box_foodCmds.hide();
		box_armyCmds.hide();
		box_myAreaCmds.hide();
	}

	function moveCursorToGrid(gridId:Int) {
		var pos = getGridPositionByGridId(99, gridId);
		box_cursor.left = pos[0];
		box_cursor.top = pos[1];
	}

	function syncUI(gameInfo:GameInfo) {
		gameInfo.isPlaying ? btn_start.hide() : btn_start.show();
		disabledAllCommands();
		gameInfo.isPlayerTurn ? box_basicCmds.show() : box_basicCmds.hide();

		var pid = gameInfo.currentPlayer.id;
		var opt_p:OptionBox = Reflect.field(this, 'opt_p${pid + 1}');
		opt_p.selected = true;

		moveCursorToGrid(gameInfo.currentPlayer.atGridId);

		stage.unregisterEvents();
		if (gameInfo.isPlayerTurn) {
			// pro_currentEvent.value = "等待指令中";

			stage.registerEvent(MouseEvent.MOUSE_MOVE, function(e:MouseEvent) {
				var gx = Math.floor(e.screenX / gridSize);
				var gy = Math.floor(e.screenY / gridSize);
				var gridId = gx + gy * 10;
				gridId = Math.floor(Math.min(gridId, gameInfo.grids.length - 1));
				moveCursorToGrid(gridId);
				syncGridInfo(gridId);
			});

			stage.registerEvent(MouseEvent.MOUSE_OUT, function(e:MouseEvent) {
				syncGridInfo(gameInfo.currentPlayer.atGridId);
				// peopleListView.setPeopleList(gameInfo.currentPlayer.people);
				// gridPeopleListView.dataSource.clear();

				moveCursorToGrid(gameInfo.currentPlayer.atGridId);
			});
		}
		syncPlayerInfo(pid);
	}

	function syncPlayerInfo(id:Int) {
		var gameInfo = Main.model.gameInfo();
		var p = gameInfo.players[id];

		leaderView.setInfo(p);
		peopleListView.setPeopleList(p.people);

		syncGridInfo(gameInfo.players[id].atGridId);

		if (p.id == gameInfo.currentPlayer.id) {
			box_basicCmds.show();
		} else {
			box_basicCmds.hide();
		}
	}

	function syncGridInfo(gridId:Int) {
		var gameInfo = Main.model.gameInfo();
		var grid:Grid = gameInfo.grids[gridId];
		gridView.setInfo(grid);

		gridPeopleListView.setPeopleList(grid.people);
	}

	function syncGridViews(gameInfo:GameInfo) {
		for (index => info in gameInfo.grids) {
			var grid = grids[index];
			grid.type = info.landType;
			grid.building = info.buildtype;
			grid.playerId = info.belongPlayerId == null ? -1 : info.belongPlayerId;
			grid.setInfo(info);
		}
	}

	function syncPlayerViews(gameInfo:GameInfo) {
		for (index => playerInfo in gameInfo.players) {
			var playerView = players[index];

			var pos = getGridPositionByGridId(playerInfo.id, playerInfo.atGridId);
			playerView.left = pos[0];
			playerView.top = pos[1];
		}
	}

	// function syncGameInfo(gameInfo:GameInfo){
	//     pro_currentPlayer.value = gameInfo.currentPlayer.name;
	// }
}
