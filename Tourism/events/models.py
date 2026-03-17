from django.db import models


class Event(models.Model):
    title = models.CharField('Название события', max_length=200)
    date = models.DateTimeField('Дата события')
    location = models.CharField('Место проведения', max_length=200)
    description = models.TextField('Описание события')
    image = models.ImageField('Фото события', upload_to='events/')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'
