// Редактирование в профиле
function toggleEdit(show) {
    const viewElems = document.querySelectorAll('.view-mode');
    const editElems = document.querySelectorAll('.edit-mode');
    viewElems.forEach(el => el.style.setProperty('display', show ? 'none' : 'block', 'important'));
    editElems.forEach(el => el.style.setProperty('display', show ? 'block' : 'none', 'important'));
}

document.addEventListener('DOMContentLoaded', function() {
    // Боковая панель
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

    // Получение CSRF токена
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

    // AJAX ПРОВЕРКА EMAIL
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

    // AJAX УДАЛЕНИЕ ЗАМЕТКИ
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

    /* Раскрытие карточек */
    const guideCards = document.querySelectorAll('.guide-card');

    guideCards.forEach(card => {

        card.addEventListener('click', function(e) {

            if (e.target.closest('.guide-icon-btn')) {
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

    /* ФИЛЬТР POPUP */
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

    /* ПОИСК ПО КАРТОЧКАМ */
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

    $('#resetFilterBtn').on('click', function () {

        $('.guide-card').show();

    });

    /* ФИЛЬТРАЦИЯ */
    const categoryInputs = document.querySelectorAll('input[name="category"]');

    categoryInputs.forEach(input => {

        input.addEventListener('change', function () {

            const category = this.value;
            guideCards.forEach(card => {

                if (
                    card.dataset.category === category
                ) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }

            });
        });
    });

    /* АВТОРАСШИРЕНИЕ TEXTAREA */
    const textareas = document.querySelectorAll('textarea');

    textareas.forEach(textarea => {

        textarea.addEventListener('input', function () {

            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
});