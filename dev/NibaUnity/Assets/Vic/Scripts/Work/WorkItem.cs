using Common;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace GameView
{
    public class WorkItem : MonoBehaviour
    {
        public Text Describe;
        public Text DoName;
        public Button BtnDoWork;

        Description _WorkModel;
        public Description WorkModel
        {
            get
            {
                return _WorkModel;
            }
            set
            {
                _WorkModel = value;
                UpdateInfo();
            }
        }

        void UpdateInfo()
        {
            IModelGetter model = View.Instance.Model;
            string describe = "";
            string doName = "";
            if (WorkModel.description == Description.WorkCollectResource)
            {
                var mapObjectId = int.Parse(WorkModel.values.Get("mapObjectId"));
                var mapObject = model.MapObjects[mapObjectId];
                var mapObjectInfo = model.ResourceInfos[mapObject.infoKey];
                var config = ConfigResource.Get(mapObjectInfo.type);
                describe += "采集[" + config.Name +"]";
                doName += "采集";
            }

            if (WorkModel.description == Description.WorkAttack)
            {
                var mapObjectId = int.Parse(WorkModel.values.Get("mapObjectId"));
                var mapObject = model.MapObjects[mapObjectId];
                var mapObjectInfo = model.MonsterInfos[mapObject.infoKey];
                var config = ConfigMonster.Get(mapObjectInfo.type);
                describe += "攻擊[" + config.Name +"]";
                doName += "攻擊";
            }
            Describe.text = describe;
            DoName.text = doName;
        }

        private void Start()
        {
            BtnDoWork.onClick.AddListener(() =>
            {
                View.Instance.OnWorkItemClickDo(this);
            });
        }

        private void OnDestroy()
        {
            BtnDoWork.onClick.RemoveAllListeners();
        }
    }
}
