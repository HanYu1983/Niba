import csv
from datetime import datetime

filename = "ユーザーアクション - 11_14時点新しく記入する.csv"

with open(filename, newline='') as f:
    rows = [row for row in csv.reader(f)][3:] # drop header
    now = datetime.now()
    def to_insert_sql(row: list[str]) -> str:
        # too many values to unpack (expected 8)
        # post_name, post_url, post_url2, post_id, user_id, manager, rating, comment = row
        post_id = row[3]
        user_id = row[4]
        rating = row[6]
        comment = row[7]
        # escape
        comment = comment.replace("'", "''")
        return f"insert into post_comments (user_id, post_id, rating, comment, updated_at, created_at) values ({user_id}, {post_id}, {rating}, '{comment}', '{now}', '{now}')"
    rows = [row for row in rows if len(row[0]) > 0]
    rows = [to_insert_sql(row) for row in rows]
    sql = ";\n".join(rows)+";"
    with open('insert_post_comments.sql', 'w', encoding='utf8') as json_file:
        json_file.write(sql)