using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;
using UnityEngine.UI;

namespace RobotWar
{
    public class UnitLevelsView : MonoBehaviour
    {
        public KeyRef unitKeyRef;
        public UnitLevels currLevels;
        public Text txt_hp, txt_en, txt_power, txt_armor, txt_speed;
        public Text txt_cost;

        private void Awake()
        {
            unitKeyRef.OnValueChange += UpdateView;
        }

        void OnDestroy()
        {
            unitKeyRef.OnValueChange -= UpdateView;
        }

        public void AdjHp(int v)
        {
            currLevels.hp += v;
            UpdateLevelTextOnly();
        }

        public void AdjEn(int v)
        {
            currLevels.en += v;
            UpdateLevelTextOnly();
        }

        public void AdjPower(int v)
        {
            currLevels.power += v;
            UpdateLevelTextOnly();
        }

        public void AdjArmor(int v)
        {
            currLevels.armor += v;
            UpdateLevelTextOnly();
        }

        public void AdjSpeed(int v)
        {
            currLevels.speed += v;
            UpdateLevelTextOnly();
        }

        public void AdjClear()
        {
            if (unitKeyRef.IsValid == false)
            {
                return;
            }
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            currLevels = model.ctx.units[unitKeyRef.Ref].levels;
            UpdateLevelTextOnly();
        }

        void UpdateLevelTextOnly()
        {
            txt_hp.text = "hp:" + currLevels.hp;
            txt_en.text = "en:" + currLevels.en;
            txt_power.text = "power:" + currLevels.power;
            txt_armor.text = "armor:" + currLevels.armor;
            txt_speed.text = "speed:" + currLevels.speed;

            if (unitKeyRef.IsValid)
            {
                var model = GameManager.Instance.gameObject.GetComponent<Model>();
                var unit = unitKeyRef.Ref;
                var cost = DataAlg.GetUpgradeUnitCost(model.ctx, unit, currLevels);
                txt_cost.text = "money:" + cost;
            }
        }

        void UpdateView()
        {
            if(unitKeyRef.IsValid == false)
            {
                return;
            }
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            currLevels = model.ctx.units[unitKeyRef.Ref].levels;
            UpdateLevelTextOnly();
        }
    }
}