from datetime import timezone
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Jogo
from django.utils import timezone

def index(request):
    return render(request, 'memoria/index.html')

# def ranking(request):
#     return render(request, 'memoria/ranking.html')

# def jogos(request):
#     return render(request, 'memoria/jogos.html')

@csrf_exempt 
def jogo(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        tentativas = int(request.POST.get('tentativas'))
        tempo = (request.POST.get('tempo'))
        data_hora = timezone.now()

        # Salva a partida no banco de dados
        jogo = Jogo.objects.create(nome=nome, tentativas=tentativas, tempo=tempo, data_hora=data_hora)
        jogo.save()

        return redirect(ranking)
    
    # Se for uma requisição GET, renderiza a página do jogo
    return render(request, 'memoria/jogo.html')

def ranking(request):
    jogos = Jogo.objects.all().order_by('tentativas', 'tempo', '-data_hora')  # Ordena por tentativas, tempo e data
    context = {
        'jogos': jogos
    }
    return render(request, 'memoria/ranking.html', context)