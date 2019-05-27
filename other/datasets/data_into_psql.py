import psycopg2 as db
import pandas as pd
from urllib.parse import urlparse

import os
from random import randint

def db_connect():
    db_url = os.getenv('DATABASE_URL')
    result = urlparse(db_url)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    conn = db.connect(
        database = database,
        user = username,
        password = password,
        host = hostname
    )
    return conn

def insert_book(cur, book_id, isbn, title, price, picture, status='Available'):

    query = "INSERT INTO book (book_id, isbn, title, price, picture, status) VALUES(%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING;"
    data = (book_id, isbn, title, price, picture, status)

    cur.execute(query, data)


df = pd.read_csv("./books.csv")

db_conn = db_connect()
cur = db_conn.cursor()

cur.execute('TRUNCATE book CASCADE')
db_conn.commit()
print("INSERIMENTO...")
for index, row in df.iterrows():
    if row['book_id'] % 100 == 0:
        print("Progresso: " + str(row['book_id']))
    insert_book (
        cur,
        row['book_id'],
        str(row['isbn']),
        row['original_title'],
        randint(8, 49),
        row['image_url']
    )

db_conn.commit()


cur.close()
db_conn.close()

