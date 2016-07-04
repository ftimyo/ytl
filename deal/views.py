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
        entry = {'zhtitle':zhtitle}
        dishlist.append(entry)
    dishlistres = {'dishlist':dishlist}
    return dishlistres

def meallist(request):
    dishes = Meal.objects.all()
    sort = request.GET.get('sort')
    print("sort is "+sort)
    if sort == 'phl':
        dishes = dishes.order_by('-price')
    else:
        dishes = dishes.order_by('price')

    context = meallistJSON(dishes)
    return JsonResponse(context)

    '''
    context = {'dishes':dishes}
    return render(request, 'deal/meallist.html', context)
    '''

