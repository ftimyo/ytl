import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .models import Meal, MealPhoto, MealCatalog, MealTheme
from .models import css_themes, soptionst, typeoptionst
from .models import OrderBook, Purchase
from django.core.urlresolvers import reverse
from django_ajax.decorators import ajax
from decimal import *

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
    data = {}
    items = []
    ordersubmission = OrderBook.objects.create(address='送餐地址',
            person='收貨人名稱',contact='收貨人聯繫方式',desc='備註',)
    desc = ""
    deliveryfee = float(0)
    for key, values in request.POST.lists():
        #check submission
        try:
            odname, odprice, odamount, oitemid = values
            odprice = float(odprice)
            oitemid = int(oitemid)
            odamount = int(odamount)
            odish = Meal.objects.get(pk = oitemid)
        except:
            return data
        if odprice != odish.price or odamount <= 0 or odname != odish.zhtitle:
            return data
        #check finished
        purchase = Purchase(dish=odish,transaction=ordersubmission,name=odname, price=float(odprice),amount=int(odamount))
        purchase.save()
        desc += odname + ' '+ u'\u00D7' + str(odamount) + ' ------------- CDN$ ' + str(odprice*odamount) + '<br/>'
        items.append([odname,odprice,odamount,oitemid])

    ordersubmission.desc = desc
    ordersubmission.save()
    desc = ""
    theme = MealTheme.objects.all()[:1]
    if theme:
        deliveryfee = theme[0].deliveryfee
        desc = theme[0].deliverydesc

    data['deliveryfee'] = deliveryfee
    data['deliverydesc'] = desc
    data['total'] = ordersubmission.totalpayment()
    data['items'] = items
    data['orderid'] = ordersubmission.id
    data['sopt'] = soptionst[ordersubmission.status]
    data['topt'] = zip(range(0,len(typeoptionst)),typeoptionst)
    return data
'''
data['otype'] = iot.value;data['name'] = iname.value;data['addr']=iaddr.value;
data['contact']=icontact.value;data['desc']=idesc.value;data['orderid']=ioid;
'''
@ajax
def PlaceOrderJSON(request):
    data = {}
    for key, value in request.POST.items():
        data[key] = value
    #check for attack
    try:
        otype,orderid = int(data['otype']), int(data['orderid'])
    except:
        return {'attack':'訂單確認失敗'}

    deliveryfee = float(0)
    taxrate = float(0)
    theme = MealTheme.objects.all()[:1]
    if theme:
        deliveryfee = theme[0].deliveryfee
        taxrate = theme[0].taxrate

    name, contact, desc, addr = data['name'], data['contact'], data['desc'],data['addr']
    if name == "" or contact == "":
        return {'attack': '訂餐人信息缺失'}
    if otype == 1 and addr == "":
        return {'attack': '送餐地址信息缺失'}
    try:
        trans = OrderBook.objects.get(pk=orderid)
    except:
        return {'attack':'訂單確認失敗'}
    trans.taxrate = taxrate
    if otype == 1:
        trans.deliveryfee = Decimal(str(deliveryfee))
        trans.desc += '<em>送餐費</em> ------------- CDN${:5.2f}'.format(deliveryfee)+'<br/>'
        data['deliveryfee'] = deliveryfee
        trans.save()
    trans.desc += '<strong>總計</strong> ------------- CDN$'+trans.totalpayment()+'<br/>'
    trans.person,trans.contact,trans.address,trans.ordertype,trans.status = name,contact,addr,otype,1
    if desc != "":
        trans.desc += '備註:<br/>' + desc + '<br/>'
    trans.save()
    purchases = Purchase.objects.filter(transaction=trans)
    items = []
    for v in purchases:
        item = [v.name, v.price, v.amount]
        items.append(item)
    data['items'] = items
    data['total'] = trans.totalpayment()
    data['orderid'] = "%015d"%orderid
    return data
