public interface ICard
{
	CardType Type { get; }
	CardAbility Ability{ get; }
	int Id { get; }
	int Number { get; }	
	bool IsNormal{ get; }
	bool IsSpecial{ get; }
	void InvokeAbility (ICardAbilityReceiver receiver);
}