// 1. РЕДАКТИРОВАНИЕ В ПРОФИЛЕ (Глобальная функция)
function toggleEdit(show) {
    const viewElems = document.querySelectorAll('.view-mode');
    const editElems = document.querySelectorAll('.edit-mode');
    viewElems.forEach(el => el.style.setProperty('display', show ? 'none' : 'block', 'important'));
    editElems.forEach(el => el.style.setProperty('display', show ? 'block' : 'none', 'important'));
}

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

    if (sideToggle && sidePanel) {
        const isHome = document.body.classList.contains('home-page');

        if (!isHome) {
            sidePanel.classList.add('collapsed');
            sideWrapper.classList.add('collapsed');
        }

        sideToggle.addEventListener('click', () => {
            sidePanel.classList.toggle('collapsed');
            sideWrapper.classList.toggle('collapsed');
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

    // --- Путеводитель / События / Избранное: Раскрытие карточек ---
    const guideCards = document.querySelectorAll('.guide-card');

    guideCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Если кликнули на крестик, любую кнопку или ссылку внутри карточки — не переключаем класс active
            if (
                e.target.closest('.guide-icon-btn') ||
                e.target.closest('.guide-icon-btn-low') ||
                e.target.closest('a') ||
                e.target.closest('button')
            ) {
                return;
            }

            guideCards.forEach(c => {
                if (c !== this) {
                    c.classList.remove('active');
                }
            });

            this.classList.toggle('active');
        });
    });

    // --- Путеводитель: Фильтр Popup ---
    const filterBtn = document.getElementById('filterBtn');
    const filterPopup = document.getElementById('filterPopup');

    if (filterBtn && filterPopup) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterPopup.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!filterPopup.contains(e.target)) {
                filterPopup.classList.remove('active');
            }
        });
    }

    // --- Путеводитель: Поиск по карточкам ---
    const searchInput = document.getElementById('guideSearch');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const value = this.value.toLowerCase();
            guideCards.forEach(card => {
                const title = card.querySelector('.guide-card-title')
                    .textContent
                    .toLowerCase();

                if (title.includes(value)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- Путеводитель: Фильтрация по категориям ---
    const categoryInputs = document.querySelectorAll('input[name="category"]');

    categoryInputs.forEach(input => {
        input.addEventListener('change', function () {
            const category = this.value;
            guideCards.forEach(card => {
                if (card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
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

document.getElementById('noteImageInput').addEventListener('change', function(event) {
    const input = event.target;
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block'; // Показываем контейнер с фото
        }

        reader.readAsDataURL(input.files[0]); // Читаем файл как URL
    }
});

});