function initMap() {
    const myLocation = {lat: 12.836928730477604, lng: 80.17078507958557}

    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: myLocation,
    });

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: myLocation,
        map: map,
    });
}