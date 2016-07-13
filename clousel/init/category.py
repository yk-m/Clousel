import json

from clothing.models import Category

d = json.load(open("init/amebafurugiya.json"))

for row in d:
    parent = None
    for category in row['categories']:
        try:
            parent = Category.objects.get(title=category, parent=parent)
        except Category.DoesNotExist:
            c = Category(title=category, parent=parent)
            # print(str(c).encode('utf-8').decode('latin-1'))
            # print(str(row['categories']).encode('utf-8').decode('latin-1'))
            c.save()

            parent = c
