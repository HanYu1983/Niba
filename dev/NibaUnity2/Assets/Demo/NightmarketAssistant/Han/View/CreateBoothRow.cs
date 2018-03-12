using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class CreateBoothRow : MonoBehaviour
    {
        public StorageComponent model;
        public GameObject rowLayout;
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
            NMAEvent.OnBoothListChange += UpdateView;
            UpdateView();
        }

        private void OnDisable()
        {
            NMAEvent.OnBoothListChange -= UpdateView;
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

            for (var i = 0; i < model.Booths.Count; ++i)
            {
                var row = Instantiate(rowLayout, transform, false);
                var objRef = row.GetComponent<BoothRef>();
                if (objRef == null)
                {
                    Debug.LogWarning("BoothRef not found");
                    continue;
                }
                objRef.refType = ObjectRefType.Array;
                objRef.array = model.Booths;
                objRef.idx = i;
                row.SetActive(true);
                rows.Add(row);
            }
        }
    }
}