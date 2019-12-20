using UnityEngine;
using System.Collections;

public interface ICardViewDelegate
{
	void onCardViewTouchUp( object sender, ICard card );
}

