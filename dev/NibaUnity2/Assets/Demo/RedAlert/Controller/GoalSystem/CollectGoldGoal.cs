using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class CollectGoldGoal : CompositeGoal, IInjectClientModel, IGoalListener
    {
        GameObject self;

        public CollectGoldGoal(GameObject self)
        {
            this.self = self;
            Listener = this;
        }

        public RedAlertModel ClientModel { set; get; }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);

            //AddGoal(new PutGoldGoal());
            AddGoal(new MoveToBuildingGoal(self, 0, ConfigEntity.ID_gdiGoldFactory));
            //AddGoal(new GetGoldGoal());
            AddGoal(new MoveToGoldGoal(self));
        }

        public void OnProcess(IGoal _)
        {

        }

        public void OnMessage(IGoal _, string msg)
        {

        }

        public void OnTerminate(IGoal _)
        {

        }
    }
}