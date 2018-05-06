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

            //AddGoal(new PutGoldGoal());
            AddGoal(new MoveToBuildingGoal(self, 0, ConfigEntity.ID_gdiGoldFactory));
            //AddGoal(new GetGoldGoal());
            AddGoal(new MoveToGoldGoal(self));
        }

        public override GoalState Process()
        {
            var result = base.Process();
            if(result == GoalState.Success)
            {
                Terminate();
                return GoalState.Running;
            }
            return result;
        }

        public override void Terminate()
        {
            base.Terminate();
        }
    }
}