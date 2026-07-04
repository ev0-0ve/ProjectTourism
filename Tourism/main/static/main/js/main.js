// 1. РЕДАКТИРОВАНИЕ В ПРОФИЛЕ (Глобальная функция)
function toggleEdit(show) {
    const viewElems = document.querySelectorAll('.view-mode');
    const editElems = document.querySelectorAll('.edit-mode');
    viewElems.forEach(el => el.style.setProperty('display', show ? 'none' : 'block', 'important'));
    editElems.forEach(el => el.style.setProperty('display', show ? 'block' : 'none', 'important'));
}

// ============================================
// TOAST / УВЕДОМЛЕНИЕ ДЛЯ НЕАВТОРИЗОВАННЫХ (ГЛОБАЛЬНЫЕ ФУНКЦИИ)
// ============================================

// Функция для показа уведомления
window.showAuthToast = function() {
    const toast = document.getElementById('authToast');
    if (toast) {
        toast.classList.add('active');

        // Автоматическое скрытие через 8 секунд
        clearTimeout(toast._hideTimeout);
        toast._hideTimeout = setTimeout(function() {
            window.hideAuthToast();
        }, 8000);
    }
};

// Функция для скрытия уведомления
window.hideAuthToast = function() {
    const toast = document.getElementById('authToast');
    if (toast) {
        toast.classList.remove('active');
        clearTimeout(toast._hideTimeout);
    }
};

