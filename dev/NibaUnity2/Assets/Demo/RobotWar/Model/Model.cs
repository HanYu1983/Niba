using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.IO;
using System.Threading;
using System.Runtime.InteropServices;

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

        public void ExitMap()
        {
            mapCtx = new Context();
            ClearSaveMap();
        }

        public void CreateStartValue()
        {
            DataAlg.AddMoney(ctx, 1000000000);

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




#if UNITY_EDITOR
        public static string PersistentDataPath()
        {
            return Application.persistentDataPath;
        }
        public static bool IsFileExist(string path)
        {
            return File.Exists(path);
        }
        public static string ReadAllText(string path)
        {
            return File.ReadAllText(path);
        }
        public static void DeleteFile(string path)
        {
            File.Delete(path);
        }
        public static void WriteAllText(string path, string data)
        {
            File.WriteAllText(path, data);
        }
        static HashSet<string> saveTargets = new HashSet<string>();
        public static void SRequestSaveHome(Model model)
        {
            SavePlayerDiskWorker(PersistentDataPath(), model);
            saveTargets.Add("home");
            lock (saveTargets)
            {
                Monitor.PulseAll(saveTargets);
            }
        }
        public static void SRequestSaveMap(Model model)
        {
            SavePlayerDiskWorker(PersistentDataPath(), model);
            saveTargets.Add("map");
            lock (saveTargets)
            {
                Monitor.PulseAll(saveTargets);
            }
        }
        static Thread savingThread;
        static void SavePlayerDiskWorker(string persistentDataPath, Model model)
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
                        var memonto = DataAlg.GetMemonto(model.ctx);
                        var path = persistentDataPath + "/home.json";
                        WriteAllText(path, memonto);
                        saveTargets.Remove("home");
                    }
                    if (saveTargets.Contains("map"))
                    {
                        Debug.LogWarning("save map...");
                        var memonto = DataAlg.GetMemonto(model.mapCtx);
                        var path = persistentDataPath + "/map.json";
                        WriteAllText(path, memonto);
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
#elif UNITY_WEBGL
        [DllImport("__Internal")]
        public static extern string PersistentDataPath();
        [DllImport("__Internal")]
        public static extern bool IsFileExist(string path);
        [DllImport("__Internal")]
        public static extern string ReadAllText(string path);
        [DllImport("__Internal")]
        public static extern void DeleteFile(string path);
        [DllImport("__Internal")]
        public static extern void WriteAllText(string path, string data);
#endif

        #region persistent
        public bool Load()
        {
            Debug.Log("log");
            var persistentDataPath = PersistentDataPath();
            var homePath = persistentDataPath + "/home.json";
            Debug.LogWarning("loading..." + homePath);
            if (IsFileExist(homePath) == false)
            {
                return false;
            }
            else
            {
                var homeMemonto = ReadAllText(homePath);
                DataAlg.SetMemonto(ctx, homeMemonto);
            }
            return true;
        }

        public bool LoadMap()
        {
            Debug.Log("LoadMap");
            var persistentDataPath = PersistentDataPath();
            var mapPath = persistentDataPath + "/map.json";
            if (IsFileExist(mapPath) == false)
            {
                return false;
            }
            Debug.LogWarning("loading..." + mapPath);
            var mapMemoto = ReadAllText(mapPath);
            DataAlg.SetMemonto(mapCtx, mapMemoto);
            return true;
        }
        public void RequestSaveHome()
        {
#if UNITY_EDITOR
            SRequestSaveHome(this);
#elif UNITY_WEBGL
            var memonto = DataAlg.GetMemonto(ctx);
            var path = PersistentDataPath() + "/home.json";
            WriteAllText(path, memonto);
#endif
        }
        public void RequestSaveMap()
        {
#if UNITY_EDITOR
            SRequestSaveMap(this);
#elif UNITY_WEBGL
            var memonto = DataAlg.GetMemonto(mapCtx);
            var path = PersistentDataPath() + "/map.json";
            WriteAllText(path, memonto);
#endif
        }
        public void ClearSaveMap()
        {
            var persistentDataPath = PersistentDataPath();
            var mapPath = persistentDataPath + "/map.json";
            if (IsFileExist(mapPath) == false)
            {
                return;
            }
            DeleteFile(mapPath);
        }
        
#endregion
    }
}