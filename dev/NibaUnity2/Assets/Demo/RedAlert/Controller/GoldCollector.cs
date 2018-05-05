using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.AI;

namespace RedAlert
{
    public class GoldCollector : MonoBehaviour, IInjectClientModel
    {
        public RedAlertModel ClientModel { set; get; }

        void Start()
        {
            Injector.Inject(this);
            StartCoroutine(Go());
        }

        public IEnumerator Go()
        {
            var self = GetComponent<RedAlertEntity>().key;
            var model = ClientModel;
            while (true)
            {
                var hasResource = model.ctx.resources.Count > 0;
                
                if (hasResource == false)
                {
                    yield return new WaitForSeconds(1);
                }
                else
                {
                    var resource = model.ctx.resources.Values.First();

                    var agent = GetComponent<NavMeshAgent>();
                    agent.SetDestination(resource.position);
                    while (true)
                    {
                        var dist = Vector3.Distance(transform.localPosition, resource.position);
                        if (dist > 1)
                        {
                            yield return new WaitForSeconds(0.2f);
                        }
                        else
                        {
                            break;
                        }
                    }
                    
                    agent.isStopped = true;
                    

                    while (true)
                    {
                        
                        DataAlg.CollectResource(model.ctx, self, resource.Key, 5);
                        if (model.ctx.units[self].amount >= 20)
                        {
                            break;
                        }
                        yield return new WaitForSeconds(0.2f);
                    }

                    var backBuilding = model.ctx.buildings.Values.Where(b =>
                    {
                        if (b.player != model.ctx.units[self].player)
                        {
                            return false;
                        }
                        if(b.prototype != ConfigEntity.ID_gdiGoldFactory)
                        {
                            return false;
                        }
                        return true;
                    }).FirstOrDefault();

                    if (backBuilding != null)
                    {
                        agent.isStopped = false;
                        agent.SetDestination(backBuilding.position);
                    }
                    break;
                }
            }
            yield return 0;
        }
    }
}