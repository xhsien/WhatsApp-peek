chrome.runtime.sendMessage({request: "getLogs"}, function(response) {
	console.log(response);

	logs = response;

	var element = document.getElementById("accordionExample");

	var full = '';

	var i = 1;
	for (var title in logs) {
		//alert(title);
		if (title == "undefined")
			continue;
		var block = '<div class="card">' + genHeader(i, title) + genChat(i, logs[title]) + '</div>';

		full += block;
		i += 1;
	}

	element.innerHTML = full;
});

function genHeader(id, title) {
	return '        <div class="card-header" id="heading' + id + '">\
          <h2 class="mb-0">\
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + id + '" aria-expanded="true" aria-controls="collapse' + id + '">'
              + title + '\
            </button>\
          </h2>\
        </div>'
}

function genChat(id, chats) {
	var content = "";
	for (var chat in chats) {
		content = content + chats[chat] + '\n';
	}
	return '        <div id="collapse' + id + '" class="collapse" aria-labelledby="heading' + id + '" data-parent="#accordionExample">\
          <div class="card-body">' + content + '\
          </div>\
        </div>'
}