from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^meallist$', views.meallist, name='meallist'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
