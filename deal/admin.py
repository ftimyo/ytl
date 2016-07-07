from django.contrib import admin
from .models import MealCatalog, MealPhoto, Meal, MealTheme

# Register your models here.
@admin.register(MealCatalog)
class MealCatalogAdmin(admin.ModelAdmin):
    fieldsets = [
            ('名稱',
                {'fields' : ('name', )}),
            ('說明',
                {'fields' : ('desc', )}),
            ]
    list_display = ['name', 'owner', 'pub_time', 'update_time']
    list_filter = ['pub_time', 'update_time',]
    search_fields = ['name', 'desc']

    def save_model(self, request, obj, form, change):
        obj.owner = request.user
        obj.save()

class MealPhotoInline(admin.TabularInline):
    model = MealPhoto
    #show Thumbnail in admin page
    fields = ('thumbnail', 'photo_size', 'name', 'image',)
    readonly_fields = ['thumbnail', 'photo_size']
    extra = 1

class MealAdmin(admin.ModelAdmin):
    fieldsets = [
            ('名稱',
                {'fields' : ('zhtitle', 'entitle',)}),
            ('菜單狀態',
                {'fields' : ('display', )}),
            ('類別',
                {'fields' : ('catalog',)}),
            ('說明',
                {'fields' : ('desc', 'ingredient',)}),
            ('熱量',
                {'fields' : ('cal', 'cunit',)}),
            ('價格',
                {'fields' : ('price', 'unit')}),
            ('照片',
                {'fields' : ('photoid',)}),
            ]

    list_display = ('zhtitle', 'display', 'owner','price','unit','admin_image','update_time','pub_time',)

    inlines = [
            MealPhotoInline,
            ]
    filter_horizontal = ('catalog', )

    list_filter = ['pub_time', 'update_time', 'display']
    search_fields = ['zhtitle', 'ingredient', 'desc']

    def save_model(self, request, obj, form, change):
        obj.owner = request.user
        obj.save()

admin.site.register(Meal, MealAdmin)

@admin.register(MealTheme)
class MealThemeAdmin(admin.ModelAdmin):
    fieldsets = [
            ('主題設置',{'fields':('sitetitle','brand','themecolor',)}),
            ('關於我們',{'fields':('title','desc')}),
            ('聯繫方式',{'fields':('name','wechat','wechatqr','facebook','twitter','weibo','tel','email')}),
            ]
    list_display = ['title','name','email','pub_time','update_time']
    list_filter = ['pub_time', 'update_time']
    search_fields = ['name', 'title', 'desc']
