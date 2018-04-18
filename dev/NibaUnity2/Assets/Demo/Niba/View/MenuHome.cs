using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Niba
{
    public class MenuHome : MonoBehaviour
    {
        public AbilityView abilityView;

        public void UpdateUI(IModelGetter model, Place who)
        {
            abilityView.UpdateAbility(model, who);
        }
    }
}
