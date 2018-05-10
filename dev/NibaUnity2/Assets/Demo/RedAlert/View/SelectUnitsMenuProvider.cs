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
            SelectionManager.OnSelect += OnSelect;
        }

        void OnSelect(SelectionManager selectionMgr)
        {
            if (selectionMgr.IsClickOnLastSelect)
            {
                var obj = selectionMgr.lastClickObj;
                if(obj != null)
                {
                    Debug.Log(obj + ":");
                    var viewEntity = obj.GetComponent<RedAlertEntity>();
                    if (viewEntity != null)
                    {
                        var k = viewEntity.key;
                        if (RedAlertController.Model.ctx.entities.ContainsKey(k))
                        {
                            var e = RedAlertController.Model.ctx.entities[k];
                            if (e.player == RedAlertController.Player)
                            {
                                selectedUnits.Clear();
                                selectedUnits.Add(obj);
                                pageList.UpdateView();
                            }
                        }
                    }
                }
            }
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
                if (objs.Count > 0)
                {
                    selectedUnits.Clear();
                    selectedUnits.AddRange(objs);
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