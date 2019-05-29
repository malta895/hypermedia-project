import psycopg2 as db
import pandas as pd
from urllib.parse import urlparse

import os
from random import randint
import re

def db_connect():
    db_url = os.getenv('DATABASE_URL')
    # db_url = HYP_DATABASE_URL
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


def insert_author(cur, name, book_id):
    query = "SELECT * FROM author WHERE name = %s"
    data = (name, )
    cur.execute(query, data)
    if len(cur.fetchall()) == 0:
        query = "INSERT INTO author(name) VALUES(%s) RETURNING author_id"
        cur.execute(query, data)
        author_id = cur.fetchall()[0]
        query = "INSERT INTO author_book(book, author) VALUES(%s, %s) ON CONFLICT DO NOTHING"
        data = (book_id, author_id)
        cur.execute(query, data)



def insert_book(cur, book_id, isbn, title, price, picture, status='Available'):
    query = "INSERT INTO book (book_id, isbn, title, price, picture, status)\
VALUES(%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING RETURNING book_id"
    data = (book_id, isbn, title, price, picture, status)
    cur.execute(query, data)
    return cur.fetchall()


df = pd.read_csv("./books.csv")

db_conn = db_connect()
cur = db_conn.cursor()

cur.execute('TRUNCATE book CASCADE')
db_conn.commit()
cur.execute('TRUNCATE author CASCADE')
db_conn.commit()
cur.execute('TRUNCATE author_book CASCADE')
db_conn.commit()
print("INSERIMENTO...")
for index, row in df.iterrows():
    if row['book_id'] % 100 == 0:
        print("Progresso: " + str(row['book_id']))

    if row['book_id'] > 5000:
        break

    image_path = row['image_url']

    # scarico la versione large delle immagini
    image_path = re.sub(r'm?(/[0-9]+.jpg)', r'l\1', image_path)

    res = insert_book (
        cur,
        row['book_id'],
        str(row['isbn']),
        row['original_title'],
        randint(8, 49),
        image_path
    )
    if len(res) == 0: # la riga non è stata inserita
        continue

    authors_names = row['authors'].split(',')

    for author_name in authors_names:
        insert_author(
            cur,
            author_name,
            row['book_id']
            )


db_conn.commit()

cur.close()
db_conn.close()
