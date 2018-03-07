using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class CreateRangeRow : MonoBehaviour, INeedModel
    {
        public BoothRef boothRef;
        public GameObject rowLayout;
        public List<GameObject> rows;

        void Start()
        {
            NMAEvent.OnComponentStart(this);
            NMAEvent.OnBoothListChange += OnBoothListChange;
        }

        void OnDestroy()
        {
            NMAEvent.OnComponentDestroy(this);
            NMAEvent.OnBoothListChange -= OnBoothListChange;
        }

        void OnBoothListChange()
        {
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

            if(boothRef.IsValid == false)
            {
                return;
            }

            var ranges = model.GroupEarns(boothRef.Ref.Key);
            for (var i = 0; i < ranges.Count; ++i)
            {
                var row = Instantiate(rowLayout, transform, false);
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