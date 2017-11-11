using Common;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;

namespace GameView
{
    public class WorkPanel : MonoBehaviour
    {
        public ScrollRect SrollView;
        public GameObject workItemPrefab;
        
        List<WorkItem> WorkItems = new List<WorkItem>();

        public void UpdateContent()
        {
            IModelGetter model = View.Instance.Model;
            var works = model.Works;
            var workcount = works.Count();
            SetContentHeight(workcount);
            for (int i = 0; i < WorkItems.Count; ++i)
            {
                WorkItem workitem = WorkItems[i];
                workitem.gameObject.SetActive(i < workcount);
                if (i < workcount)
                {
                    Description workModel = works.ElementAt(i);
                    workitem.WorkModel = workModel;
                }
            }
        }

        void SetContentHeight( int workCount )
        {
            Vector2 size = SrollView.content.GetComponent<RectTransform>().sizeDelta;
            size.y = workCount * 100;
            SrollView.content.GetComponent<RectTransform>().sizeDelta = size;
        }

        void Start()
        {
            for(int i = 0; i < 10; ++i)
            {
                GameObject workitem = Instantiate(workItemPrefab);
                workitem.transform.SetParent(SrollView.content.transform);
                workitem.GetComponent<RectTransform>().localPosition = new Vector3();
                workitem.GetComponent<RectTransform>().localScale = new Vector3(1,1,1);
                WorkItems.Add(workitem.GetComponent<WorkItem>());
            }
        }
    }
}