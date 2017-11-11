using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System.Collections.Generic;

namespace GameView
{
    public class BasicPanel : MonoBehaviour
    {
        public ScrollRect SrollView;
        public GameObject ItemPrefab;

        internal List<GameObject> WorkItems = new List<GameObject>();

        public virtual void UpdateContent()
        {
            
        }

        internal void SetContentHeight(int workCount)
        {
            Vector2 size = SrollView.content.GetComponent<RectTransform>().sizeDelta;
            size.y = workCount * 100;
            SrollView.content.GetComponent<RectTransform>().sizeDelta = size;
        }

        void Start()
        {
            for (int i = 0; i < 10; ++i)
            {
                GameObject workitem = Instantiate(ItemPrefab);
                workitem.transform.SetParent(SrollView.content.transform);
                workitem.GetComponent<RectTransform>().localPosition = new Vector3();
                workitem.GetComponent<RectTransform>().localScale = new Vector3(1, 1, 1);
                WorkItems.Add(workitem);
            }
        }
    }
}
