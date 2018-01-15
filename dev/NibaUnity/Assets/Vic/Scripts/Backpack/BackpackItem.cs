using UnityEngine;
using System.Collections;

namespace GameView
{
    public class BackpackItem : BasicItem
    {
		public HanRPGAPI.Item BackpackItemModel
        {
            get;
            set;
        }

        internal override void OnItemClick()
        {
            
        }
    }
}
