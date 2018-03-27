using System.Collections.Generic;


namespace HanPathFindingAPI
{
    class DijkstraPathfinding : IPathfinding
    {
        public static Dictionary<T, List<T>> FindAllPaths<T>(GetNeigboursFn<T> GetNeigbours, T originNode) where T : IGraphNode
        {
            IPriorityQueue<T> frontier = new HeapPriorityQueue<T>();
            frontier.Enqueue(originNode, 0);

            Dictionary<T, T> cameFrom = new Dictionary<T, T>();
            cameFrom.Add(originNode, default(T));
            Dictionary<T, int> costSoFar = new Dictionary<T, int>();
            costSoFar.Add(originNode, 0);

            while (frontier.Count != 0)
            {
                var current = frontier.Dequeue();
                var neighbours = GetNeigbours(current);
                foreach (var neighbour in neighbours.Keys)
                {
                    var newCost = costSoFar[current] + neighbours[neighbour];
                    if (!costSoFar.ContainsKey(neighbour) || newCost < costSoFar[neighbour])
                    {
                        costSoFar[neighbour] = newCost;
                        cameFrom[neighbour] = current;
                        frontier.Enqueue(neighbour, newCost);
                    }
                }
            }

            Dictionary<T, List<T>> paths = new Dictionary<T, List<T>>();
            foreach (T destination in cameFrom.Keys)
            {
                List<T> path = new List<T>();
                var current = destination;
                while (!current.Equals(originNode))
                {
                    path.Add(current);
                    current = cameFrom[current];
                }
                paths.Add(destination, path);
            }
            return paths;
        }
        public override List<T> FindPath<T>(GetNeigboursFn<T> GetNeigbours, T originNode, T destinationNode)
        {
            IPriorityQueue<T> frontier = new HeapPriorityQueue<T>();
            frontier.Enqueue(originNode, 0);

            Dictionary<T, T> cameFrom = new Dictionary<T, T>();
            cameFrom.Add(originNode, default(T));
            Dictionary<T, int> costSoFar = new Dictionary<T, int>();
            costSoFar.Add(originNode, 0);

            while (frontier.Count != 0)
            {
                var current = frontier.Dequeue();
                var neighbours = GetNeigbours(current);
                foreach (var neighbour in neighbours.Keys)
                {
                    var newCost = costSoFar[current] + neighbours[neighbour];
                    if (!costSoFar.ContainsKey(neighbour) || newCost < costSoFar[neighbour])
                    {
                        costSoFar[neighbour] = newCost;
                        cameFrom[neighbour] = current;
                        frontier.Enqueue(neighbour, newCost);
                    }
                }
                if (current.Equals(destinationNode)) break;
            }
            List<T> path = new List<T>();
            if (!cameFrom.ContainsKey(destinationNode))
                return path;

            path.Add(destinationNode);
            var temp = destinationNode;

            while (!cameFrom[temp].Equals(originNode))
            {
                var currentPathElement = cameFrom[temp];
                path.Add(currentPathElement);

                temp = currentPathElement;
            }

            return path;
        }
    }
}