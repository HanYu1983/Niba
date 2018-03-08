﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class CreateBoothRow : MonoBehaviour, INeedModel
    {
        public GameObject rowLayout;
        public List<GameObject> rows;

        void Start()
        {
            NMAEvent.OnComponentStart(this);
            NMAEvent.OnBoothListChange += UpdateView;
        }

        void OnDestroy()
        {
            NMAEvent.OnComponentDestroy(this);
            NMAEvent.OnBoothListChange -= UpdateView;
        }

        private void OnEnable()
        {
            // 這時可能model還沒注入
            if(model == null)
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