public class Item
{
    public int Id { get; set; }
    public int Money { get; set; }
    public string Time { get; set; }
    public string Memo { get; set; }

    public Item(int id, int money, string memo, string time)
    {
        this.Id = id;
        this.Money = money;
        this.Time = time;
        this.Memo = memo;
    }
}
