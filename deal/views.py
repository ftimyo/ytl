import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .models import Meal, MealPhoto, MealCatalog, MealTheme
from .models import css_themes, soptionst, typeoptionst
from .models import OrderBook, Purchase
from django.core.urlresolvers import reverse
from django_ajax.decorators import ajax
from decimal import *
from django.core.mail import send_mail
from django.template import loader
from django.contrib.auth.models import User

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
@csrf_exempt
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
        items.append([odname,odprice,odamount,oitemid])

    ordersubmission.save()
    desc = ""
    theme = MealTheme.objects.all()[:1]
    pickup = ""
    pickuplink = ""
    taxrate = float(0)
    if theme:
        pickup = theme[0].address
        pickuplink = theme[0].addresslink
        deliveryfee = theme[0].deliveryfee
        desc = theme[0].deliverydesc
        taxrate = theme[0].taxrate

    if taxrate != 0:
        data['taxrate'] = taxrate
    data['deliveryfee'] = deliveryfee
    data['deliverydesc'] = desc
    data['pickup'] = pickup
    data['pickuplink'] = pickuplink
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
@csrf_exempt
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
    staff = User.objects.filter(is_staff=True)
    email = []
    for v in staff:
        email.append(v.email)

    pickup = ""
    pickuplink = ""
    if theme:
        deliveryfee = theme[0].deliveryfee
        pickup = theme[0].address
        pickuplink = theme[0].addresslink
        taxrate = theme[0].taxrate

    name, contact, desc, addr, uemail = data['name'].strip(),data['contact'].strip(),data['desc'].strip(),data['addr'].strip(),data['uemail'].strip()
    if name == "" or contact == "":
        return {'attack': '訂餐人信息缺失'}
    if otype == 1 and addr == "":
        return {'attack': '送餐地址信息缺失'}
    try:
        trans = OrderBook.objects.get(pk=orderid)
    except:
        return {'attack':'訂單確認失敗'}
    mailcom = {'person':name,'contact':contact,'desc':desc}
    if otype == 1:
        trans.deliveryfee = Decimal(str(deliveryfee))
        mailcom.update({'deliveryfee':'CDN${:3.2f}'.format(deliveryfee)})
        mailcom.update({'addr':addr})
        data['deliveryfee'] = deliveryfee
        trans.save()
    trans.person,trans.contact,trans.address,trans.ordertype,trans.status = name,contact,addr,otype,1
    trans.save()

    purchases = Purchase.objects.filter(transaction=trans)
    items = []
    for v in purchases:
        item = [v.name, v.price, v.amount]
        items.append(item)
    data['items'] = items
    mailcom['items'] = items
    total = float(trans.totalpayment())
    if taxrate != 0:
        data['tax'] = 'CDN$'+'{:3.2f}'.format(taxrate*total)
        mailcom['tax'] = 'CDN$'+'{:3.2f}'.format(taxrate*total)
    trans.taxrate = taxrate
    trans.save()
    data['total'] = trans.totalpayment()
    mailcom.update({'total':'CDN$'+trans.totalpayment()})
    data['orderid'] = "%015d"%orderid
    data['pickup'] = pickup
    data['pickuplink'] = pickuplink
    mailcom['orderid'] = data['orderid']
    link = []
    for i in range(2,len(soptionst)):
        link.append(request.build_absolute_uri(reverse('deal:oproc',args=[str(orderid),str(i)])))
    mailcom['statuso'] = list(zip(link,soptionst[2:]))
    mailcom['statusr'] = request.build_absolute_uri(reverse('deal:oproc',args=[str(orderid),str(len(soptionst))]))
    mkmessage = loader.render_to_string('deal/cookemail.html',mailcom)
    if uemail:
        umailcom = mailcom
        umailcom['statusr'] = request.build_absolute_uri(reverse('deal:uoretr',args=[str(orderid),]))
        if pickup and pickuplink:
            umailcom['pickup'],umailcom['pickuplink'] = pickup,pickuplink
        umkmessage = loader.render_to_string('deal/customeremail.html',umailcom)
        try:
            send_mail(subject='訂單 '+ data['orderid'],
                    message=umkmessage,
                    from_email="",
                    recipient_list= [uemail,],
                    html_message=umkmessage,
                    fail_silently=False,)
            data['fullsuccess'] = '訂單確認郵件已發送至 "' + uemail + '"'
        except:
            data['warning'] = '電郵地址"'+uemail+'"錯誤 --- 訂單確認郵件發送失敗';
    if len(email) != 0:
        send_mail(subject='新的訂單 '+ data['orderid'],
                message=mkmessage,
                from_email="",
                recipient_list= email,
                html_message=mkmessage,
                fail_silently=False,)
    return data
def ProcOrder(request,orderid,status):
    try:
        orderid, status = int(orderid), int(status)
        trans = OrderBook.objects.get(pk=orderid)
    except:
        return HttpResponse(status=404)
    if status < 2 or status >len(soptionst):
        return HttpResponse(status=404)
    if status == len(soptionst):
        ret = '<html><body><h1 style="font-size:88px;">訂單%015d'%orderid+'<br/>當前狀態為:<br/>『'+soptionst[trans.status]+'』</h1></body></html>'
        return HttpResponse(ret)

    trans.status = status
    trans.save()
    ret = '<html><body><h1 style="font-size:88px;">訂單%015d'%orderid+'<br/>狀態已更新為:<br/>『'+soptionst[status]+'』</h1></body></html>'
    return HttpResponse(ret)

def RetrieveOrder(request,orderid):
    try:
        orderid = int(orderid)
        trans = OrderBook.objects.get(pk=orderid)
    except:
        return HttpResponse(status=404)
    ret = '<html><body><h1 style="font-size:88px;">訂單%015d'%orderid+'<br/>當前狀態為:<br/>『'+soptionst[trans.status]+'』</h1></body></html>'
    return HttpResponse(ret)
