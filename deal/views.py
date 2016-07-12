import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .models import Meal, MealPhoto, MealCatalog, MealTheme, css_themes
from .models import OrderBook, Purchase
from django.core.urlresolvers import reverse
from django_ajax.decorators import ajax

# Create your views here.

def menulist(request):
    catalog = MealCatalog.objects.all()
    theme = MealTheme.objects.all()[:1]
    context = {'catalog':catalog,'theme':theme}
    if theme and theme[0].themecolor >= 0:
        i = theme[0].themecolor
        context.update({'colorcss':'deal/'+css_themes[i]+'.css'})
    return render(request, 'deal/menu.html', context)

def meallistJSON(dishes, cat):
    dishlist = []
    for dish in dishes:
        zhtitle = dish.zhtitle
        entitle = dish.entitle
        itemid = '%06d'%dish.id
        trackid = dish.id
        photoid = dish.photoid.url
        price = dish.price
        punit = dish.unit
        calorie = dish.cal
        cunit = dish.cunit
        detail = reverse('deal:detail',args=[trackid])
        entry = {'zhtitle':zhtitle, 'entitle': entitle, 'itemid':itemid,
                'trackid':trackid, 'photoid':photoid, 'price':price,
                'punit':punit, 'calorie':calorie, 'cunit':cunit,'detail':detail}
        dishlist.append(entry)
    dishlistres = {'dishlist':dishlist}
    if cat:
        catn = cat.name
        catd = cat.desc
        dishlistres.update({'catn':catn,'catd':catd})

    return dishlistres

def meallist(request):
    sort = request.GET.get('sort')
    cat = int(request.GET.get('cat'))
    catalog = None
    #JSON Response
    if cat == None or cat == -1:
        cat = -1
        dishes = Meal.objects.filter(display__gt = 0)
    else:
        dishes = Meal.objects.filter(catalog__id = cat, display__gt = 0)
        catalog = MealCatalog.objects.get(pk=cat)
    if sort == None or sort == 'phl':
        dishes = dishes.order_by('-price')
    else:
        dishes = dishes.order_by('price')

    context = meallistJSON(dishes, catalog)
    return JsonResponse(context)

def homelistJSON(request):
    recommend = []
    dishes = Meal.objects.filter(display = 2)
    for dish in dishes:
        zhtitle = dish.zhtitle
        entitle = dish.entitle
        itemid = '%06d'%dish.id
        trackid = dish.id
        photoid = dish.photoid.url
        price = dish.price
        punit = dish.unit
        calorie = dish.cal
        cunit = dish.cunit
        desp = dish.desc
        detail = reverse('deal:detail',args=[trackid])
        entry = {'zhtitle':zhtitle, 'entitle': entitle, 'itemid':itemid,
                'trackid':trackid, 'photoid':photoid, 'price':price,
                'punit':punit, 'calorie':calorie, 'cunit':cunit, 'desp':desp,
                'detail':detail}
        recommend.append(entry)
    jcontext = {'recommend':recommend}
    return JsonResponse(jcontext)

def homelist(request):
    catalog = MealCatalog.objects.all()
    theme = MealTheme.objects.all()[:1]
    context = {'catalog':catalog,'theme':theme}
    if theme and theme[0].themecolor >= 0:
        i = theme[0].themecolor
        context.update({'colorcss':'deal/'+css_themes[i]+'.css'})
    return render(request, 'deal/home.html', context)

def mealdetail(request, mealid):
    mealid = int(mealid)
    theme = MealTheme.objects.all()[:1]
    try:
        dish = Meal.objects.get(pk = mealid)
        itemid = '%06d'%dish.id
    except:
        dish = None
        itemid = None
    context = dict()
    if dish:
        catalog = dish.catalog.all()
        context = {'dish':dish,'itemid':itemid,'catalog':catalog,'theme':theme}
    if theme and theme[0].themecolor >= 0:
        i = theme[0].themecolor
        context.update({'colorcss':'deal/'+css_themes[i]+'.css'})
    return render(request, 'deal/detail.html', context)

def mealdetailJSON(request):
    mealid = request.GET.get('mealid')
    try:
        dish = Meal.objects.get(pk = mealid)
    except:
        dish = None
    if dish:
        photos = dish.mealphoto_set.all()
        photolist = []
        for photo in photos:
            name = photo.name
            image = photo.image.url
            pid = photo.id
            entry = {'name':name, 'image':image, 'pid':pid}
            photolist.append(entry)
        photolist = {'photos':photolist}
    return JsonResponse(photolist)

def AboutPage(request):
    theme = MealTheme.objects.all()[:1]
    context = {'theme':theme}
    if theme and theme[0].themecolor >= 0:
        i = theme[0].themecolor
        context.update({'colorcss':'deal/'+css_themes[i]+'.css'})
    return render(request, 'deal/about.html', context)
def ContactPage(request):
    theme = MealTheme.objects.all()[:1]
    context = {'theme':theme}
    if theme and theme[0].themecolor >= 0:
        i = theme[0].themecolor
        context.update({'colorcss':'deal/'+css_themes[i]+'.css'})
    return render(request, 'deal/contact.html', context)
@ajax
def SubmitOrderJSON(request):
    data = dict()
    ordersubmission = OrderBook.objects.create(address='送餐地址',
            person='收貨人名稱',contact='收貨人聯繫方式',desc='備註',)
    for key, values in request.POST.lists():
        odname, odprice, odamount, oitemid = values
        odish = Meal.objects.get(pk = int(oitemid))
        purchase = Purchase(dish=odish,transaction=ordersubmission,name=odname,
                price=float(odprice),amount=int(odamount))
        purchase.save()
    return data
