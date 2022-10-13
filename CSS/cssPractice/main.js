const button = document.querySelectorAll(".subContainer");

var click_sound = new Audio();
click_sound.src =
  "https://www.dropbox.com/s/xfcb8khsheu73uu/zapsplat_multimedia_button_click_fast_plastic_49161.mp3?dl=1";

for (var i = 0; i < button.length; i++) {
  button[i].addEventListener("click", function () {
    click_sound.play();
    this.classList.toggle("active");
  });
}
