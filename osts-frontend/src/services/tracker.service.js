import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/ots';

class TrackerService {
  getAll() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  cancelRequest(selectdItem) {
    const data = selectdItem;
    return axios.put(API_URL + '/state/CANCELLED', data, { headers: authHeader() });
  }

  approveRequest(selectdItem) {
    const data = selectdItem;
    return axios.put(API_URL + '/state/APPROVED', data, { headers: authHeader() });
  }

  rejectRequest(selectdItem) {
    const data = selectdItem;
    return axios.put(API_URL + '/state/REJECTED', data, { headers: authHeader() });
  }

  create(data) {
    return axios.post(API_URL, data, { headers: authHeader() });
  }
}

export default new TrackerService();
