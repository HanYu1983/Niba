using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System.Linq;
using System;
using GameFramework.UI.Dialogs.Components;
using UnityEngine.Assertions;

namespace RedAlert
{
    public class RedAlertView : MonoBehaviour
    {
        public SelectionManager selectionManager;
        public MoveCameraWithMouse moveCamera;
        public GameObject puttingPrefab;
        public GameObject puttingObj;
        public GameObject unitPrefab;
        public GameObject root;

        public IntShowPageList buildingMenu;
        public StrShowPageList buildMenu;

        public Dictionary<int, RedAlertEntity> entities = new Dictionary<int, RedAlertEntity>();

        #region putting building
        public void SpawnPuttingEntity(string prototype, Vector3 pos)
        {
            RemovePuttingObject();
            puttingObj = Instantiate(puttingPrefab, transform, false);
            puttingObj.transform.localPosition = pos;
        }

        public void RemovePuttingObject()
        {
            if (puttingObj != null)
            {
                Destroy(puttingObj);
                puttingObj = null;
            }
        }

        public void SyncPuttingEntityPosition(Vector3 pos)
        {
            if (puttingObj == null)
            {
                return;
            }
            puttingObj.transform.localPosition = pos;
        }
        #endregion

        public GameObject[] entityPrefabs;

        public void SpawnEntity(int key, string prototype, Vector3 pos)
        {
            GameObject prefab = puttingPrefab;
            if (key < 0)
            {
                var prefabOverride = entityPrefabs.Where(p => p.name == prototype).FirstOrDefault();
                if (prefabOverride != null)
                {
                    prefab = prefabOverride;
                }
                var go = Instantiate(prefab, root.transform, false);
                go.transform.localPosition = pos;
                go.SetActive(true);
            }
            else
            {
                var cfg = ConfigEntity.Get(prototype);
                var prefabOverride = entityPrefabs.Where(p => p.name == prototype).FirstOrDefault();
                if (prefabOverride != null)
                {
                    prefab = prefabOverride;
                }
                var go = Instantiate(prefab, root.transform, false);
                go.transform.localPosition = pos;
                var entity = go.GetComponent<RedAlertEntity>();
                if (entity == null)
                {
                    throw new System.Exception("must add RedAlertEntity");
                }
                entity.key = key;
                entities.Add(entity.key, entity);
                go.SetActive(true);
            }
        }

        public void SyncEntity(int key, Vector3 pos, Vector3 rotation)
        {
            var isExist = entities.ContainsKey(key);
            if(isExist == false)
            {
                Debug.LogWarning("entity not found:" + key);
                return;
            }
            var e = entities[key];
            e.transform.localPosition = pos;
            e.transform.localRotation = Quaternion.Euler(rotation);
        }

        public void RemoveEntity(int key)
        {
            if (entities.ContainsKey(key) == false)
            {
                return;
            }
            var en = entities[key];
            entities.Remove(key);
            Destroy(en.gameObject);
        }

        public void Alert(string msg)
        {
            Alert(DialogInstance.DialogButtonsType.Ok, "Warning", msg, (dialog) => { });
        }

        public static void Alert(DialogInstance.DialogButtonsType type, string title, string text, Action<DialogInstance> cb)
        {
            Assert.IsTrue(DialogManager.IsActive, "Ensure that you have added a DialogManager component to your scene before showing a dialog!");
            var dialogInstance = DialogManager.Instance.Create(null, null, null, null);
            dialogInstance.Show(title: title,
                text: text,
                text2: "",
                sprite: null,
                doneCallback: cb,
                dialogButtons: type);
        }
    }
}