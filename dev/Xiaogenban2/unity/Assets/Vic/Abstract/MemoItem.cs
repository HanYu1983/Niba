public class MemoItem
{
    public string Memo { get; set; }
    public bool isSelect { get; set; }

    public MemoItem(string memo, bool isSelect)
    {
        this.Memo = memo;
        this.isSelect = isSelect;
    }
}
