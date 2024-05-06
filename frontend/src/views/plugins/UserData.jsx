import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const UserData = () => {
    const access_token = Cookies.get("access_token");
    const refresh_token = Cookies.get("refresh_token");

    if(access_token && refresh_token){
        const token = refresh_token;
        const decoded = jwtDecode(token);
        return decoded;
    }
    else{
        return "User token not found";
    }
}

export default UserData;