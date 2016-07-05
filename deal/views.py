import json
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .models import Meal, MealPhoto, MealCatalog

# Create your views here.

def index(request):
    catalog = MealCatalog.objects.all()
    context = {'catalog':catalog}
    return render(request, 'deal/index.html', context)

def meallistJSON(dishes):
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
        entry = {'zhtitle':zhtitle, 'entitle': entitle, 'itemid':itemid,
                'trackid':trackid, 'photoid':photoid, 'price':price,
                'punit':punit, 'calorie':calorie, 'cunit':cunit}
        dishlist.append(entry)
    dishlistres = {'dishlist':dishlist}
    return dishlistres

def meallist(request):
    sort = request.GET.get('sort')
    cat = int(request.GET.get('cat'))
    #JSON Response
    if cat == None or cat == -1:
        cat = -1
        dishes = Meal.objects.filter(display__gt = 0)
    else:
        dishes = Meal.objects.filter(catalog__id = cat, display__gt = 0)
    print("cat id "+str(cat))
    print(dishes)
    if sort == None or sort == 'phl':
        dishes = dishes.order_by('-price')
    else:
        dishes = dishes.order_by('price')

    context = meallistJSON(dishes)
    return JsonResponse(context)
