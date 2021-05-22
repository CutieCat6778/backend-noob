let currentLocation = "";
let countryName = ""


$(document).ready(() => {
    window.location.search.includes("location") ? currentLocation += window.location.search.substr(10) + "/" : null;
    loadMap();
    loadWorldMap_Event();
});

function loadWorldMap_Event() {
    const paths = $('path');
    for (let path of paths) {
        path.addEventListener('click', function (event) {
            if(event.target.style.fill == "#03ff00") return;
            const name = event.target.getAttribute('name') || event.target.getAttribute('class')
            const p = document.getElementById('text');
            p.innerHTML = name;
            if (name.toLowerCase() == "united states") {
                window.location.replace(`http://localhost:3000/?location=usa`);
            } else if (name.toLowerCase() == "vietnam") {
                window.location.replace('http://localhost:3000/?location=vietnam');
            }
            console.log(currentLocation)
            !currentLocation.endsWith("/") ? currentLocation = name : currentLocation += name;
            countryName = name;
        })
    }
}

function submitLocation() {
    console.log('Client submit');
    const tags = $('path');
    for (let tag of tags) {
        tag = $(tag);
        console.log(tag.attr('name'));
        if (tag.attr('name') == countryName) {
            currentLocation += "-" + tag.attr('id');
            break;
        }
    }
    console.info(currentLocation);
    return window.location.replace('http://localhost:3000/api/map/location?location=' + currentLocation);
}

function loadMap() {
    fetch('http://localhost:3000/api/map/location/datas')
        .then(res => res.json())
        .then(data => {
            console.log(data);
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
            console.log(res, location);
            if(location[0] == "usa"){
                const tags = $('.United.States')
                for(let tag of tags){
                    console.log('a')
                    $(tag).css({fill:"#03ff00"});
                }
            }
            if(location[0] == "vietnam"){
                const tags = $('#VN')
                for(let tag of tags){
                    $(tag).css({fill:"#03ff00"});
                }
            }
            if (res.includes('-')) {
                document.getElementById(location[2]).style.fill = "#03ff00";
            }
            const tags = $(`.${location[1].split(' ').join('.')}`) || $(`#${location[3]}`);
            for (let tag of tags) {
                tag = $(tag);
                console.log("name: ",tag.attr('class'));
                tag.css({ fill: "#03ff00" });
            }
        })
        .catch(e => {
            console.error(e);
        })
}