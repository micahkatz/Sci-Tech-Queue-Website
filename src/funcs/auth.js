import { correctPassword } from '../secret';
export async function CheckPass(pass) {
    if (pass === correctPassword) {
        return true;
    } else {
        alert('Incorrect Password');
        return null;
    }
}
