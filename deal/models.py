from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from redactor.fields import RedactorField
import hashlib
import datetime
import os

def rename_photoid(instance, filename):
    h = instance.md5sum
    basename, ext = os.path.splitext(filename)

    if not h:
        md5 = hashlib.md5()
        for chunk in instance.photoid.chunks():
            md5.update(chunk)
        h = md5.hexdigest()
        instance.md5sum = h

    return os.path.join('mealphotoid', h[0:1], h[1:2], h + ext.lower())

# Create your models here.
class Meal(models.Model):
    zhtitle = models.CharField('中文名', max_length=100, help_text='限50字')
    entitle = models.CharField('英文名', max_length=100,
            help_text='限50字',blank=True,null=True)
    desc = RedactorField(verbose_name='菜品描述', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False)
    ingredient = RedactorField(verbose_name='配料', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False)
    cal = models.IntegerField('熱量', help_text='輸入整數', blank=True,null=True)
    cunit = models.CharField('熱量單位', max_length=10,
            help_text='限10字',blank=True,null=True)
    price = models.DecimalField('價格(CDN$)', help_text='輸入價格',
            max_digits=5,decimal_places=2,blank=True,null=True)
    unit = models.CharField('價格單位', max_length=10,
            help_text='限10字',blank=True,null=True)

    owner = models.ForeignKey(User, verbose_name='發布者', editable=False)
    pub_time = models.DateTimeField('發布時間', auto_now_add=True)
    update_time = models.DateTimeField('修改時間', auto_now=True)

    photoid = models.ImageField(verbose_name='菜單照片(必填)', upload_to=rename_photoid)
    md5sum = models.CharField(max_length=36, editable=False)

    def admin_image(self):
        if self.photoid:
            return u'<img src="%s" style="height:90px; width:175px;"/>' % self.photoid.url
        else:
            return 'No Flyer'
    def show_photoid(self):
        if self.photoid:
            return u'<img class="img-responsive" src="%s"/>' % self.photoid.url
        else:
            return ''

    admin_image.short_description = '菜單圖片預覽'
    admin_image.allow_tags = True

    class Meta:
        ordering = ['-pub_time']
    def __str__(self):
        return self.zhtitle

def rename_mealphoto(instance, filename):
    h = instance.md5sum
    basename, ext = os.path.splitext(filename)
    return os.path.join('mealphotoarch', h[0:1], h[1:2], h + ext.lower())

class MealPhoto(models.Model):
    name = models.CharField('相片標題', max_length=255, help_text='限255字')
    image = models.ImageField(verbose_name = '相片文件', upload_to=rename_mealphoto)
    dish = models.ForeignKey(Meal, verbose_name='菜品', editable=False)
    pub_time = models.DateTimeField('發布時間', auto_now_add=True)
    md5sum = models.CharField(max_length=36, editable=False)

    class Meta:
        ordering = ['pub_time']

    #show Thumbnail in admin page
    def thumbnail(self):
        if self.image:
            return u'<img src="%s" style="height:90px; width:175px;"/>' % self.image.url
        else:
            return 'No Photo'
    def photo_size(self):
        if self.image:
            return u'%dx%d' % (self.image.width, self.image.height)
        else:
            return '---'

    thumbnail.short_description = '預覽'
    thumbnail.allow_tags = True

    photo_size.short_description = "尺寸"
    photo_size.allow_tags = True

    def save(self, *args, **kwargs):
        if not self.pk:  # file is new
            md5 = hashlib.md5()
            for chunk in self.image.chunks():
                md5.update(chunk)
            self.md5sum = md5.hexdigest()
        super().save(*args, **kwargs)

    def __unicode__(self):
        return self.name
    def __str__(self):
        return self.name
