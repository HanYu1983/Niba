using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class SelectUnitsMenuProvider : MonoBehaviour, IShowPageListDataProvider<int>, IInjectRedAlertController
    {
        public IntShowPageList pageList;
        public List<GameObject> selectedUnits;

        void Awake()
        {
            if(pageList == null)
            {
                pageList = GetComponent<IntShowPageList>();
            }
        }

        void Start()
        {
            Injector.Inject(this);
        }

        void Update()
        {
            var Holder = RedAlertController;

            var selectionMgr = Holder.View.selectionManager;
            if (selectionMgr.IsSelecting)
            {
                var objs = Holder.Model.ctx.entities.Values
                    .Where(ControllerHelper.IsUnitCanSelect(Holder.Player, Holder.View))
                    .Select(e => Holder.View.entities[e.Key].gameObject).ToList();
                objs = selectionMgr.GetSelection(objs);
                if(objs.Count > 0)
                {
                    selectedUnits = objs;
                    pageList.UpdateView();
                }
            }
        }

        public List<int> GetData()
        {
            return selectedUnits.Select(u=>u.GetComponent<RedAlertEntity>().key).ToList();
        }

        public IRedAlertController RedAlertController { set; get; }
    }
}