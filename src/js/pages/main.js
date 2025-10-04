const navi = document.querySelectorAll('.header-navi-main');
let current = '';
navi.forEach((item) => {
  item.addEventListener('mouseover', () => {
    if (current) {
      current.classList.remove('selected');
      current = item.nextElementSibling;
      current.classList.add('selected');
    }
    current = item.nextElementSibling;
    current.classList.add('selected');

    current.addEventListener('mouseleave', () => {
      current.classList.remove('selected');
    });
  });
});