document.addEventListener('DOMContentLoaded', function() {

    // --- Вспомогательная функция: Получение CSRF токена ---
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // --- Боковая панель ---
    const sidePanel = document.querySelector('.side-panel');
    const sideToggle = document.querySelector('.side-toggle');
    const sideWrapper = document.querySelector('.side-wrapper');

    if (
        sideToggle &&
        sidePanel &&
        window.innerWidth > 768
    )
    {
        // Страницы, где панель должна быть открыта (НЕ свернута)
        const isHome = document.body.classList.contains('home-page');
        const isAuthPage = document.body.classList.contains('auth-page');

        const shouldBeOpen = isHome || isAuthPage;

        if (!shouldBeOpen) {
            sidePanel.classList.add('collapsed');
            sideWrapper.classList.add('collapsed');
        }

        sideToggle.addEventListener('click', () => {
            sidePanel.classList.toggle('collapsed');
            sideWrapper.classList.toggle('collapsed');
        });
    }

    const mobileMenuBtn =
        document.getElementById('mobileMenuBtn');

    if (
        mobileMenuBtn &&
        sidePanel &&
        sideWrapper
    ) {

        mobileMenuBtn.addEventListener('click', function(e){

            e.stopPropagation();

            sidePanel.classList.toggle('mobile-open');

            sideWrapper.classList.toggle('mobile-open');

            document.body.classList.toggle('no-scroll');

        });

        document.addEventListener('click', function(e){

            if (
                window.innerWidth <= 768 &&
                !e.target.closest('.side-panel') &&
                !e.target.closest('#mobileMenuBtn')
            ) {

                sidePanel.classList.remove('mobile-open');

                sideWrapper.classList.remove('mobile-open');

                document.body.classList.remove('no-scroll');
            }

        });

    }

    // --- AJAX: Проверка Email ---
    const emailInput = document.getElementById('email-input');
    const emailMessage = document.getElementById('email-message');

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            let emailData = 'email=' + encodeURIComponent(this.value);
            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/user/ajax/check_email/', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    emailMessage.innerHTML = JSON.parse(xhr.responseText).message;
                }
            };
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            xhr.send(emailData);
        });
    }

    // СОЗДАНИЕ ЗАМЕТКИ
    const openBtn = document.getElementById('openNoteFormBtn');
    const closeBtn = document.getElementById('closeNoteFormBtn');
    const form = document.getElementById('noteCreateForm');

    if(openBtn && closeBtn && form){

        openBtn.addEventListener('click', () => {
            form.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            form.classList.remove('active');
        });

    }
    // Сохранение заметки авто
    const editableNotes = document.querySelectorAll(
        '.note-edit-title, .note-edit-text'
    );

    editableNotes.forEach(field => {

        field.addEventListener('input', function(){

            clearTimeout(this.saveTimeout);

            this.saveTimeout = setTimeout(() => {

                const noteId = this.dataset.noteId;

                const noteWrapper = this.closest('.note-card-custom');

                const title = noteWrapper.querySelector(
                    '.note-edit-title'
                ).value;

                const text = noteWrapper.querySelector(
                    '.note-edit-text'
                ).value;

                fetch('/user/note/update/' + noteId + '/', {

                    method:'POST',

                    headers:{
                        'Content-Type':'application/json',
                        'X-CSRFToken':getCookie('csrftoken')
                    },

                    body:JSON.stringify({
                        title:title,
                        text:text
                    })

                });

            }, 600);

        });

    });

    // --- AJAX: Удаление заметки ---
    const deleteButtons = document.querySelectorAll('.delete-note-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (!confirm('Удалить заметку?')) return;

            const noteId = this.getAttribute('data-note-id');
            const xhr = new XMLHttpRequest();
            const url = '/user/note/delete/' + noteId + '/';

            console.log('Попытка удаления по адресу:', url);

            xhr.open('POST', url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const noteElement = document.getElementById('note-' + noteId);
                        if (noteElement) {
                            noteElement.remove();
                            alert('Заметка успешно удалена!');
                        }
                    } else {
                        console.error('Ошибка! Сервер ответил:', xhr.status);
                        alert('Ошибка ' + xhr.status + ': Проверьте консоль терминала Django.');
                    }
                }
            };
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            xhr.send();
        });
    });

    // --- Формы: Авторасширение Textarea ---
    const textareas = document.querySelectorAll('textarea');

    textareas.forEach(textarea => {

        const resize = () => {

            textarea.style.height = 'auto';

            textarea.style.height = textarea.scrollHeight + 'px';
        };

        resize();

        textarea.addEventListener('input', resize);

    });

    // --- Авторизация: Клик и интерактивный предпросмотр аватара ---
    const uploadZone = document.getElementById("avatarUploadZone");
    const fileInput = document.querySelector('input[type="file"]');
    const previewImg = document.getElementById("avatarPreview");
    const plusSign = document.getElementById("plusSign");

    if (uploadZone && fileInput) {
        uploadZone.addEventListener("click", function() {
            fileInput.click();
        });

        fileInput.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewImg) {
                        previewImg.src = e.target.result;
                        previewImg.style.display = "block";
                    }
                    if (plusSign) {
                        plusSign.style.display = "none";
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Авторизация: Интеллектуальный маппинг плейсхолдеров Django под Figma ---
    const authInputs = document.querySelectorAll(".auth-form-container input:not([type='checkbox']):not([type='file'])");

    authInputs.forEach(input => {
        const name = input.name.toLowerCase();

        if (name.includes("username") || name.includes("user")) {
            input.setAttribute("placeholder", "Имя пользователя");
        } else if (name.includes("email") || name.includes("mail")) {
            input.setAttribute("placeholder", "Email");
        } else if (name.includes("birthday") || name.includes("date") || name.includes("birth")) {
            input.setAttribute("placeholder", "Дата рождения");
        } else if (name.includes("country") || name.includes("residence") || name.includes("city")) {
            input.setAttribute("placeholder", "Страна проживания");
        } else if (name.includes("password") && (name.includes("confirm") || name.includes("repeat") || name.includes("2"))) {
            input.setAttribute("placeholder", "Повторите пароль");
        } else if (name.includes("password")) {
            input.setAttribute("placeholder", "Придумайте пароль");
        } else if (name.includes("phone") || name.includes("tel")) {
            input.setAttribute("placeholder", "Телефон");
        }
    });

    const tourDataElement = document.getElementById('tour-data');
    const mapElement = document.getElementById('map');

    if(tourDataElement && mapElement){

        const data = JSON.parse(
            tourDataElement.textContent
        );

        const map = L.map('map').setView(
            [56.0153, 92.8932],
            11
        );
        map.attributionControl.setPrefix('');

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; OpenStreetMap'
            }
        ).addTo(map);

        const points = [];

        data.forEach(place => {

            L.marker([
                place.lat,
                place.lng
            ]).addTo(map);

            points.push([
                place.lat,
                place.lng
            ]);

        });

        if(points.length > 1){

            L.polyline(
                points,
                {
                    color:'blue'
                }
            ).addTo(map);

            map.fitBounds(points);

        }

    }

    // === 2. ДВА ПОПАПА И ВКЛАДКИ ===
    const btnObjects = document.getElementById('searchObjectsBtn');
    const btnTours = document.getElementById('searchToursBtn');
    const contentObjects = document.getElementById('objects-content');
    const contentTours = document.getElementById('tours-content');

    const popupObjects = document.getElementById('filterPopupObjects');
    const popupTours = document.getElementById('filterPopupTours');

    // Клик по вкладке или её воронке
    if (btnObjects && btnTours) {
        btnObjects.addEventListener('click', function(e) {
            if (e.target.closest('.funnel-icon')) {
                e.stopPropagation();
                popupObjects.classList.toggle('active');
                if(popupTours) popupTours.classList.remove('active');
                return;
            }
            this.classList.add('active');
            btnTours.classList.remove('active');
            contentObjects.style.display = 'block';
            contentTours.style.display = 'none';
            if(popupTours) popupTours.classList.remove('active');
        });

        btnTours.addEventListener('click', function(e) {
            if (e.target.closest('.funnel-icon')) {
                e.stopPropagation();
                popupTours.classList.toggle('active');
                if(popupObjects) popupObjects.classList.remove('active');
                return;
            }
            this.classList.add('active');
            btnObjects.classList.remove('active');
            contentObjects.style.display = 'none';
            contentTours.style.display = 'block';
            if(popupObjects) popupObjects.classList.remove('active');
        });
    }

    // Закрытие попапов при клике мимо них
    document.addEventListener('click', function(e) {
        if (popupObjects && popupObjects.classList.contains('active')) {
            if (!popupObjects.contains(e.target) && !e.target.closest('#searchObjectsBtn')) {
                popupObjects.classList.remove('active');
            }
        }
        if (popupTours && popupTours.classList.contains('active')) {
            if (!popupTours.contains(e.target) && !e.target.closest('#searchToursBtn')) {
                popupTours.classList.remove('active');
            }
        }
    });

    // Блокируем закрытие при клике внутри попапа
    if(popupObjects) popupObjects.addEventListener('click', e => e.stopPropagation());
    if(popupTours) popupTours.addEventListener('click', e => e.stopPropagation());


    // === 3. УМНАЯ ФИЛЬТРАЦИЯ СТОИМОСТИ И КАТЕГОРИЙ (Объекты) ===

    // Функция: вытаскивает реальную цену из сложной строки (игнорирует года и детский возраст)
    function parseRealPrice(textString) {
        if (!textString) return 0;
        const numbers = textString.match(/\d+/g);
        if (!numbers) return 0;

        for (let num of numbers) {
            let val = parseInt(num, 10);
            // Если число больше 50 (это не возраст 5-17 лет) и не равно текущему году (2026)
            if (val > 50 && val < 2000) return val;
            if (val > 2050) return val;
        }
        // Если ничего не подошло, берем первое число
        return parseInt(numbers[0], 10);
    }

    const priceFromObj = document.getElementById('priceFromObj');
    const priceToObj = document.getElementById('priceToObj');
    const categoryRadiosObj = document.querySelectorAll('input[name="categoryObj"]');
    const resetObjBtn = document.getElementById('resetFilterObjBtn');
    const objectCards = document.querySelectorAll('#guideGridObjects .guide-card');

    function filterObjects() {
        const minPrice = parseInt(priceFromObj.value) || 0;
        const maxPrice = parseInt(priceToObj.value) || Infinity;

        let selectedCategory = 'all';
        categoryRadiosObj.forEach(radio => {
            if (radio.checked) selectedCategory = radio.value;
        });

        objectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const rawPriceText = card.getAttribute('data-price');
            const cardPrice = parseRealPrice(rawPriceText);

            const matchesCategory = (selectedCategory === 'all' || cardCategory === selectedCategory);
            const matchesPrice = (cardPrice >= minPrice && cardPrice <= maxPrice);

            if (matchesCategory && matchesPrice) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Слушатели фильтров
    if(priceFromObj) priceFromObj.addEventListener('input', filterObjects);
    if(priceToObj) priceToObj.addEventListener('input', filterObjects);
    categoryRadiosObj.forEach(radio => radio.addEventListener('change', filterObjects));

    // Сброс фильтров
    if (resetObjBtn) {
        resetObjBtn.addEventListener('click', () => {
            if(priceFromObj) priceFromObj.value = '';
            if(priceToObj) priceToObj.value = '';
            document.querySelector('input[name="categoryObj"][value="all"]').checked = true;
            filterObjects();
            popupObjects.classList.remove('active');
        });
    }

    // === 4. РАСКРЫТИЕ КАРТОЧЕК ===
    function initCardToggle(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const cards = container.querySelectorAll('.guide-card');

        cards.forEach(card => {
            // Убираем все старые обработчики
            card.removeEventListener('click', card._clickHandler);

            // Создаем новый обработчик
            card._clickHandler = function(e) {
                // Не раскрываем при клике на кнопки и стрелки
                if (e.target.closest('.guide-icon-btn') || e.target.closest('.guide-nav-arrow')) {
                    return;
                }

                // Закрываем все остальные карточки в этом же контейнере
                cards.forEach(c => {
                    if (c !== this) {
                        c.classList.remove('active');
                    }
                });

                // Переключаем текущую
                this.classList.toggle('active');
            };

            card.addEventListener('click', card._clickHandler);
        });
    }

    // Инициализация для каждой страницы (ВНЕ document.addEventListener)
    // Для Путеводителя
    const guideGrid = document.getElementById('guideGridObjects');
    if (guideGrid) {
        initCardToggle('#guideGridObjects');
    }

    // Для Избранного
    const favoritesGrid = document.querySelector('.favorites-grid');
    if (favoritesGrid) {
        initCardToggle('.favorites-grid');
    }

    // Для Событий (если нет guideGridObjects, но есть guide-grid)
    if (!document.getElementById('guideGridObjects')) {
        const eventsGrid = document.querySelector('.guide-grid');
        if (eventsGrid) {
            initCardToggle('.guide-grid');
        }
    }

    // Закрытие карточек при клике вне их
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.guide-card')) {
            document.querySelectorAll('.guide-card.active').forEach(c => {
                c.classList.remove('active');
            });
        }
    });

    // ======================================
    // МЕНЮ ТУРОВ
    // ======================================

    const menuBtn = document.getElementById('tourMenuButton');
    const dropdown = document.getElementById('tourDropdown');

    if(menuBtn && dropdown){

        menuBtn.addEventListener('click', function(e){

            e.stopPropagation();

            dropdown.classList.toggle('active');

            const favoritesDropdown = document.getElementById('favoritesDropdown');

            if(favoritesDropdown){
                favoritesDropdown.classList.remove('active');
            }

        });

    }

    // ======================================
    // ИЗБРАННОЕ
    // ======================================

    const favoritesBtn = document.getElementById('favoritesOpenBtn');
    const favoritesDropdown = document.getElementById('favoritesDropdown');

    if(favoritesBtn && favoritesDropdown){

        favoritesBtn.addEventListener('click', function(e){

            e.stopPropagation();

            favoritesDropdown.classList.toggle('active');

            if(dropdown){
                dropdown.classList.remove('active');
            }

        });

    }

    // ======================================
    // ЗАКРЫТИЕ DROPDOWN ПРИ КЛИКЕ ВНЕ
    // ======================================

    document.addEventListener('click', function(e){

        if(dropdown && !e.target.closest('.tour-dropdown-wrapper')){
            dropdown.classList.remove('active');
        }

        if(favoritesDropdown && !e.target.closest('.favorites-wrapper')){
            favoritesDropdown.classList.remove('active');
        }

    });

    // ======================================
    // РЕДАКТИРОВАНИЕ ТУРА
    // ======================================

    const editButtons = document.querySelectorAll('.edit-tour-btn');

    editButtons.forEach(button => {

        button.addEventListener('click', function(){

            const row = this.closest('.tour-dropdown-row');

            row.classList.add('editing');

        });

    });

    const cancelButtons = document.querySelectorAll('.cancel-tour-btn');

    cancelButtons.forEach(button => {

        button.addEventListener('click', function(){

            const row = this.closest('.tour-dropdown-row');

            row.classList.remove('editing');

        });

    });

    const noteImageInput = document.getElementById('noteImageInput');
    if (noteImageInput) {
        noteImageInput.addEventListener('change', function(event) {
            const input = event.target;
            const previewContainer = document.getElementById('imagePreviewContainer');
            const previewImage = document.getElementById('imagePreview');

            if (input.files && input.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    if (previewImage) {
                        previewImage.src = e.target.result;
                    }
                    if (previewContainer) {
                        previewContainer.style.display = 'block';
                    }
                }

                reader.readAsDataURL(input.files[0]);
            }
        });
    }

    // ============================================
    // TOAST / УВЕДОМЛЕНИЕ ДЛЯ НЕАВТОРИЗОВАННЫХ
    // ============================================

    // Закрытие по крестику
    const closeCrossBtn = document.getElementById('closeAuthToast');
    if (closeCrossBtn) {
        closeCrossBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // ПРЯМОЕ СКРЫТИЕ БЕЗ ВЫЗОВА ФУНКЦИИ
            const toast = document.getElementById('authToast');
            if (toast) {
                toast.classList.remove('active');
                clearTimeout(toast._hideTimeout);
            }
        });
    }
});