using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.Linq;
using System;

namespace RedAlert
{
    public class ControllerHelper
    {
        public static Func<Entity, bool> IsUnitCanSelect(int player, RedAlertView view)
        {
            return (e) =>
            {
                if (e.player != player)
                {
                    return false;
                }
                var cfg = ConfigEntity.Get(e.prototype);
                if (cfg.EntityType == ConfigEntityType.ID_building)
                {
                    return false;
                }
                if (cfg.EntityType == ConfigEntityType.ID_bullet)
                {
                    return false;
                }
                var isExistInView = view.entities.ContainsKey(e.Key);
                if (isExistInView == false)
                {
                    return false;
                }
                return true;
            };
        }
    }
}