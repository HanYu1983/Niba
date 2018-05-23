using System.Collections.Generic;
using System.Linq;
using System;

namespace HanPathFindingAPI
{
    public abstract class IPathfinding
    {
        public delegate Dictionary<T, int> GetNeigboursFn<T>(T node) where T : IGraphNode;
        public abstract List<T> FindPath<T>(GetNeigboursFn<T> GetNeigbours, T originNode, T destinationNode) where T : IGraphNode;
    }
}