const add = document.querySelector('.add')
const clear = document.querySelector('.clear')
const newLogin = document.querySelector('#login');

const storage = JSON.parse(localStorage.getItem('users')) || {}

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        const userEmail = deleteBtn.dataset.deleteUserEmail;
        const userCard = deleteBtn.closest('.user-outer');
        userCard.remove();
        delete storage[userEmail];
        localStorage.setItem('users', JSON.stringify(storage));


        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white',
        )
    })

    changeBtn.addEventListener('click', () => {
        const userEmail = changeBtn.dataset.changeUserEmail;//моё
        const userData = storage[userEmail]//моё

        document.getElementById('name').value = userData.name//моё
        document.getElementById('secondName').value = userData.secondName //моё
        document.getElementById('email').value = userEmail//моё
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({ name, login, secondName, email }) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>Name: ${name}</p>
                <p>Login: ${login}</p> 
                <p>Second Name: ${secondName}</p>
                <p class="email">Email: ${email}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')
    const newLogin = document.querySelector('#login');

    const users = document.querySelector('.users')

    if (!newEmail.value || !newName.value || !newSecondName.value || !newLogin.value) {
        resetInputs(newName, newSecondName, newEmail);
        return;
    }

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        login: newLogin.value
    }

    if (storage[newEmail.value]) {
        storage[newEmail.value] = data;
        const existingCard = users.querySelector(`[data-user="${newEmail.value}"]`);
        existingCard.className = 'user';
        existingCard.innerHTML = createCard(data);
        setListeners(existingCard);
    } else {
        storage[newEmail.value] = data;
        const userCard = document.createElement('div');
        userCard.className = 'user';
        userCard.dataset.email = newEmail.value;
        userCard.innerHTML = createCard(data);
        users.append(userCard);
        setListeners(userCard);
    }
    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newEmail, newLogin)

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
