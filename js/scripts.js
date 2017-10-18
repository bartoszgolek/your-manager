var qs = (function(a) {
    if (a === "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length === 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var language = (function() {
    if ("lang" in qs) {
        if(['pl', 'en'].indexOf(qs['lang']) !== -1) {
            return qs['lang']
        }
    }

    return 'pl'
})();

var yourManager = {
    box: null,
    userName: '',

    manager: {
        texts: [
            resources[language].howCanIHelpYou,
            resources[language].whatYouCanDoAboutThis,
            resources[language].inOurOrganizationYouHaveToTakeMattersIntoTheirOwnHands,
            resources[language].imGladICouldHelp
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
            form.append('<label for="manager-name">' + resources[language].managerName + '</label>');
            form.append('<input name="manager-name" class="manager-name" type="text" />');
            form.append('<br>');
            form.append('<label for="user-name">' + resources[language].yourName + '</label>');
            form.append('<input name="user-name" class="user-name" type="text" />');
            form.append('<br>');
            form.append('<input type="submit" class="submit" value="' + resources[language].accept + '" />');
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
            form.html('<label for="message">' + resources[language].message + '</label>');
            form.append('<input name="message" class="message" type="text" />');
            form.append('<input type="submit" class="submit" value="' + resources[language].send + '" />');
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
