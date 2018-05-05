using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class CollectGoldGoal : CompositeGoal, IInjectClientModel
    {
        GameObject self;

        public CollectGoldGoal(GameObject self)
        {
            this.self = self;
        }

        public RedAlertModel ClientModel { set; get; }

        public override void Activate()
        {
            base.Activate();
            Injector.Inject(this);

            var model = ClientModel;
            var hasResource = model.ctx.resources.Count > 0;
            if (hasResource == false)
            {
                return;
            }

            var resource = model.ctx.resources.Values.First();
            AddGoal(new MoveToGoal(self, resource.position));
        }

        public override void Terminate()
        {

            base.Terminate();
        }
    }
}