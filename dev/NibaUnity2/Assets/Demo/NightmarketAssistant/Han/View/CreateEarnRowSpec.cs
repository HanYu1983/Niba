using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Linq;

namespace NightmarketAssistant
{
    public class CreateEarnRowSpec : MonoBehaviour
    {
        public EarnListRef earnListRef;
        public GameObject rowLayout;
        public int showCount;
        public List<GameObject> rows;

        void Start()
        {
            UpdateView();
        }
        
        private void OnEnable()
        {
            earnListRef.OnValueChange += UpdateView;
            UpdateView();
        }

        void OnDisable()
        {
            earnListRef.OnValueChange -= UpdateView;
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

            
            var earns = earnListRef.Ref.OrderByDescending(e=>e.date).ToList();
            var max = showCount <= 0 ? earns.Count : Mathf.Min(showCount, earns.Count);
            for (var i = 0; i < max; ++i)
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
