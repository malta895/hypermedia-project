from urllib.parse import urlparse
import os
from random import randint
from random import sample
import re

import psycopg2 as db
import pandas as pd

GENRES = ['Fantasy', 'Noir', 'Thriller', 'Hystorical',
          'Noir', 'Comedy', 'Drama', 'Horror', 'Humor'
          'Poetry', 'Legend', 'Religious']

THEMES = ['Love', 'Life', 'Death', 'Good vs. Evil', 'Coming of Age', 'Betrayal',
          'Power and Corruption', 'Survival', 'Courage and Heroism', 'Prejudice',
          'Society', 'War']

PUBLISHERS = ['Zanichelli', 'La Feltrinelli', 'Garzanti', 'Mondadori',
              'Hoepli', 'Editori Riuniti', 'Pearson']

def insert_publishers(cur):
    query = "INSERT INTO publisher (\"name\") VALUES(%s) RETURNING publisher_id"
    i = 0
    for publisher_name in PUBLISHERS:
        data = (publisher_name, )
        cur.execute(query, data)
        publisher_id = cur.fetchall()[0][0]
        PUBLISHERS[i] = (publisher_id, publisher_name)
        i += 1

def insert_genres(cur):
    query = "INSERT INTO genre(\"name\") VALUES(%s) RETURNING genre_id";
    i = 0
    for genre_name in GENRES:
        data = (genre_name, )
        cur.execute(query, data)
        genre_id = cur.fetchall()[0][0]
        GENRES[i] = (genre_id, genre_name)
        i += 1

def insert_themes(cur):
    query = "INSERT INTO theme(\"name\") VALUES(%s) RETURNING theme_id";
    i = 0
    for theme_name in THEMES:
        data = (theme_name, )
        cur.execute(query, data)
        theme_id = cur.fetchall()[0][0]
        THEMES[i] = (theme_id, theme_name)
        i += 1

#HYP_DATABASE_URL = 'postgres://gbafgxzzrptzkl:1701140e8503e989e9eaf6fed09240bd7ae5577b4552ac61bc628414778620a6@ec2-54-247-70-127.eu-west-1.compute.amazonaws.com:5432/dd82s2jphcruh9'

def db_connect():
    db_url = None
    db_url = os.getenv('DATABASE_URL')

#    db_url = os.getenv('DATABASE_URL')
    # db_url = 'postgres://postgres:root@localhost:5432/hypermedia'
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
    query = "SELECT author_id FROM author WHERE name = %s"
    data = (name, )
    cur.execute(query, data)
    author_id = cur.fetchone()
    if author_id == None:
        query = "INSERT INTO author(name) VALUES(%s) RETURNING author_id"
        cur.execute(query, data)
        author_id = cur.fetchone()
    query = "INSERT INTO author_book(book, author) VALUES(%s, %s) ON CONFLICT DO NOTHING"
    data = (book_id, author_id)
    cur.execute(query, data)



def insert_book(cur, book_id, isbn, title, price, picture, publisher, status='Available'):
    query = "INSERT INTO book (book_id, isbn, title, price, picture, status, publisher)\
VALUES(%s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING RETURNING book_id"
    data = (book_id, isbn, title, price, picture, status, publisher)
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
cur.execute('TRUNCATE genre CASCADE')
db_conn.commit()
cur.execute('TRUNCATE theme CASCADE')
db_conn.commit()
cur.execute('TRUNCATE publisher CASCADE')
db_conn.commit()

print("Inserisco generi e temi...")
insert_genres(cur)
insert_themes(cur)
insert_publishers(cur)

db_conn.commit()

def assign_genre(cur, book_id):
    # numero casuale di generi tra 1 e 3
    n = randint(1, 3)
    # genere casuale
    n_genre = sample(range(len(GENRES)), n)
    query = "INSERT INTO book_genre(book, genre) VALUES(%s, %s)"
    for g in n_genre:
        data = (book_id, GENRES[g][0])
        cur.execute(query, data)

def assign_theme(cur, book_id):
    # numero casuale di generi tra 1 e 3
    n = randint(1, 3)
    # genere casuale
    n_theme = sample(range(len(THEMES)), n)
    query = "INSERT INTO book_theme(book, theme) VALUES(%s, %s)"
    for t in n_theme:
        data = (book_id, THEMES[t][0])
        cur.execute(query, data)

print("INSERIMENTO...")

randDf = df.sample(n=df.shape[0])

nIndex = 0

for index, row in randDf.iterrows():
    if nIndex % 100 == 0:
        db_conn.commit() # committo ogni 100 così posso interrompere senza perdere tutto
        print("Progresso: " + str(nIndex))

    if nIndex > 100:
        break


    if (type(row['original_title']) is not str) or row['original_title'] == 'NaN' or row['original_title'] is None or len(row['original_title']) > 37:
        continue

    if row['isbn'] is None or row['isbn'] == 'nan':
        continue

    image_path = row['image_url']

    # scarico la versione large delle immagini
    image_path = re.sub(r'm?(/[0-9]+.jpg)', r'l\1', image_path)

    if 'nophoto' in image_path:
        continue

    publisher_n = randint(0, len(PUBLISHERS) - 1)
    publisher_id = PUBLISHERS[publisher_n][0]

    res = insert_book (
        cur,
        nIndex,
        str(row['isbn']),
        row['original_title'],
        randint(8, 49),
        image_path,
        publisher_id
    )
    if len(res) == 0: # la riga non è stata inserita
        continue


    assign_genre(cur, nIndex)
    assign_theme(cur, nIndex)


    authors_names = row['authors'].split(',')

    for author_name in authors_names:
        insert_author(
            cur,
            author_name,
            nIndex
            )
    nIndex += 1


db_conn.commit()

cur.close()
db_conn.close()
