from django.contrib import admin
from .models import MealPhoto, Meal

# Register your models here.
class MealPhotoInline(admin.TabularInline):
    model = MealPhoto
    #show Thumbnail in admin page
    fields = ('thumbnail', 'photo_size', 'name', 'image',)
    readonly_fields = ['thumbnail', 'photo_size']
    extra = 1

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    fieldsets = [
            ('名稱',
                {'fields' : ('zhtitle', 'entitle')}),
            ('說明',
                {'fields' : ('desc', 'ingredient', 'cal')}),
            ('價格',
                {'fields' : ('price', 'unit')}),
            ('照片',
                {'fields' : ('photoid',)}),
            ]

    list_display = ('pub_time','zhtitle', 'owner','price','unit','admin_image','update_time')

    inlines = [
            MealPhotoInline,
            ]

    def save_model(self, request, obj, form, change):
        obj.owner = request.user
        obj.save()
