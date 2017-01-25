import io
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image


class ImageFactory():

    @classmethod
    def create(cls, filename="test.png"):
        file_obj = io.BytesIO()
        im = Image.new('RGBA', size=(10, 10), color=(256, 0, 0))
        im.save(file_obj, 'png')
        file_obj.name = filename
        file_obj.seek(0)
        return file_obj

    @classmethod
    def create_uploaded_file(cls, filename="test.png"):
        image = cls.create(filename)
        return SimpleUploadedFile(
            image.name,
            image.read(),
            content_type='image/png',
        )


class TmpImageFactory():

    @classmethod
    def create(cls, filetype='png'):
        image = Image.new('RGBA', size=(10, 10), color=(256, 0, 0))
        tmp_file = tempfile.NamedTemporaryFile(suffix=".{0}".format(filetype))
        image.save(tmp_file, filetype)
        return tmp_file
