using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Linq;

namespace NightmarketAssistant
{
    public class CreateEarnRow : MonoBehaviour
    {
        public StorageComponent model;
        public EarnsInRangeRef earnsInRangeSelection;
        public GameObject rowLayout;
        public List<GameObject> rows;

        void Start()
        {
            UpdateView();
        }

        private void OnEnable()
        {
            NMAEvent.OnEarnListChange += UpdateView;
            UpdateView();
        }

        void OnDisable()
        {
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

            var earns = new List<Earn>();
            var range = earnsInRangeSelection.Ref;
            if (range.IsProgressing)
            {
                earns.AddRange(model.GetEarn(range.booth, range.open));
            }
            else
            {
                var all = model.GetEarn(range.booth, range.open);
                var beforeClose = all.Where(e =>
                {
                    var isBefore = DateTime.Compare(new DateTime(e.date), range.close) < 0;
                    return isBefore;
                });
                earns.AddRange(beforeClose);
            }
            earns = earns.OrderByDescending(e =>
            {
                return e.date;
            }).ToList();
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
