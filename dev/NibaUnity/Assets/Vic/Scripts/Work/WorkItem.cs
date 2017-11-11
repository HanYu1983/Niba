using Common;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace GameView
{
    public class WorkItem : BasicItem
    {
        public Description WorkModel
        {
            set;
            get;
        }
        internal override void OnItemClick()
        {
            View.Instance.OnWorkItemClickDo(WorkModel);
        }
    }
}
