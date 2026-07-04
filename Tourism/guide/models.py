from django.db import models

class GuidePlace(models.Model):

    CATEGORY_CHOICES = [
        ('culture', 'Культура и история'),
        ('religion', 'Религия'),
        ('nature', 'Отдых на природе'),
        ('visit', 'Визит-центры'),
    ]

    title = models.CharField('Название', max_length=200)

    category = models.CharField(
        'Категория',
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    address = models.CharField(
        'Адрес',
        max_length=255
    )

    latitude = models.FloatField(
        'Широта',
        null=True,
        blank=True
    )

    longitude = models.FloatField(
        'Долгота',
        null=True,
        blank=True
    )

    work_time = models.CharField(
        'Часы работы',
        max_length=100,
        blank=True
    )

    price = models.CharField(
        'Стоимость',
        max_length=100,
        blank=True
    )

    phone = models.CharField(
        'Телефон',
        max_length=100,
        blank=True,
        help_text='Например: +7 (391) 227-92-04'
    )

    website = models.URLField(
        'Сайт',
        max_length=200,
        blank=True,
        help_text='Ссылка на официальный сайт'
    )

    short_description = models.TextField(
        'Краткое описание'
    )

    image = models.ImageField(
        'Фото',
        upload_to='guide/'
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Место'
        verbose_name_plural = 'Путеводитель'