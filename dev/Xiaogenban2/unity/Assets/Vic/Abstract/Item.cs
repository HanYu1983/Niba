public class Item
{
    public int Id { get; set; }
    public int Money { get; set; }
    public long Time { get; set; }
    public string Memo { get; set; }

    public Item(int id, int money, string memo, long time)
    {
        this.Id = id;
        this.Money = money;
        this.Time = time;
        this.Memo = memo;
    }
}
