using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using GameFramework.GameStructure;

namespace RobotWar
{
    public class PredictView : MonoBehaviour
    {
        public Text txt_desc;
        public UnitTargetWeaponRef dataRef;

        private void Awake()
        {
            Debug.Log("PredictView+Awake:"+this);
            dataRef.OnValueChange += UpdateView;
        }

        private void OnDestroy()
        {
            dataRef.OnValueChange -= UpdateView;
        }

        public void UpdateView()
        {
            Debug.Log("UpdateView:" + this);
            var data = dataRef.Ref;

            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var atk = DataAlg.GetAttackValue(model.mapCtx, data.unit, data.target, data.weapon);
            var def = DataAlg.GetDeffendValue(model.mapCtx, data.target);

            var hitPoint = atk.GetHitRate(def);
            var criRate = atk.GetCriticalRate(def);
            var damage = atk.Damage(def, false);

            var msg = string.Format("hit:{0} cri:{1} damage:{2}", hitPoint, criRate, damage);
            txt_desc.text = msg;
        }
    }
}