import requests, json, csv, time, datetime

def convert_dotnet_tick(ticks):
    """Convert .NET ticks to formatted ISO8601 time
    Args:
        ticks: integer
            i.e 100 nanosecond increments since 1/1/1 AD"""
    _date = datetime.datetime(1, 1, 1) + datetime.timedelta(microseconds=ticks // 10)
    if _date.year < 1900:  # strftime() requires year >= 1900
        _date = _date.replace(year=_date.year + 1900)
    return _date.strftime("%Y-%m-%d")

url = "https://particle-979.appspot.com/nightmarketssistentdbfile2/root/xiaogenban/637235951584862900/save.json"
response = requests.get(url)

csv_data = [
    ["單號","總價","時間","備注"]
]
data = json.loads(response.text)
earns = data['earns']
for earn in earns:
    id = earn["id"]
    money = earn["money"]
    createUTC = earn["createUTC"]
    memo = earn["memo"]

    localtime = convert_dotnet_tick(createUTC)
    csv_data.append([id, money, localtime, memo])

with open('output.csv', 'w', newline='') as csvfile:
  writer = csv.writer(csvfile)

  # 寫入二維表格
  writer.writerows(csv_data)
