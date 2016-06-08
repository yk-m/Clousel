import json
import string
from shop.models import Item, Category
from django.core.files import File

def get_category(categories):
	parent = None
	for category in categories:
		parent = Category.objects.get(title=category,parent=parent)
	return parent

d = json.load(open("init/amebafurugiya.json"))

for row in d:
	print(str(row).encode('utf-8').decode('latin-1'))
	i = Item(
		image = row['image_paths'][0].lstrip('full/'),
		category  = get_category(row['categories']),
		price = 100,
		size = row.get('size', [''])[0],
		brand = row['brand'][0].strip(),
		rank = row['rank'][0],
		page_url = row['url'][0],
		image_url = row['image_urls'][0],
		details = row['details'][0],
	)
	i.save()
