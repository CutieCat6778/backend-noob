$(document).ready(() => {
    const socket_io = io();
    socket_io.on('connect', () => {
        console.log("A User has been connected to the server");
    })
    loadWorldMap_Event();
});

function loadWorldMap_Event() {
    const paths = $('path');
    for (let path of paths) {
        path.addEventListener('click', function (event) {
            const name = event.target.getAttribute('name') || event.target.getAttribute('data-name') || event.target.getAttribute('class')
            console.log(name.toLowerCase())
            const p = document.getElementById('text');
            p.innerHTML = name;
            if (name.toLowerCase() == "united states") {
                window.location.replace(`http://noob-map.herokuapp.com/?location=usa`);
            }else if (name.toLowerCase() == "vietnam") {
                window.location.replace('http://noob-map.herokuapp.com/?location=vietnam');
            }
        })
    }
}