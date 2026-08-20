from django.core.paginator import Paginator, PageNotAnInteger
from django.http import HttpResponseNotFound
from django.shortcuts import HttpResponse, render
from django.views import View
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views.generic import TemplateView, ListView


def index(request):
    return HttpResponse('Welcome to Globomantics e-commerce store.')


def detail(request):
    return HttpResponse("Details page")


@csrf_exempt
@cache_page(900)
@require_http_methods(["GET"])
def electronics(request):
    items = ("Windows PC", "Apple Mac", "Apple iPhone", "Lenovo", "Samsung")
    if request.method == 'GET':
        paginator = Paginator(items, 2)
        pages = request.GET.get('page', 1)
        name = "Sharu"

        try:
            items = paginator.page(pages)
        except PageNotAnInteger:
            items = paginator.page(1)

        if not request.session.has_key('customer'):
            request.session['customer'] = name
            print("Session value set.")

        response = render(request, 'store/list.html', {'items': items})
        if request.COOKIES.get('visits'):
            value = int(request.COOKIES.get('visits'))
            print("Getting cookie.")
            response.set_cookie('visits', value + 1)
        else:
            value = 1
            print("Setting cookie.")
            response.set_cookie('visits', value)
        return response
        # return render(request, 'store/list.html', {'items': items})
    elif request.method == 'POST':
        return HttpResponseNotFound("POST method is not supported")


class ElectronicsView(View):
    def get(self, request):
        items = ("Windows PC", "Apple Mac", "Apple iPhone", "Lenovo", "Samsung")
        paginator = Paginator(items, 2)
        pages = request.GET.get('page', 1)
        self.process()
        try:
            items = paginator.page(pages)
        except PageNotAnInteger:
            items = paginator.page(1)
        return render(request, 'store/list.html', {'items': items})

    def process(self):
        print("We are processing Electronics!")


class ElectronicsView2(TemplateView):
    template_name = 'store/list.html'
    def get_context_data(self, **kwargs):
        items = ("Windows PC", "Apple Mac", "Apple iPhone", "Lenovo", "Samsung")
        context = {'items': items}
        return context


class ElectronicsView3(ListView):
    template_name = 'store/list.html'
    queryset = ("Windows PC", "Apple Mac", "Apple iPhone", "Lenovo", "Samsung")
    context_object_name = 'items'
    paginate_by = 2


class ComputersView(ElectronicsView):
    pass
    # def process(self):
    #     print("We are processing Computers")


class MobileView():
    pass
    # def process(self):
    #     print("We are processing Mobile phones")


class EquipmentView(MobileView, ComputersView):
    pass

def logout(request):
    try:
        del request.session['customer']
    except KeyError:
        print("Error while logging out")
    return HttpResponse("Successfully logged out!")