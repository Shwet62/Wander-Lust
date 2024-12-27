



mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: listing.geometry.coordinates,
        zoom: 9
    });

    // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4>${listing.title}</h4> <p>Exact Location will be provided after booking</p>`
            
        ))
        .addTo(map);