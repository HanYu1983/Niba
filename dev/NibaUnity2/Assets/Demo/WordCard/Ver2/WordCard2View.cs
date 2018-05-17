using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Poke = HanCardAPI.Poke;
using CardCore = HanCardAPI.Core;

namespace WordCard
{
    public class WordCard2View : MonoBehaviour, IInjectWordCard2ClientModel, IInjectWordCard2Controller
    {
        void Start()
        {
            WordCard2Injector.Inject(this);
        }

        public void Show(Poke.Context ctx)
        {
            Debug.Log("show context");
        }

        public void ShowMission(List<CardCore.Mission> mis)
        {
            Debug.Log("show mission");
            this.storeMissions = mis;
        }

        public Font font;
        List<CardCore.Mission> storeMissions;
        private void OnGUI()
        {
            if(ClientModel.ctx.table.stacks.Count == 0)
            {
                return;
            }

            GUI.skin.font = font;

            GUILayout.BeginArea(new Rect(100, 0, 500, 800));
            GUILayout.Label("currPlayer:" + ClientModel.ctx.currPlayer);
            GUILayout.Label("=== mission ===");
            if (storeMissions != null)
            {
                foreach (var m in storeMissions)
                {
                    if (GUILayout.Button(m.description))
                    {
                        WordCard2Injector.OnSelectMission(m);
                    }
                }
            }
            GUILayout.Label("=== hand ===");
            foreach (var cid in ClientModel.ctx.table.stacks[ClientModel.ctx.playerHandStack[Controller.Client.Player]].cards)
            {
                var c = ClientModel.ctx.table.cards[cid];
                if (GUILayout.Button(c.prototype))
                {
                    WordCard2Injector.OnSelectCard(c);
                }
            }
            GUILayout.Label("=== sea ===");
            foreach (var cid in ClientModel.ctx.table.stacks[ClientModel.ctx.seaStack].cards)
            {
                var c = ClientModel.ctx.table.cards[cid];
                if (GUILayout.Button(c.prototype))
                {
                    WordCard2Injector.OnSelectCard2(c);
                }
            }
            /*
            if (selectMis.Equals(CardAPI.Mission.Empty) == false)
            {
                if (selectMis.IsReady)
                {
                    if (GUILayout.Button("確認:" + selectMis.description))
                    {
                        CmdPushMission(selectMis);
                        selectMis = CardAPI.Mission.Empty;
                    }
                }
                else
                {
                    GUILayout.Label("玩家思考中:" + selectMis.description);
                }

                if (selectMis.Equals(CardAPI.Mission.Empty) == false)
                {
                    foreach (var g in selectMis.Goals)
                    {
                        GUILayout.Label(string.Format("[{0}]{1}", g == selectMis.Goals[selectMis.currGoal] ? "*" : "", g.text));
                    }
                }
            }
            else
            {
                GUILayout.Label("請選擇一個任務");
            }

            GUILayout.Label("=== hand ===");
            if (true){storeCards != null)
            {
                foreach (var cid in storeCards)
                {
                    var c = model.ctx.table.cards[cid];
                    var cfg = ConfigCard.Get(c.prototype);
                    if (GUILayout.Button(cfg.Name))
                    {
                        onSelectCard1(c.Key);
                    }
                }

            }

            GUILayout.Label("=== sea ===");
            if (GUILayout.Button("海底"))
            {
                onSelectCard2(-1);
            }
            foreach (var cid in model.ctx.table.stacks[model.ctx.seaStack].cards)
            {
                var c = model.ctx.table.cards[cid];
                var cfg = ConfigCard.Get(c.prototype);
                if (GUILayout.Button(cfg.Name + "[" + cfg.Description + "]"))
                {
                    onSelectCard2(c.Key);
                }
            }

            GUILayout.Label("=== animate ===");
            foreach (var s in animateList)
            {
                GUILayout.Label(s);
            }
            */
            GUILayout.EndArea();
        }

        public WordCard2Model ClientModel { get; set; }
        public IWordCard2Controller Controller { get; set; }
    }
}