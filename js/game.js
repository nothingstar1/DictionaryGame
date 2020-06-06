/*global DictionaryGame _config*/

var DictionaryGame = window.DictionaryGame || {};
DictionaryGame.map = DictionaryGame.map || {};

(function gameScopeWrapper($) {
    var authToken;
    DictionaryGame.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });

    function gameSetup(){
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/word',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: completeGameSetup,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting starting words: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when getting the starting words:\n' + jqXHR.responseText);
            }
        })
    }

    function nextWord(word) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/word',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                word: word
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting word: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when getting the next word:\n' + jqXHR.responseText);
            }
        });
    }

    function completeGameSetup(result) {
        console.log('Response received from API: ', result);
        bodyUpdate(result.word);
    }

    function completeRequest(result) {
        console.log('Response received from API: ', result);
        bodyUpdate(result.word);
    }

    // Register click handler for #request button
    $(function onDocReady() {
        gameSetup();

        DictionaryGame.authToken.then(function updateAuthMessage(token) {
            if (token) {
                bodyUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function handleRequestClick(event) {
        // TODO
        nextWord("test");
    }

    function bodyUpdate(text) {
        $('#main').append($('<p>' + text + '</p>'));
    }

    function parameterUpdate(text){
        $('#goal_words').append($('<p>' + text + '</p>'));
    }
}(jQuery));
