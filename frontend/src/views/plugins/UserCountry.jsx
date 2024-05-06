import { useState, useEffect } from "react";

const GetCurrentAddress = () => {
    const [address, setAddress] = useState("");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => setAddress(data.address))
                .catch((error) => console.log(error));
        });
    }, []);
    return address;
};

export default GetCurrentAddress;
