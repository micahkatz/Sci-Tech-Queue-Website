import { correctPassword } from '../secret';
export async function CheckPass(pass) {
    console.log({ pass, correctPassword });
    if (pass === correctPassword) {
        return true;
    } else {
        alert('Incorrect Password');
        return null;
    }
}
