from SheetConnect import GetB110Profiles
import pandas as pd
from urllib.parse import urlparse

def validateAvatar(s):
    parseResult= urlparse(str(s))
    if parseResult.scheme != '' and parseResult.netloc != '':
        return s
    return 'https://scontent.fhan3-2.fna.fbcdn.net/v/t1.0-9/17796521_196568724180934_5838591574055524576_n.jpg?_nc_cat=0&_nc_eui2=AeEksC0tOWWSegFOM-TUtPTHWz61uzOzjXWGcMHL5QXkyEWxaovuq2PbxrAxo57o_cCKWIEj6sVEA8lP5Hu9Teck-bqFOHtxoX7DwHuU270nXQ&oh=8b01e91102b3e2c925c724dc14cdc2d3&oe=5BA7F568'

def headers():
    return ['Timestamp', 'lastname','midname','firstname','nickname','dob',
            'male','gen','phone','facebook','email','address','city','portrait','idfile','bio']
    
def identifiers(i):
    pplDict= {
        'Lê Tiến Thành':['thanhle',True,51],
        'Nguyễn Thị Hải Yến':['haiyen',False,5],
        'Đỗ Thu Hoài':['hoaiham',True,11],
        'Nguyễn Huy Hoàng':['hoangseu',False,5],
        'Đỗ Lý Yến':['yencho',True,5],
        'Vũ Nam Trường':['vutruong',False,5],
        'Nguyễn Thị Hoài Thu':['hoaithu',False,5],
        'Mai Thu Trang':['maitrang',False,21],
        'Dương Cẩm Tú':['camtu',True,5],
        'Nguyễn Duy Quang':['duyquang',False,5],
        'Phạm Thị Huyền Trang':['trangnu',False,20],
        'Cù Diệu Linh':['linhte',True,11],
        'Đỗ Thị Thảo Hương':['huongmin',True,50],
        'Mai Thùy Linh':['bobia',True,80],
        'Nguyễn Thị Vân Anh':['vananh',False,5],
        'Đại Thị Thúy Quỳnh':['nghiennhi',False,5],
        'Nguyễn Thanh Hiếu':['thanhhieu',False,5],
        'Phạm Bích Như Quỳnh':['quynhmyt',True,5],
        'Nguyễn Bằng Ngân':['bangngan',False,5],
        'Trần Thanh Dương':['thanhduong',False,5],
        'Lương Phương Ly':['phuongly',True,11],
        'Phạm Thị Khánh An':['khanhan',True,5],
        'Nguyễn Thu Hà':['hachip',False,5]
        }
    return {k:v[i] for k,v in pplDict.items()};
    
def pgHeaders():
    return ['id','fullname', 'firstname','lastname','nickname','dob','male','gen','phone',
            'email','facebook','address','country','city','dancer','choreographer',
            'portrait','identifier','idfile','bio','position']

#%%
data = pd.DataFrame(GetB110Profiles(), columns = headers())

data=data.drop(columns=['Timestamp'])

data['fullname'] = data['lastname']+" "+data['midname']+" "+data['firstname']
data['fullname'] = data['fullname'].replace('  ',' ');
data['identifier'] = data['fullname'].map(identifiers(0))
data['male'] = data['male'].map({'Nam':True,'Nữ':False})
data['phone'] = '0'+data['phone']

fullnames = data['fullname'].tolist()

#%%
pgdata = pd.DataFrame(data, columns = pgHeaders())
pgdata['id'] = pgdata.index
pgdata['country'] = 'vn'
pgdata['dancer'] = True
pgdata['portrait'] = [validateAvatar(s) for s in pgdata['portrait']]
pgdata['choreographer'] = pgdata['fullname'].map(identifiers(1)).fillna(False)
pgdata['position'] = pgdata['fullname'].map(identifiers(2)).fillna(5)

#%%
output = pgdata.values.tolist()
outputStrings = []

for row in output:
    rowString = ""
    for cell in row:
        cellStr = str(cell)
        if cell==True:
            cellStr='1'
        elif cell==False:
            cellStr='0'
        rowString+=cellStr+"|"
    rowString = rowString[:-1].replace('\n', '#nl#').replace('\r', '#rl#')
    outputStrings.append(rowString)
    
del cell
del output
del row
del rowString

#%%
text_file = open("DbImport.txt", "w")
for row in outputStrings:
    text_file.write(row+"\n")
text_file.close()

del row