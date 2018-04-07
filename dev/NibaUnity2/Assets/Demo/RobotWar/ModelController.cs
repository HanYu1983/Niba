using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;

namespace RobotWar
{
    public class ModelController : MonoBehaviour
    {
        void Start()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.CreateStartValue();
        }

        public void SelectUnit(KeyRef unitKeyRef)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.SelectUnit(unitKeyRef);
            GameManager.LoadSceneWithTransitions("");
        }
    }
}