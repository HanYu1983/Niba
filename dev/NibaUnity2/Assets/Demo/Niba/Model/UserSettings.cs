using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
using System.Linq;

namespace Niba
{
    public class UserSettings
    {
        public List<string> mark = new List<string>();
        public void Mark(string v)
        {
            if (IsMark(v))
            {
                return;
            }
            mark.Add(v);
        }
        public bool IsMark(string v)
        {
            return mark.Contains(v);
        }
        public string GetMemonto()
        {
            string json = JsonUtility.ToJson(this);
            return json;
        }
        public static UserSettings FromMemonto(string json)
        {
            return JsonUtility.FromJson<UserSettings>(json);
        }
    }
}