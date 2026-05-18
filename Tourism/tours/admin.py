from django.contrib import admin
from .models import Tour, TourPlace


class TourPlaceInline(admin.TabularInline):
    model = TourPlace
    extra = 1


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'title',
        'user',
        'created_at'
    )

    inlines = [TourPlaceInline]


admin.site.register(TourPlace)