from django.shortcuts import render
from django.http import HttpResponse

def item_image(request, item)
	try:
		with open(item.image.path, "rb") as f:
			return HttpResponse(f.read(), content_type="image/jpeg")
	except IOError:
		red = Image.new('RGBA', (1, 1), (255,0,0,0))
		response = HttpResponse(content_type="image/jpeg")
		red.save(response, "JPEG")
		return response
