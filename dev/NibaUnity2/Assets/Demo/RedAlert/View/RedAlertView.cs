using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;

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

        public void SpawnEntity(int key, string prototype, Vector3 pos)
        {
            GameObject prefab = puttingPrefab;
            var cfg = ConfigEntity.Get(prototype);
            if(cfg.EntityType == ConfigEntityType.ID_unit)
            {
                prefab = unitPrefab;
            }
            var go = Instantiate(prefab, root.transform, false);
            var entity = go.GetComponent<RedAlertEntity>();
            if(entity == null)
            {
                throw new System.Exception("must add RedAlertEntity");
            }
            go.transform.localPosition = pos;
            entity.key = key;
            entities.Add(entity.key, entity);
        }
    }
}