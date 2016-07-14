from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from redactor.fields import RedactorField
from decimal import Decimal
import django
import hashlib
import datetime
import os

css_themes = ['cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable',
    'sandstone','simplex','slate','spacelab','superhero','united','yeti']
soptionst = ['等待確認','等待處理','正在處理餐品','餐品處理完成','正在運輸餐品','餐品交易完成','異常交易狀態']
typeoptionst = ['自行取餐','送餐服務']
def rename_wechatID(instance, filename):
    h = instance.md5sum
    basename, ext = os.path.splitext(filename)

    if not h:
        md5 = hashlib.md5()
        for chunk in instance.wechatqr.chunks():
            md5.update(chunk)
        h = md5.hexdigest()
        instance.md5sum = h

    return os.path.join('wechatID', h[0:1], h[1:2], h + ext.lower())

class MealTheme(models.Model):
    address = models.CharField('地址:', max_length=100, help_text='限50字',blank=True,null=True)
    addresslink = models.CharField('Google Map Link:', max_length=200,blank=True,null=True)
    sitetitle = models.CharField('網站標題(必填):', max_length=100, help_text='限50字')
    brand = models.CharField('品牌名稱(必填):', max_length=100, help_text='限50字')
    doptions = zip(range(0,len(css_themes)), css_themes)
    themecolor = models.IntegerField('網站主題顏色:', default = -1, choices=doptions)
    title = models.CharField('關於我們標題(必填):', max_length=100, help_text='限50字')
    desc = RedactorField(verbose_name='關於我們的故事(必填):', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False)
    deliverydesc = RedactorField(verbose_name='送餐說明(必填):', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False)
    taxrate = models.FloatField('稅率',default=0.0)
    deliveryfee = models.DecimalField('送餐費(CDN$)',max_digits=5,decimal_places=2)
    name = models.CharField('暱稱(必填):', max_length=100, help_text='限50字')
    wechat = models.CharField('微信帳號(必填):', max_length=100, help_text='限50字')
    wechatqr = models.ImageField(verbose_name='微信QR碼圖片(必填)', upload_to=rename_wechatID)

    facebook = models.CharField('臉書帳號(選填):', max_length=100,
            help_text='限50字',blank=True,null=True)
    twitter = models.CharField('推特帳號(選填):', max_length=100,
            help_text='限50字',blank=True,null=True)
    weibo = models.CharField('新浪微博(選填):', max_length=100,
            help_text='限50字',blank=True,null=True)
    tel = models.CharField('電話(必填):', max_length=100, help_text='限50字')
    email = models.CharField('電子郵件(必填):', max_length=100, help_text='限50字')
    pub_time = models.DateTimeField('發布時間', auto_now_add=True)
    update_time = models.DateTimeField('修改時間', auto_now=True)
    md5sum = models.CharField(max_length=36, editable=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('-update_time',)


class MealCatalog(models.Model):
    name = models.CharField('類別名稱', unique = True, max_length=100, help_text='限50字')
    desc = RedactorField(verbose_name='類別描述', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False,
            blank = True, null =True)
    owner = models.ForeignKey(User, verbose_name='發布者', editable=False)
    pub_time = models.DateTimeField('發布時間', auto_now_add=True)
    update_time = models.DateTimeField('修改時間', auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)

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
    zhtitle = models.CharField('中文名', max_length=100, unique = True, help_text='限50字')
    entitle = models.CharField('英文名', max_length=100,
            help_text='限50字',blank=True,null=True)
    desc = RedactorField(verbose_name='菜品描述', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False)

    doptions = zip(range(0,3), ['隱藏', '顯示', '推薦'])
    display = models.IntegerField('顯示狀態', default = 0, choices=doptions,
            help_text =
            '隱藏:不會在前端顯示; 顯示:在菜單中顯示; 推薦:在菜單和推薦中顯示;')
    ingredient = RedactorField(verbose_name='配料', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False)
    cal = models.IntegerField('熱量', help_text='輸入整數', blank=True,null=True)
    cunit = models.CharField('熱量單位', max_length=10,
            help_text='限10字',blank=True,null=True)
    price = models.DecimalField('價格(CDN$)', help_text='輸入價格',
            max_digits=5,decimal_places=2,blank=True,null=True)
    unit = models.CharField('價格單位', max_length=10,
            help_text='限10字',blank=True,null=True)
    catalog = models.ManyToManyField(MealCatalog, verbose_name = "類別",
            related_name = 'catalog', blank = True)

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
    update_time = models.DateTimeField('修改時間', auto_now=True)
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
    class Meta:
        ordering = ('-pub_time',)

class OrderBook(models.Model):
    address = models.CharField('送餐地址',max_length=128,blank=True,null=True);
    person = models.CharField('收貨人',max_length=128);
    contact = models.CharField('收貨人聯繫方式',max_length=128);
    soptions = zip(range(0,len(soptionst)), soptionst)
    status = models.IntegerField('訂單狀態', default = 0, choices=soptions)
    typeoptions = zip(range(0,len(typeoptionst)), typeoptionst)
    ordertype = models.IntegerField('訂單類型', default = 0, choices=typeoptions)
    desc = RedactorField(verbose_name='備註', redactor_options={'focus': 'true'},
            allow_file_upload=False, allow_image_upload=False)
    taxrate = models.FloatField('稅率',default=0.0)
    deliveryfee = models.FloatField('送餐費',default=0.0)
    pub_time = models.DateTimeField('訂單創建時間', auto_now_add=True)
    update_time = models.DateTimeField('訂單確認時間', auto_now=True)
    dishes = models.ManyToManyField(Meal,verbose_name='訂購餐品',
            through='Purchase',related_name='dishes')
    def totalpayment(self):
        ar = self.dishes.all()
        ret = 0.0
        for x in ar:
            v = django.apps.apps.get_model('deal','Purchase').objects.get(transaction=self,dish=x)
            ret += float(v.price) * v.amount
        ret += float(self.deliveryfee)
        ret *= (1+self.taxrate)
        return "{:3.2f}".format(ret)
    totalpayment.short_description = "總計(CDN$)"
    totalpayment.allow_tags = True
    def __str__(self):
        return self.person;
    class Meta:
        ordering = ('-pub_time',)

class Purchase(models.Model):
    dish = models.ForeignKey(Meal, verbose_name='餐品', on_delete=models.CASCADE)
    transaction = models.ForeignKey(OrderBook, verbose_name='訂單',on_delete=models.CASCADE)
    name = models.CharField('餐品名', max_length=100)
    price = models.DecimalField('價格(CDN$)',max_digits=5,decimal_places=2)
    amount = models.IntegerField('餐品數量', default = 1)
