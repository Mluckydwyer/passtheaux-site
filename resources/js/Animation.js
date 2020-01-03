// Wrap every letter in a span

let index = 0;
let subtitles = [
  "Click, Play, Jam! 🎉",
  "Party Rock!",
  "Drop The Beat"
];

function changeText() {
    let textWrapper = document.querySelector('.ml6 .letters');
    textWrapper.textContent = subtitles[index];
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    index++;
    if (index === subtitles.length) {
        index = 0;
    }

}

function animateSubtitle() {
    let textWrapper = document.querySelector('.ml6 .letters');
    // textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
        .add({
            targets: '.ml6 .letter',
            translateY: ["1.1em", 0],
            translateZ: 0,
            duration: 750,
            delay: (el, i) => 50 * i
        }).add({
        targets: '.ml6',
        opacity: 0,
        duration: 1500,
        easing: "easeOutExpo",
        delay: 4000
        });
}

function play() {
    changeText();
    animateSubtitle();
}

function init() {
   // setInterval(play, 4000);
    animateSubtitle();
}

window.onload = init;