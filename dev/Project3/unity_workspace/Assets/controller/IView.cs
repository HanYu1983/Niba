public interface IView
{
	void OpenTargetPage ( UIType pn);
	void CloseTargetPage( UIType pn );
	void AddCard( IDeck deck, IDeckPlayer player, ICard card );
	void PushCardToTable( IDeck deck, IDeckPlayer player, ICard card );
	void GameNumberChanged(IGameState state, int number);
	void DirectionChanged(IGameState state, Direction direction);
	void OnCurrentPlayerChange (IMatch match, IOption<IPlayer> player);
}

