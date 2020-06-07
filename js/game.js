/*global DictionaryGame _config*/

var DictionaryGame = window.DictionaryGame || {};
DictionaryGame.map = DictionaryGame.map || {};

(function gameScopeWrapper($) {
    var authToken;
    var moves = 0;
    // Words
    var start;
    var end;
    var current;

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

    // username??!
    function saveWin() {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/word',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                score: moves
            }),
            contentType: 'application/json',
            success: completeRequest, // use a different function
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting word: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when getting the next word:\n' + jqXHR.responseText);
            }
        });
    }

    function completeGameSetup(result) {
        console.log('Response received from API: ', result);
        moves = 0;
        start = normalizeWord("horse");
        current = start;
        end = normalizeWord("bat");
        parameterUpdate("Start: " + start + "End: " + end); // Start and end words from api
        $('#main').empty();
        bodyAppend([start]); // The start word, in the body (and therefore linked)
    }

    function completeRequest(result) {
        console.log('Response received from API: ', result);
        words = result['Associated words'];
        definitions = result['Definitions'];
        $('#main').empty();
        $('#main').append($("<p>Moves: "+moves+" Current word: "+current+"</p>"));
        $('#main').append($('<h3>Related Words</h3>'));
        bodyAppend(words);
        $('#main').append($('<h3>Definitions</h3>'));
        for(j = 0; j < definitions.length; j++) {
            definition_words = definitions[j].split(" ");
            bodyAppend(definition_words);
            $('#main').append($('<br>'));
        }
    }

    // Register click handler for #request button
    $(function onDocReady() {
        gameSetup();

        DictionaryGame.authToken.then();

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function normalizeWord(word) {
        var s = word.toLowerCase();
        var punctuationless = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        var finalString = punctuationless.replace(/\s{2,}/g," ");
        return finalString;
    }

    function handleRequestClick(event) {
        // TODO -- loading?
        $('#main').empty();
        moves = moves + 1;
        var word = normalizeWord(event.data);
        if (word.localeCompare(end) == 0) {
            winScreen();
            return;
        }
        current = word;
        nextWord(word);
    }

    function bodyAppend(words) {
        var body = $("#main");
        // for each word 
        for(i = 0; i < words.length; i++) {
        	var word = words[i];
        	body.append($("<a>" + word +" </a>").click(word, function(a) {
          	handleRequestClick(a);
          }));
            // if you don't want a word linked, do append(word), plain, just like that
        }
    }

    function winScreen() {
        $('#main').empty();
        var body = $("#main");
        body.append($("<h2>You won in "+ moves +" moves!</h2>"));
        body.append($("<a> Click here to start a new game </a>").click(function() {
            gameSetup();
        }));
    }

    function parameterUpdate(text){
        $('#goal_words').empty();
        $('#goal_words').append($('<p>' + text + '</p>'));
    }
}(jQuery));
