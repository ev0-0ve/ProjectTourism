from django.db import models
from django.contrib.auth.models import User

from guide.models import GuidePlace


class Favorite(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    guide = models.ForeignKey(
        GuidePlace,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f'{self.user.username} - {self.guide.title}'

    class Meta:
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'