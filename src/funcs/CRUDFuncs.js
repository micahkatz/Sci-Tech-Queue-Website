import { API } from 'aws-amplify';
var uuid4 = require('uuid4');
let apiName = 'HallsApi';
let path = '/prod/halls';

export const NewHall = async (data, arrayLength) =>
    API.put(apiName, path, {
        body: { ...data, id: uuid4(), isCalled: false, position: arrayLength },
    });
export const GetHalls = async () => {
    const response = await API.get(apiName, path + '/feed');
    console.log({ getHallResponse: response });
    return response;
};

export async function DelHall(hallId, hallOrder) {
    try {
        // const response = await API.post('SciTechQueueApi', path);
        const response = await API.del(apiName, path + '/object/' + hallId);
        // alert(JSON.stringify(response, null, 2));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function CallHall(hallId, isCalled, hallOrder) {
    try {
        // const response = await API.post('SciTechQueueApi', path);
        var response;
        if (isCalled) {
            response = await API.post(apiName, path + `/uncall?id=${hallId}`);
        } else {
            response = await API.post(apiName, path + `/call?id=${hallId}`);
        }
        return true;
    } catch (e) {
        return false;
        console.log(e);
    }
}

export async function Reorder(hallId, hallOrder, newPos) {
    try {
        console.log('reordering', hallId, hallOrder, newPos);
        var response = await API.post(
            apiName,
            path + '/reorder/' + hallId + '/' + newPos
        );
        console.log(response);
        return true;
    } catch (e) {
        return false;
        console.log(e);
    }
}
