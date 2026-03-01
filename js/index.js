function stringGen() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function toggleLauncher() {
    const launcher = document.getElementById("launcher");

    if (launcher.style.display == 'block') {
        launcher.style.display = 'none';
    } else {
        launcher.style.display = 'block';
    }
}

function spawnwindow(name, URL, icon, height, width) {
    //configure elements
    var section = document.getElementById("section");
    var footer = document.getElementById("footer");

    var window = document.createElement("div");
    var header = document.createElement("div");
    var content = document.createElement("div");
    var webview = document.createElement("iframe");
    var minimized = document.createElement("button");
    var close = document.createElement("button");
    var minimize = document.createElement("button");
    var minimizeIcon = document.createElement("img");
    var appID = stringGen()

    //create window
    window.style.display = "block";
    window.style.minHeight = height + 31;
    window.style.minWidth = width;
    window.style.height = height + 31;
    window.style.width = width;
    window.classList.add('window');
    window.id = name + appID;
    window.onmousedown = function () {
        focusWindow(window)
    }

    //create header
    header.classList.add('header');
    header.style.width = width;
    header.innerHTML = `<img src="${icon}"> ${name}`;

    //create close button
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    close.classList.add('closebutton');
    close.onclick = function () {
        window.remove();
        minimized.remove();
    }

    //create minimize button
    minimize.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    minimize.classList.add('minimize');
    minimize.onclick = function () {
        window.style.display = "none"
        minimized.className = "menubuttonminimized"
    }

    //create content div
    content.classList.add('content');

    //create webview
    webview.src = URL;

    //create minimized icon
    minimizeIcon.src = icon;
    minimizeIcon.id = 'menutogglebuttonimg';

    //create task button
    minimized.className = "menubuttonminimized menubuttonminimizing"
    minimized.onclick = function () {
        window.style.display = "block"
        minimized.className = "menubuttonminimized menubuttonminimizing"
    }

    //append the elements
    minimized.prepend(minimizeIcon);
    section.prepend(window);
    window.appendChild(header);
    header.appendChild(close);
    header.appendChild(minimize)
    window.appendChild(content);
    content.appendChild(webview);
    footer.appendChild(minimized);

    //make the window draggable
    $(".window").draggable({
        handle: ".header",
        containment: "#section",
        opacity: 0.75
    });

    $(".window").resizable({
        containment: "#section"
    });
}

function focusWindow(windowElem) {
    const windows = document.querySelectorAll('.window');
    windows.forEach((elem) => elem.classList.remove('focused'));

    windowElem.classList.add('focused');
}

setInterval(async function () {
    var theSpan = document.getElementById("time")
    var theDate = new Date()
    var currentMinute
    var currentHour

    if (theDate.getMinutes() < 10) {
        currentMinute = '0' + theDate.getMinutes()
    } else {
        currentMinute = theDate.getMinutes()
    }

    if (theDate.getHours() < 10) {
        currentHour = '0' + theDate.getHours()
    } else {
        currentHour = theDate.getHours()
    }

    theSpan.innerText = currentHour + ':' + currentMinute
    theSpan.title = theDate.toDateString()
})

function toggleWindowVisibility(id, isVisible) {
    let window = document.getElementById(id);
    let menuitem = document.getElementById(`${id}-menu`);
    window.style.display = isVisible ? "block" : "none";
    menuitem.style.display = isVisible ? "inline-flex" : "none";
    menuitem.classList.add("menubuttonminimizing");

    $(window).draggable({ handle: ".header", containment: "#section", opacity: 0.75 });
    $(window).resizable({ containment: "#section" });
}

function minimizeWindow(id, isMinimizing) {
    let window = document.getElementById(id);
    let menuitem = document.getElementById(`${id}-menu`);
    window.style.display = isMinimizing ? "none" : "block";

    if (isMinimizing) {
        menuitem.classList.remove("menubuttonminimizing");
        menuitem.onclick = () => {minimizeWindow(id, false)};
    }
    else {
        menuitem.classList.add("menubuttonminimizing");
        menuitem.onclick = () => {minimizeWindow(id, true)};
    };
}