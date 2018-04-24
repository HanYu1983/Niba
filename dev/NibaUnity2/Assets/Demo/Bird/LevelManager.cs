using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace Bird
{
    public class LevelManager : MonoBehaviour
    {
        public Transform frameRoot;
        public GameObject framePrefab;
        // 以下為除錯顯示用
        public List<GameObject> frames;
        public float currX;
        // 計算得分用
        public List<float> framesX;

        // 產生障礙最後的位置, 可以用來判斷自動生成
        public float CurrX { get { return currX; } }
        
        // 指定位置的分數
        public int Score(float x)
        {
            return framesX.Where(cx => cx < x).Count();
        }

        // 清除暫存值
        // 重新遊戲時要呼叫
        public void Clear()
        {
            ClearFrameBelow(float.MaxValue);
            framesX.Clear();
            currX = 0;
        }
        // 刪除X以下的障礙, 以防記憶體不足
        public void ClearFrameBelow(float x)
        {
            var below = frames.Where(obj =>
            {
                return obj.transform.localPosition.x < x;
            }).ToList();

            foreach(var b in below)
            {
                frames.Remove(b);
                Destroy(b);
            }
        }

        // 生成障礙
        public void Create(int xlength, int count, int y1, int y2)
        {
            var fw = xlength / count;
            for(var i=0; i<count; ++i)
            {
                var frame = Instantiate(framePrefab, frameRoot, false);
                // 設定障礙長度
                var f = frame.GetComponent<Frame>();
                if(f == null)
                {
                    throw new System.Exception("frame not set");
                }
                f.y1 = y1;
                f.y2 = y2;
                f.xwidth = fw;
                f.UpdateView();
                // 設定障礙位置
                var pos = frame.transform.localPosition;
                var frameX = currX + fw * i;
                pos.x = frameX;
                frame.transform.localPosition = pos;

                frames.Add(frame);
                framesX.Add(frameX);
            }
            currX += xlength;
        }

        [ContextMenu("TestCreate")]
        public void TestCreate()
        {
            Create(10, 5, 2, 4);
            Create(20, 3, 7, 8);
        }
    }
}