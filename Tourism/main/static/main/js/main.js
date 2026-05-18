// ==========================================================================
// 1. РЕДАКТИРОВАНИЕ В ПРОФИЛЕ (Глобальная функция)
// ==========================================================================
function toggleEdit(show) {
    const viewElems = document.querySelectorAll('.view-mode');
    const editElems = document.querySelectorAll('.edit-mode');
    viewElems.forEach(el => el.style.setProperty('display', show ? 'none' : 'block', 'important'));
    editElems.forEach(el => el.style.setProperty('display', show ? 'block' : 'none', 'important'));
}

// ==========================================================================
// 2. ОСНОВНАЯ ЛОГИКА ИНИЦИАЛИЗАЦИИ ИНТЕРФЕЙСА
// ==========================================================================
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

    if (sideToggle && sidePanel) {
        const isHome = document.body.classList.contains('home-page');

        if (!isHome) {
            sidePanel.classList.add('collapsed');
        }

        sideToggle.addEventListener('click', () => {
            sidePanel.classList.toggle('collapsed');
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
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
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

    const menuBtn = document.getElementById('tourMenuButton');
    const dropdown = document.getElementById('tourDropdown');

    menuBtn.addEventListener('click', () => {
        dropdown.classList.toggle('active');
    });

    const modal = document.getElementById('favoritesModal');

    document.getElementById('favoritesOpenBtn')
    .addEventListener('click', () => {
        modal.classList.add('active');
    });

    document.getElementById('favoritesCloseBtn')
    .addEventListener('click', () => {
        modal.classList.remove('active');
    });

});