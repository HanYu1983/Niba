using UnityEngine;
using System.Collections;

public class InterfaceComponent : MonoBehaviour {
	public MonoBehaviour implementation;
	public MonoBehaviour Implementation{ get{ return implementation; }}
}
