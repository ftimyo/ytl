from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    url(r'^menu$', views.menulist, name='menu'),
    url(r'^meallist$', views.meallist, name='meallist'),
    url(r'^$', views.homelist, name='home'),
    url(r'^homelist$', views.homelistJSON, name='homelistJSON')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
