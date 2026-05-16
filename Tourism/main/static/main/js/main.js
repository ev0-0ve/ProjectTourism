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
        sideToggle.addEventListener('click', () => sidePanel.classList.toggle('collapsed'));
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
});