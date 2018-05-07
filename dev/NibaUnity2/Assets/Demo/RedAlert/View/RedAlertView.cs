using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System.Linq;

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
            var cfg = ConfigEntity.Get(prototype);
            var prefabOverride = entityPrefabs.Where(p => p.name == prototype).FirstOrDefault();
            if(prefabOverride != null)
            {
                prefab = prefabOverride;
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
    }
}