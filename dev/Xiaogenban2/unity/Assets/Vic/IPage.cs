public interface IPage
{
    void Init();
    void open();
    void close();
    void setModel(IModel model);
    IModel getModel();
}
