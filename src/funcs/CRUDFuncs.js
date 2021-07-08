import { API } from 'aws-amplify';
var uuid4 = require('uuid4');
let apiName = 'HallsQueueApi'
let path = '/hallsqueue'
export async function NewHall(data, arrayLength) {
  var id = uuid4();
  try {
    const response = await API.put(apiName, path, {
      body: {...data, id, called: false, position: arrayLength}
    });
  } catch (e) {
    console.log(e)
  }
}

export async function GetHalls() {
  try {
    // const response = await API.post('SciTechQueueApi', path);
    const response = await API.get(apiName, path + '/feed');
    return response
  } catch (e) {
    console.log(e)
  }
}

export async function DelHall(hallId, hallOrder) {
  try {
    // const response = await API.post('SciTechQueueApi', path);
    const response = await API.del(apiName, path + '/object/' + hallId);
    // alert(JSON.stringify(response, null, 2));
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function CallHall(hallId, called, hallOrder) {
  try {
    // const response = await API.post('SciTechQueueApi', path);
    var response
    if(called){
      response = await API.post(apiName, path + '/uncall/' + hallId);
    } else {
      response = await API.post(apiName, path + '/call/' + hallId);
    }
    return true
  } catch (e) {
    return false
    console.log(e)
  }
}

export async function Reorder(hallId, hallOrder, newPos) {
  try {
    console.log('reordering', hallId, hallOrder, newPos)
    var response = await API.post(apiName, path + '/reorder/' + hallId + '/' + newPos);
    console.log(response)
    return true
  } catch (e) {
    return false
    console.log(e)
  }
}
