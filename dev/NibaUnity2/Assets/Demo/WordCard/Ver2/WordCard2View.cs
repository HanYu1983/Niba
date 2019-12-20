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

        List<string> wordOptions = new List<string>();
        public void ShowWordOption(int cardKey)
        {
            var c = ClientModel.ctx.table.cards[cardKey];
            var en = WordCard2Controller.GetWord(c.prototype);
            var ch = ConfigEn2Ch.Get(en).name;

            Debug.Log("ShowWordOption");
            wordOptions.Clear();
            wordOptions.Add(ch);
            wordOptions.Add("1");
            wordOptions.Add("2");
            wordOptions.Add("3");
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
                var shape = Poke.Alg.GetPrototype(c.prototype);
                var en = WordCard2Controller.GetWord(c.prototype);
                if (GUILayout.Button(c.Key + ":" + shape.shape+":"+shape.number+":"+en))
                {
                    WordCard2Injector.OnSelectCard(c);
                }
            }
            GUILayout.Label("=== sea ===");
            foreach (var cid in ClientModel.ctx.table.stacks[ClientModel.ctx.seaStack].cards)
            {
                var c = ClientModel.ctx.table.cards[cid];
                var shape = Poke.Alg.GetPrototype(c.prototype);
                var en = WordCard2Controller.GetWord(c.prototype);
                if (GUILayout.Button(c.Key+":"+shape.shape + ":" + shape.number + ":" + en))
                {
                    WordCard2Injector.OnSelectCard2(c);
                }
            }
            GUILayout.Label("=== word ===");
            foreach(var w in wordOptions)
            {
                if (GUILayout.Button(w))
                {
                    WordCard2Injector.OnSelectWord(w);
                }
            }
            GUILayout.EndArea();
        }

        public WordCard2Model ClientModel { get; set; }
        public IWordCard2Controller Controller { get; set; }
    }
}