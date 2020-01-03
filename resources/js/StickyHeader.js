var header = document.getElementById("header");
var headerOffset = 1;
var stickyHeader = false;

var setSticky = function () {
    if (window.pageYOffset >= headerOffset) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
    console.log(window.pageYOffset + " - " + headerOffset);
};

if (stickyHeader) window.onscroll = setSticky;
