$(document).ready(() => {
    loadWorldMap_Event();
});

function loadWorldMap_Event() {
    const paths = $('path');

    for (let path of paths) {
        path.addEventListener('click', function (event) {
            const para = document.getElementById('text');
            para.innerHTML = event.target.getAttribute('name') || event.target.getAttribute('class');
        })
    }
}