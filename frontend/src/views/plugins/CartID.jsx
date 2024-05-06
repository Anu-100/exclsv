import apiInstance from "../../utils/axios";
import UserData from "./UserData";

const CartID = async () => {
    let cart_id = '';
    const generateRandomString = () => {
        const length = 30;
        const characters = 'ABCDEFGHIJKL1234567';
        let randomString = '';

        for(let i = 0; i < length; i++){
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        localStorage.setItem("randomString", randomString);
        return randomString;
    }

    const userData = UserData();
    const response = await apiInstance.get(`cart/${userData?.user_id}/`)
    try {
        const cartArr = response.data;
        if(cartArr.length > 0){
            cart_id = cartArr[0].cart_id;
        }
        else{
            cart_id = generateRandomString();
        }
        return ("cart ID: ", cart_id);
    } catch (error) {
        return error;
    }
}

export default CartID