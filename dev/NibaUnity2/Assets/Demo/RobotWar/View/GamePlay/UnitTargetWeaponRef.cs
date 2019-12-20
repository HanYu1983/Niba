using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System;

namespace RobotWar
{
    [Serializable]    
    public struct UnitTargetWeapon
    {
        public string unit, target, weapon;
    }

    public class UnitTargetWeaponRef : ObjectRef<UnitTargetWeapon>
    {
        
    }
}