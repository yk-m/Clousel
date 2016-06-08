import json
from shop.models import Category

d = json.load(open("/srv/app/media/amebafurugiya.json"))

for row in d:
	parent = None
	for category in row['categories']:
		try:
			parent = Category.objects.get(title=category,parent=parent)
		except Category.DoesNotExist:
			c = Category(title=category, parent=parent)
			c.save()
