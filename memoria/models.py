from django.db import models

from django.db import models
from django.utils import timezone

class Jogo(models.Model):
    nome = models.CharField(max_length=100)
    tentativas = models.IntegerField()
    tempo = models.CharField(max_length=10)  # Tempo total em segundos
    data_hora = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['tentativas', 'tempo', '-data_hora']  # Ordenar por tentativas, tempo e data mais recente

    def __str__(self):
        return f'{self.nome} - {self.tentativas} tentativas em {self.tempo} segundos'
    
class Entry(models.Model):
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE)
    nome = models.TextField()
    data_hora = models.DateTimeField(auto_now_add=True)
    tempo = models.TimeField(auto_now_add=True)
    tentativas = models.IntegerField()
   
    class Meta:
        verbose_name_plural = 'entries'
       
    def __str__(self):
        return self.text[:50] + '...'