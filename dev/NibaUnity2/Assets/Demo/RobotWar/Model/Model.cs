using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.IO;
using System.Threading;

namespace RobotWar
{
    public class Model : MonoBehaviour
    {
        public Context ctx = new Context();
        public Context mapCtx = new Context();

        #region controller
        public static Action OnUnitListChange = delegate { };
        public static Action OnWeaponListChange = delegate { };

        public void EnterTraining()
        {
            var memonto = DataAlg.GetMemonto(ctx);
            // 複製基本資料
            DataAlg.SetMemonto(mapCtx, memonto);
            // 產生亂數地圖
            DataAlg.GenTrainingData(mapCtx);
            RequestSaveMap();
        }

        public void CreateStartValue()
        {
            DataAlg.AddMoney(ctx, 5000);

            var unit = DataAlg.CreateUnit(ctx, ConfigUnit.ID_jimu);
            DataAlg.CreateUnit(ctx, ConfigUnit.ID_test01);

            DataAlg.CreateWeapon(ctx, ConfigWeapon.ID_bigGun);
            DataAlg.CreateWeapon(ctx, ConfigWeapon.ID_bomb);

            var kira = DataAlg.CreatePilot(ctx, ConfigPilot.ID_kira);
            DataAlg.CreatePilot(ctx, ConfigPilot.ID_solider1);
            DataAlg.CreatePilot(ctx, ConfigPilot.ID_solider1);

            DataAlg.AssignPilot(ctx, kira.Key, unit.Key);

            DataAlg.CreateItem(ctx, ConfigItem.ID_1);
            DataAlg.CreateItem(ctx, ConfigItem.ID_2);
            DataAlg.CreateItem(ctx, ConfigItem.ID_3);
            DataAlg.CreateItem(ctx, ConfigItem.ID_4);

            OnUnitListChange();
            OnWeaponListChange();
        }
        #endregion

        #region ui
        public string selectUnit;

        public bool HasSelectUnit
        {
            get
            {
                return string.IsNullOrEmpty(selectUnit) == false;
            }
        }

        public void SelectUnit(KeyRef unitKeyRef)
        {
            if(unitKeyRef.IsValid == false)
            {
                selectUnit = null;
                return;
            }
            selectUnit = unitKeyRef.Ref;
        }

        public void CreateMap(MapData mapData)
        {
            ctx.grids.Clear();
            foreach (var g in mapData.grids)
            {
                var ret = new Grid(g.pos);
                ctx.grids.Add(ret.Key, ret);
            }
        }
        #endregion

        #region persistent
        public bool Load()
        {
            var persistentDataPath = Application.persistentDataPath;

            var homePath = persistentDataPath + "/home.json";
            Debug.LogWarning("loading..." + homePath);
            if (File.Exists(homePath) == false)
            {
                return false;
            }
            else
            {
                var homeMemonto = File.ReadAllText(homePath);
                DataAlg.SetMemonto(ctx, homeMemonto);
            }
            return true;
        }

        public bool LoadMap()
        {
            var persistentDataPath = Application.persistentDataPath;
            var mapPath = persistentDataPath + "/map.json";
            if (File.Exists(mapPath) == false)
            {
                return false;
            }
            Debug.LogWarning("loading..." + mapPath);
            var mapMemoto = File.ReadAllText(mapPath);
            DataAlg.SetMemonto(mapCtx, mapMemoto);
            return true;
        }

        HashSet<string> saveTargets = new HashSet<string>();
        public void RequestSaveHome()
        {
            SavePlayerDiskWorker(Application.persistentDataPath);
            saveTargets.Add("home");
            lock (saveTargets)
            {
                Monitor.PulseAll(saveTargets);
            }
        }
        public void RequestSaveMap()
        {
            SavePlayerDiskWorker(Application.persistentDataPath);
            saveTargets.Add("map");
            lock (saveTargets)
            {
                Monitor.PulseAll(saveTargets);
            }
        }
        Thread savingThread;
        void SavePlayerDiskWorker(string persistentDataPath)
        {
            if (savingThread != null)
            {
                return;
            }
            savingThread = new Thread(() => {
                while (true)
                {
                    if (saveTargets.Contains("home"))
                    {
                        Debug.LogWarning("save home...");
                        var memonto = DataAlg.GetMemonto(ctx);
                        var path = persistentDataPath + "/home.json";
                        File.WriteAllText(path, memonto);
                        saveTargets.Remove("home");
                    }
                    if (saveTargets.Contains("map"))
                    {
                        Debug.LogWarning("save map...");
                        var memonto = DataAlg.GetMemonto(mapCtx);
                        var path = persistentDataPath + "/map.json";
                        File.WriteAllText(path, memonto);
                        saveTargets.Remove("map");
                    }
                    lock (saveTargets)
                    {
                        if (saveTargets.Count == 0)
                        {
                            Debug.LogWarning("waiting for save...");
                            Monitor.Wait(saveTargets);
                        }
                    }
                }
            });
            savingThread.Start();
        }
        #endregion
    }
}