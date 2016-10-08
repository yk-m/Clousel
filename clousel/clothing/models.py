from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _


class Category(models.Model):
    title = models.CharField(max_length=255)
    parent = models.ForeignKey(
        'self', blank=False, null=True, related_name='children')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['title', ]

    def __str__(self):
        p_list = self._recurse_for_parents(self)
        p_list.append(self.title)
        return self.get_separator().join(p_list)

    @property
    def parents(self):
        return self._recurse_for_parents(self)

    def _recurse_for_parents(self, cat_obj):
        p_list = []
        if cat_obj.parent_id:
            p = cat_obj.parent
            p_list.append(p.title)
            more = self._recurse_for_parents(p)
            p_list.extend(more)
        if cat_obj == self and p_list:
            p_list.reverse()
        return p_list

    def _parents_repr(self):
        p_list = self._recurse_for_parents(self)
        return self.get_separator().join(p_list)
    _parents_repr.short_description = 'Category parents'

    def get_separator(self):
        return ' > '

    def get_children_tree(self, cat_obj):
        if cat_obj is None:
            children = Category.objects.filter(parent__isnull=True)
        elif not cat_obj.children.exists():
            return None
        else:
            children = cat_obj.children.all()
        c_list = []
        for child in children:
            c_element = {}
            c_element["title"] = child.title
            c_element["children"] = self._recurse_for_children(child)
            c_list.append(c_element)
        return c_list

    def clean(self):
        p_list = self._recurse_for_parents(self)
        if self.title in p_list:
            raise ValidationError(
                _('You must not save a category in itself'))

    @models.permalink
    def get_absolute_url(self):
        return ('category_index', (), {'category': self.slug})


def get_image_upload_to_path(instance, filename):
    return instance.get_image_upload_to_path(filename)


def get_binary_image_upload_to_path(instance, filename):
    return instance.get_binary_image_upload_to_path(filename)


class Clothing(models.Model):
    image = models.ImageField(upload_to=get_image_upload_to_path)
    binary_image = models.FileField(upload_to=get_binary_image_upload_to_path)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_related",
    )

    class Meta:
        abstract = True

    @staticmethod
    def get_image_upload_to_path(filename):
        return 'images/' + filename

    @staticmethod
    def get_binary_image_upload_to_path(filename):
        return 'binary_images/' + filename

    def delete(self, *args, **kwargs):
        self.image.delete(False)
        self.binary_image.delete(False)
        super(Clothing, self).delete(*args, **kwargs)
