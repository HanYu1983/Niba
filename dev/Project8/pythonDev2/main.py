import csv
from datetime import datetime

with open('useraction.csv', newline='') as f:
    rows = [row for row in csv.reader(f)][1:] # drop header
    now = datetime.now()
    def to_insert_sql(row: list[str]) -> str:
        user_id, post_id, rating, comment = row
        return f"insert into post_comments (user_id, post_id, rating, comment, updated_at, created_at) values ({user_id}, {post_id}, {rating}, \"{comment}\", '{now}', '{now}')"
    sql = ";\n".join([to_insert_sql(row) for row in rows])
    with open('insert_post_comments.sql', 'w', encoding='utf8') as json_file:
        json_file.write(sql)