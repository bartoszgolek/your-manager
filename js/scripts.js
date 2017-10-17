var yourManager = {
    box: null,
    userName: '',

    manager: {
        texts: [
            'Jak mogę Ci pomóc?',
            'A co Ty możesz z tym zrobić?',
            'W maszej organizacji, musisz brać sprawy w swoje ręce!',
            'Cieszę się, że mogłem pomóc!'
        ],
        index: 0,
        name: '',

        getText: function () {
            if (yourManager.manager.index > yourManager.manager.texts.length-1) {
                yourManager.manager.index = 0;
            }
            return yourManager.manager.texts[yourManager.manager.index++];
        }
    },

    loginFrom: {
        buildForm: function () {
            var form = $('<form class="loginForm"></form>');
            form.append('<label for="manager-name">Imię menedżera:</label>');
            form.append('<input name="manager-name" class="manager-name" type="text" />');
            form.append('<br>');
            form.append('<label for="user-name">Twoje imię:</label>');
            form.append('<input name="user-name" class="user-name" type="text" />');
            form.append('<br>');
            form.append('<input type="submit" class="submit" value="Zatwierdź" />');
            return form;
        },
        show: function () {
            var form = yourManager.loginFrom.buildForm();
            yourManager.box.html(form);
            form.submit(function (event) {
                event.preventDefault();
                yourManager.manager.name = $('.manager-name', form).val();
                yourManager.userName = $('.user-name', form).val();
                yourManager.chat.show();
            });
        }
    },
    chat: {
        log: null,
        messageForm: null,

        buildForm: function () {
            var form = $('<form class="messageForm"></form>');
            form.html('<label for="message">Wiadomość:</label>');
            form.append('<input name="message" class="message" type="text" />');
            form.append('<input type="submit" class="submit" value="Wyślij" />');
            return form;
        },
        buildChat: function () {
            var chat = $('<div class="chat"></div>');
            var log = $('<div class="log"></div>');
            yourManager.chat.log = log;
            chat.append(log);
            var messageForm = yourManager.chat.buildForm();
            yourManager.chat.messageForm = messageForm;
            messageForm.submit(function (event) {
                event.preventDefault();
                var text = $('.message', messageForm).val();
                if (text !== '') {
                    yourManager.chat.log.append(yourManager.chat.userText(text));

                    $('.message', messageForm).val('');
                    yourManager.chat.log.append(yourManager.chat.managerText());
                    yourManager.chat.log.scrollTop($(yourManager.chat.log)[0].scrollHeight);
                }
                $('.message', messageForm).focus();
            });
            chat.append(messageForm);

            return chat;
        },
        managerText: function () {
            return yourManager.chat.addMessage('manager', yourManager.manager.name, yourManager.manager.getText());
        },
        userText: function (text) {
            return yourManager.chat.addMessage('user', yourManager.userName, text);
        },
        addMessage: function (role, name, text) {
            var message = $('<div class="' + role + '-message"></div>');
            var nameDiv = $('<div class="name"></div>');
            nameDiv.html(name);
            message.append(nameDiv);
            var textDiv = $('<div class="text"></div>');
            textDiv.html(text);
            message.append(textDiv);

            return message;
        },
        show: function () {
            var chat = yourManager.chat.buildChat();
            yourManager.box.html(chat);
            yourManager.chat.log.append(yourManager.chat.managerText());
            yourManager.chat.log.scrollTop($(yourManager.chat.log)[0].scrollHeight);
            $('.message', yourManager.chat.messageForm).focus();
        }
    },
    init: function (element) {
        yourManager.box = $(element);
        yourManager.loginFrom.show();
    }
};
