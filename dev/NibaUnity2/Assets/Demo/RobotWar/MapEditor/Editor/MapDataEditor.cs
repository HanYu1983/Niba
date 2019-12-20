using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using System;
using UnityEditor;

namespace RobotWar
{
    public class MapDataEditor : MonoBehaviour
    {
        public string path;

        public Transform root;
        public GameObject prefab;
        public int gridWidth, gridHeight;
        public int Width;
        public int Height;

        [ContextMenu("Load")]
        public void Load()
        {
            if (string.IsNullOrEmpty(path))
            {
                throw new Exception("enter path");
            }
            var data = (MapData)AssetDatabase.LoadAssetAtPath("Assets/"+path, typeof(MapData));
            Clear();
            foreach(var g in data.grids)
            {
                var square = Instantiate(prefab);
                var i = g.pos.x;
                var j = g.pos.y;
                square.transform.position = new Vector3(i * gridWidth, 0, j * gridHeight);
                square.GetComponent<GridView>().coord = new Vector2Int(i, j);
                square.transform.parent = root;
            }
        }

        [ContextMenu("Save")]
        public void Save()
        {
            if (string.IsNullOrEmpty(path))
            {
                throw new Exception("enter path");
            }
            var exampleAsset = ScriptableObject.CreateInstance<MapData>();
            foreach (Transform g in root)
            {
                var gd = new GridData();
                gd.pos = g.gameObject.GetComponent<GridView>().coord;
                exampleAsset.grids.Add(gd);
            }
            AssetDatabase.CreateAsset(exampleAsset, "Assets/" + path);
            AssetDatabase.Refresh();
            EditorUtility.FocusProjectWindow();
            Selection.activeObject = exampleAsset;
        }

        [ContextMenu("Clear")]
        public void Clear()
        {
            for(var i=root.childCount-1; i>=0; --i)
            {
                var g = root.GetChild(i);
                DestroyImmediate(g.gameObject);
            }
        }

        [ContextMenu("GenerateGrid")]
        public void GenerateGrid()
        {
            if (prefab.GetComponent<GridView>() == null)
            {
                Debug.LogError("Invalid square cell prefab provided");
            }
            Clear();
            for (int i = 0; i < Width; i++)
            {
                for (int j = 0; j < Height; j++)
                {
                    var square = Instantiate(prefab);
                    square.transform.position = new Vector3(i * gridWidth, 0, j * gridHeight);
                    square.GetComponent<GridView>().coord = new Vector2Int(i, j);
                    square.transform.parent = root;
                }
            }
        }

        

        [ContextMenu("SnapToGrid")]
        public void SnapToGrid()
        {
            foreach (Transform obstacle in root)
            {
                var newPos = obstacle.localPosition;
                newPos.x = (int)Math.Round(newPos.x / gridWidth) * gridWidth;
                newPos.y = 0;
                newPos.z = (int)Math.Round(newPos.z / gridHeight) * gridHeight;
                obstacle.localPosition = newPos;
                obstacle.GetComponent<GridView>().coord.x = (int)newPos.x;
                obstacle.GetComponent<GridView>().coord.y = (int)newPos.z;
            }
        }
    }
}