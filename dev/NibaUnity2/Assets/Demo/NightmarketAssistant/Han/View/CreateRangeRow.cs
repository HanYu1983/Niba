using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class CreateRangeRow : MonoBehaviour
    {
        public StorageComponent model;
        public BoothRef boothRef;
        public GameObject rowLayout, rowLayoutIsProgressing;
        public List<GameObject> rows;

        void Start()
        {
            OnEnable();
        }

        void OnDestroy()
        {
            OnDisable();
        }

        private void OnEnable()
        {
            boothRef.OnValueChange += UpdateView;
            NMAEvent.OnEarnListChange += UpdateView;
            UpdateView();
        }

        private void OnDisable()
        {
            boothRef.OnValueChange -= UpdateView;
            NMAEvent.OnEarnListChange -= UpdateView;
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

            if(boothRef.IsValid == false)
            {
                return;
            }

            var ranges = model.GroupEarns(boothRef.Ref.Key);
            for (var i = 0; i < ranges.Count; ++i)
            {
                var range = ranges[i];
                var layout = range.IsProgressing ? rowLayoutIsProgressing : rowLayout;
                var row = Instantiate(layout, transform, false);
                var objRef = row.GetComponent<EarnsInRangeRef>();
                if(objRef == null)
                {
                    Debug.LogWarning("EarnsInRangeRef not found");
                    continue;
                }
                objRef.refType = ObjectRefType.Array;
                objRef.array = ranges;
                objRef.idx = i;
                row.SetActive(true);
                rows.Add(row);
            }
        }
    }
}