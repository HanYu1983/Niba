public interface IPlayPageDelegate
{
	void onPlayPageBtnPauseClick( object sender );
	void onPlayPageBtnEnterClick( object sender );
	void onPlayPageGameStart( object sender );
	void onPlayPageSendCard( object sender, ICard cardModel );
}

