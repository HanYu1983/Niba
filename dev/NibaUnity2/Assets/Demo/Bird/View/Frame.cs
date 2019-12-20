using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Bird
{
    public class Frame : MonoBehaviour
    {
        public float y1, y2;
        public float xwidth;

        public Transform upperTrans, lowerTrans;
        public Transform upperHori, lowerHori;

        [ContextMenu("UpdateView")]
        public void UpdateView()
        {
            var s = upperTrans.localScale;
            s.y = -y1;
            upperTrans.localScale = s;

            s = lowerTrans.localScale;
            s.y = (10-y2);
            lowerTrans.localScale = s;

            s = upperHori.localScale;
            s.x = xwidth*2;
            upperHori.localScale = s;

            s = lowerHori.localScale;
            s.x = xwidth*2;
            lowerHori.localScale = s;
        }
    }
}