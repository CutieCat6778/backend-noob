let currentLocation = "";
let countryName = ""


$(document).ready(() => {
    console.log(window.location.search.includes("location") && window.location.search.substr(10) != "world")
    window.location.search.includes("location") && window.location.search.substr(10) != "world" ? currentLocation += window.location.search.substr(10) + "/" : null;
    console.log(currentLocation);
    loadWorldMap_Event();
    console.log(currentLocation);
    loadMap();
    console.log(currentLocation);
});

function loadWorldMap_Event() {
    const paths = $('path');
    for (let path of paths) {
        path.addEventListener('click', function (event) {
            if (event.target.style.fill == "#03ff00") return;
            const name = event.target.getAttribute('name') || event.target.getAttribute('class')
            const p = document.getElementById('text');
            p.innerHTML = name;
            if (name.toLowerCase() == "united states") {
                window.location.replace(`https://noobteam.ga/?location=usa`);
            } else if (name.toLowerCase() == "vietnam") {
                window.location.replace('https://noobteam.ga/?location=vietnam');
            }
            console.log(currentLocation);
            !currentLocation.endsWith("/") ? currentLocation = name : currentLocation += name;
            countryName = name;
        })
    }
}

function submitLocation() {
    const tags = $('path');
    for (let tag of tags) {
        tag = $(tag);
        if (tag.attr('name') == countryName) {
            currentLocation += "-" + tag.attr('id');
            break;
        }
    }
    if (currentLocation == "") return alert('Bạn phải chọn một đất nước hoặc tỉnh!!!!');
    return window.location.replace('https://noobteam.ga/api/map/location?location=' + currentLocation);
}

function loadMap() {
    fetch('https://noobteam.ga/api/map/location/datas')
        .then(res => res.json())
        .then(data => {
            const res = data.data
            let location = "";
            if (res) {
                if (res.includes('/')) {
                    const split = res.split('/');
                    const split2 = split[1].split('-');
                    location = [split[0], split2[0], split2[1]];
                } else if (res.includes('-')) {
                    const split = res.split('-');
                    location = [undefined, split[0], split[1]];
                } else {
                    location = [undefined, res];
                }
            } else location = undefined;
            if (location[0] == "usa") {
                const tags = $('.United.States')
                for (let tag of tags) {
                    $(tag).css({ fill: "#03ff00" });
                }
            }
            if (location[0] == "vietnam") {
                const tags = $('#VN')
                for (let tag of tags) {
                    $(tag).css({ fill: "#03ff00" });
                }
            }
            if (res.includes('-')) {
                const el = document.getElementById(location[2])
                el ? el.style.fill = "#03ff00" : null;
            }
            const tags = $(`.${location[1].split(' ').join('.')}`) || $(`#${location[3]}`);
            for (let tag of tags) {
                tag = $(tag);
                tag.css({ fill: "#03ff00" });
            }
        })
        .catch(e => {
            console.error(e);
        })
}