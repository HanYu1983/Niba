using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;

namespace RobotWar
{
    public class ModelController : MonoBehaviour
    {
        public void SelectUnit(KeyRef unitKeyRef)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.SelectUnit(unitKeyRef);
            GameManager.LoadSceneWithTransitions("");
        }

        public void SelectUnitPilot(KeyRef unitKeyRef)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.SelectUnit(unitKeyRef);
            GameManager.LoadSceneWithTransitions("Pilot");
        }
    }
}