using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RobotWar
{
    public enum UnitMenuItem
    {
        Pending, Move, Attack, Status, Cancel
    }

    public class UnitMenu : Menu<UnitMenuItem>
    {
        
    }
}