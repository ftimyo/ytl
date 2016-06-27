from django.shortcuts import render
from .models import Meal, MealPhoto

# Create your views here.

def index(request):
    dishes = Meal.objects.all()
    context = {'dishes':dishes,}
    return render(request, 'deal/index.html', context)
