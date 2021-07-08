import { API } from 'aws-amplify';
var uuid4 = require('uuid4');
let apiName = 'AlertsApi'
let path = '/alerts'
let alertId = '1234'
export async function NewAlert(type) {
  var id = uuid4();
  try {
    const response = await API.put(apiName, path, {
      body: {id: alertId, type}
    });
  } catch (e) {
    console.log(e)
  }
}
export async function DelAlert() {
  try {
    const response = await API.del(apiName, path + '/object/' + alertId);
    console.log(response)
  } catch (e) {
    console.log(e)
  }
}
export async function CheckAlerts() {
  try {
    const response = await API.get(apiName, path + '/feed');
    return response
  } catch (e) {
    console.log(e)
  }
}
