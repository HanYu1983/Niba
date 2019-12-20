using System;

namespace RedAlert
{
    public class ControllerHelper
    {
        public const int TechHost = -1;

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