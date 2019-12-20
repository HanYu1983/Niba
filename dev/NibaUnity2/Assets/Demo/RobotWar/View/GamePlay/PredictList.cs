using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RobotWar
{
    public class PredictList : MonoBehaviour
    {
        public UnitTargetWeaponListRef listRef;
        public GameObject row;
        public List<GameObject> rows;

        private void Awake()
        {
            listRef.OnValueChange += UpdateView;
        }

        private void OnDestroy()
        {
            listRef.OnValueChange -= UpdateView;
        }

        void UpdateView()
        {
            foreach(var r in rows)
            {
                Destroy(r);
            }
            rows.Clear();

            if (listRef.IsValid == false)
            {
                return;
            }
            var list = listRef.Ref;
            foreach(var l in list)
            {
                var r = Instantiate(row, row.transform.parent, false);
                var ur = r.GetComponent<UnitTargetWeaponRef>();
                // notify awake
                r.SetActive(true);

                if (ur.refType != HanUtil.ObjectRefType.Static)
                {
                    throw new System.Exception("XXX");
                }
                ur.value = l;
                ur.OnValueChange();
                
                rows.Add(r);
            }
        }
    }
}