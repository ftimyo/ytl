from django.shortcuts import render
from django.http import HttpResponse
from .models import Meal, MealPhoto

# Create your views here.

def index(request):
    context = dict()
    return render(request, 'deal/index.html', context)

def meallist(request):
    dishes = Meal.objects.all()
    sort = request.GET.get('sort')
    print("sort is "+sort)
    if sort == 'phl':
        dishes = dishes.order_by('-price')
    else:
        dishes = dishes.order_by('price')

    context = {'dishes':dishes,}

    return render(request, 'deal/meallist.html', context)
    '''
    sort = request.POST.get('sort')
    return HttpResponse("success!" + sort)
    '''
