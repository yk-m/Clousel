import random

from shop.models import Item


class ItemFactory():

    @classmethod
    def create(cls, category, image_file):
        return Item.objects.create(
            category=category,
            image=image_file,
            price=random.randint(1000, 100000),
            brand='Egmont Books Ltd',
            exhibiter='Reuseaworld',
            delivery_days='Reuseaworld',
            delivery_service='Bunny',
            delivery_source='Nederland',
            rank='Very Good',
            size='16 x 0.8 x 16 cm',
            image_url='https://images-na.ssl-images-amazon.com/images/I/41NnVV1a8NL._SY495_BO1,204,203,200_.jpg',
            page_url='https://www.amazon.com/Miffy-Classic-Dick-Bruna/dp/1405209836',
            details="""
                Dick Bruna was born in 1927 in Utrecht, Holland.
            """
        )

