using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
    // 用來計算暫時資料的狀態, 可以顯示讀取圖示
    // 這個狀態結束後自動切回UpdateCTState
    // 每次有改變單位位置或新增單位都要切換成這個狀態
    public class SystemState : DefaultControlState
    {
        public override void OnUpdate(float t)
        {
            View.StartCoroutine(Compute());
        }
        public override void OnEnterState()
        {
            Model.RequestSaveMap();
        }
        IEnumerator Compute()
        {
            yield return 0;
            // 計算火力移動消費
            var dict = new HashSet<int>();
            foreach (var p in Model.mapCtx.players)
            {
                dict.Add(p.team);
            }
            foreach (var team in dict)
            {
                DataAlg.CalcFileCost(Model.mapCtx, team);
                yield return 0;
            }
            Holder.ChangeState(new UpdateCTState());
        }
    }
}