using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RobotWar
{
    [Serializable]
    public enum UnitMenuItem
    {
        Pending, Move, Attack, Status
    }

    public class UnitMenu : MonoBehaviour
    {
        public UnitMenuItem selected;
        public List<UnitMenuItem> menu;

        public void Select(int idx)
        {
            if(menu.Count <= idx)
            {
                throw new Exception("XXX");
            }
            selected = menu[idx];
        }

        public UnitMenuItem Selected
        {
            get
            {
                return selected;
            }
        }

        public IEnumerator WaitForResult()
        {
            selected = UnitMenuItem.Pending;
            yield return new WaitUntil(() =>
            {
                return selected != UnitMenuItem.Pending;
            });
        }
    }
}