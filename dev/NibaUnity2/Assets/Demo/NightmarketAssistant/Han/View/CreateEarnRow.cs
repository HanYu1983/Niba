using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace NightmarketAssistant
{
    public class CreateEarnRow : MonoBehaviour, INeedModel
    {
        public BoothRef boothRef;
        public GameObject rowLayout;
        public List<GameObject> rows;

        void Start()
        {
            NMAEvent.OnComponentStart(this);
            NMAEvent.OnEarnListChange += UpdateView;
        }

        void OnDestroy()
        {
            NMAEvent.OnComponentDestroy(this);
            NMAEvent.OnEarnListChange -= UpdateView;
        }

        private void OnEnable()
        {
            // 這時可能model還沒注入
            if (model == null)
            {
                return;
            }
            UpdateView();
        }

        IModelGetter model;
        public IModelGetter IModel
        {
            get { return model; }
            set
            {
                this.model = value;
                UpdateView();
            }
        }

        void UpdateView()
        {
            if (rowLayout == null)
            {
                Debug.LogWarning("row layout not found");
                return;
            }

            foreach (var r in rows)
            {
                Destroy(r);
            }
            rows.Clear();

            if (boothRef.IsValid == false)
            {
                return;
            }

            var booth = boothRef.Ref;
            var bs = model.GetBoothStateByBooth(booth.Key);
            if(bs == null)
            {
                Debug.LogWarning("開市資料已被刪除:無法CreateEarnRow");
                return;
            }
            var earns = model.GetEarn(booth.Key, new DateTime(bs.date));

            for (var i = 0; i < earns.Count; ++i)
            {
                var layout = rowLayout;
                var row = Instantiate(layout, transform, false);
                var objRef = row.GetComponent<EarnRef>();
                if (objRef == null)
                {
                    Debug.LogWarning("EarnRef not found");
                    continue;
                }
                objRef.refType = ObjectRefType.Array;
                objRef.array = earns;
                objRef.idx = i;
                row.SetActive(true);
                rows.Add(row);
            }
        }
    }
}
