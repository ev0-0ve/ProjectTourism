from django.db import models


class Event(models.Model):
    title = models.CharField('Название события', max_length=200)
    date_start = models.DateField('Дата начала')
    date_end = models.DateField('Дата окончания', blank=True, null=True)
    location = models.CharField('Место проведения', max_length=200)
    description = models.TextField('Описание события', blank=True)

    price = models.CharField('Вход', max_length=100, blank=True, default='Вход свободный')
    source_link = models.URLField('Подробнее по ссылке', blank=True)
    image = models.ImageField('Фото события', upload_to='events/')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'
