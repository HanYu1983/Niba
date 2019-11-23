public interface IPage
{
    void Init();
    void Open();
    void Close();
    
    IModel Model { get; set; }
    View View { get; set; }
}
