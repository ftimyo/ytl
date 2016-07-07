from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    url(r'^menu$', views.menulist, name='menu'), #PAGE
    url(r'^meallist$', views.meallist, name='meallist'), #AJAX
    url(r'^$', views.homelist, name='home'), #PAGE
    url(r'^homelist$', views.homelistJSON, name='homelistJSON'), #AJAX
    url(r'^meal/(?P<mealid>[0-9]+)/$', views.mealdetail, name='detail'), #PAGE
    url(r'^mealjson$',views.mealdetailJSON, name='detailJSON'), #AJAX
    url(r'^about$',views.AboutPage, name='about'), #PAGE
    url(r'^contact$',views.ContactPage, name='contact'), #PAGE
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
