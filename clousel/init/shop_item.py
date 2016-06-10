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
		image            = 'shop_items/' + row['image_paths'][0].lstrip('full/'),
		category         = get_category(row['categories']),
		price            = row.get('price', [''])[0],
		brand            = row.get('brand', [''])[0],
		exhibiter        = row.get('exhibiter', [''])[0],
		delivery_days    = row.get('delivery_days', [''])[0],
		delivery_service = row.get('delivery_service', [''])[0],
		delivery_source  = row.get('delivery_source', [''])[0],
		rank             = row.get('rank', [''])[0],
		size             = row.get('size', [''])[0],
		image_url        = row['image_urls'][0],
		page_url         = row['url'][0],
		details          = row.get('details', [''])[0],
	)
	i.save()
