using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;

namespace RobotWar
{
    public class KeyShowPageList : ShowPageList<string, KeyRef>
    {
        void Start()
        {
            Model.OnUnitListChange += UpdateView;
            StartCoroutine(DelayUpdateView());
        }
        void OnDestroy()
        {
            Model.OnUnitListChange -= UpdateView;
        }
        IEnumerator DelayUpdateView()
        {
            yield return 0;
            UpdateView();
        }
    }
}