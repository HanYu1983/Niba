using UnityEngine;
using System.Collections;
using System.Linq;

public class TouchManager : MonoBehaviour {

	void Update () {
		if (Input.GetMouseButtonDown (0) ) {
			Ray ray = Camera.main.ScreenPointToRay( Input.mousePosition );
			RaycastHit2D[] hits = Physics2D.RaycastAll( ray.origin, Vector2.up, 1 );

			if( hits.Length > 0 ){
				RaycastHit2D rh = hits[0];
				for( int i = 1; i < hits.Length; ++i ){
					if( hits[i].transform.position.z < rh.transform.position.z ){
						rh = hits[i];
					}
				}
				rh.transform.SendMessage( "onMouseDown", SendMessageOptions.DontRequireReceiver);
			}
		}
		if (Input.GetMouseButtonUp (0) ) {
			Ray ray = Camera.main.ScreenPointToRay( Input.mousePosition );
			RaycastHit2D[] hits = Physics2D.RaycastAll( ray.origin, Vector2.up, 1 );
			
			if( hits.Length > 0 ){
				RaycastHit2D rh = hits[0];
				for( int i = 1; i < hits.Length; ++i ){
					if( hits[i].transform.position.z < rh.transform.position.z ){
						rh = hits[i];
					}
				}
				rh.transform.SendMessage( "onMouseUp", SendMessageOptions.DontRequireReceiver);
			}
		}
	}
}
