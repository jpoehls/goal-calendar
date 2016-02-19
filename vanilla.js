// mine

var toggleClass = function(elem, className) {
	if (hasClass(elem, className)) {
		removeClass(elem, className);
	} else {
		addClass(elem, className);
	}
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// http://youmightnotneedjquery.com
// IE 9+

var ajaxPost = function(url, data, onSuccess, onError) {
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	var csrftoken = getCookie('csrftoken');
	if (csrftoken) {
		// TODO: Only add if this is not a cross domain request.
		//       See jQuery settings.crossDomain
		//       http://api.jquery.com/jQuery.ajax
		request.setRequestHeader('X-CSRFToken', csrftoken);
	}

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			onSuccess();
		} else {
			onError(request);
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		onError(request);
	};

	request.send(data);
}

var ajaxGetJSON = function(url, onSuccess, onError) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {

		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			onSuccess(data);
		} else {
			onError(request);
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		onError(request);
	};

	request.send();
}

var ajaxGet = function(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			var resp = request.responseText;
		} else {
			// We reached our target server, but it returned an error
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
	};

	request.send();
}

// http://toddmotto.com/creating-jquery-style-functions-in-javascript-hasclass-addclass-removeclass-toggleclass/

var hasClass = function (elem, className) {
	return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

var addClass = function (elem, className) {
	if (!hasClass(elem, className)) {
		elem.className += ' ' + className;
	}
}

var removeClass = function (elem, className) {
	var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
	if (hasClass(elem, className)) {
		while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
			newClass = newClass.replace(' ' + className + ' ', ' ');
		}
		elem.className = newClass.replace(/^\s+|\s+$/g, '');
	}
}