using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using GameFramework.GameStructure;

namespace RobotWar
{
    public class BasicValueView : MonoBehaviour
    {
        public Text txt_desc;
        private void Start()
        {
            UpdateView();
        }
        private void Awake()
        {
            ModelController.OnBasicValueChange += UpdateView;
        }
        private void OnDestroy()
        {
            ModelController.OnBasicValueChange -= UpdateView;
        }
        public void UpdateView()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var msg = string.Format("money:{0}", model.ctx.money);
            txt_desc.text = msg;
        }
    }
}