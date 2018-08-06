
document.getElementById('drop_avatar').onclick = function dropSelect(){



    const avatars = document.getElementsByName('avatar');
    avatars.forEach(avatar =>{
        if (avatar.checked){
            avatar.checked = false;
        }
    });
};

document.getElementById('button').onclick = function submitForm() {
    document.getElementById('error').innerHTML = '';
    const check = formValidate();
    if (check){
        document.getElementById('error').innerHTML = check;
        return;
    }

    const http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            const text = http.responseText;
            if (text.indexOf('/') == 0) {
                window.location = text;
                console.log('kek');
            } else {
                document.getElementById('error').innerHTML = text;
            }
        }
    };
    const avatar = getAvatar();

    http.open("POST", "/submit", true);
    const params = `name=${document.getElementById('name').value}&lastName=${document.getElementById('lastName').value}&phone=${document.getElementById('phone').value}&email=${document.getElementById('email').value}&login=${document.getElementById('login').value}&password=${document.getElementById('password').value}&avatar=${avatar}`;
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
};

function getAvatar() {
    let avatarID;

    const avatars = document.getElementsByName('avatar');
    for (let i = 0; i < avatars.length; i++){
        if(avatars[i].checked){
            avatarID = i+1;
        }
    }

    let result;
    if  (avatarID){
        result = `avatar_${avatarID}.png`;
    } else {
        result = 'default.png';
    }
    return result;
}

function formValidate() {
    let error;

    if (!document.getElementById('password').value){
        error = 'Заполните поле "Пароль"';
    }
    if (!document.getElementById('login').value){
        error = 'Заполните поле "Логин"';
    }
    if (!document.getElementById('email').value){
        error = 'Заполните поле "Адрес электронной почты"';
    }
    if (!document.getElementById('phone').value){
        error = 'Заполните поле "Телефон"';
    }
    if (!document.getElementById('lastName').value){
        error = 'Заполните поле "Фамилия"';
    }
    if (!document.getElementById('name').value){
        error = 'Заполните поле "Имя"';
    }
    console.log(error);
    return error || false;
}