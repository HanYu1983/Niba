using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;

namespace RobotWar
{
    public class KeyShowPageList : ShowPageList<string, KeyRef>
    {
        void Awake()
        {
            Model.OnUnitListChange += UpdateView;
        }
        private void Start()
        {
            UpdateView();
        }
        void OnDestroy()
        {
            Model.OnUnitListChange -= UpdateView;
        }
    }
}