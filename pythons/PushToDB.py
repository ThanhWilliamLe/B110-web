import psycopg2

hostname = 'stampy.db.elephantsql.com'
username = 'virecnti'
password = 'ipMZgV1SwYP-S1eyDZ057WDb2xAo9dn5'
database = 'virecnti'

#%%
con = psycopg2.connect( host=hostname, user=username, password=password, dbname=database )
cur = con.cursor()
cur.execute('truncate people')
con.commit()
con.close()

#%%
con = psycopg2.connect( host=hostname, user=username, password=password, dbname=database )
cur = con.cursor()
with open("DbImport.txt", 'r') as f:
    cur.copy_from(f, 'people', sep='|')
con.commit()
con.close()