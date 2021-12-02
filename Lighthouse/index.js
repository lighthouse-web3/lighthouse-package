const axios = require('axios');
const URL = 'http://localhost:8000';

exports.create_wallet = async (password) =>{
  try{
    const response = await axios.post(URL+'/api/wallet/create_wallet', {"password": password});
    return response.data;
  } catch{
    return null;
  }
}

exports.get_balance = async (publicKey) =>{
  try{
    const response = await axios.post(URL+'/api/wallet/get_balance', {"publicKey": publicKey});
    return response.data;
  } catch{
    return null;
  }
}

exports.user_token = async () =>{
  try{
    const response = await axios.get(URL+'/api/estuary/user_token');
    return response.data;
  } catch{
    return null;
  }
}

exports.upload = async (path, token) =>{
  var formData = new FormData();
  formData.append("data", fs.createReadStream(path));

  const headers = formData.getHeaders();
  const response = await axios.post('https://shuttle-1.estuary.tech/content/add', formData, { 
      headers: {
          Authorization: `Bearer ${token}`,
          ...headers,
      }}
  );
  return response.data;
}

exports.metadata_by_cid = async (cid) =>{
  const response = await axios.get(URL+`/api/estuary/metadata_by_cid/${cid}`);
  return response.data;
}

exports.list_data = async (offset, limit) =>{
  if(offset!==undefined && limit!==undefined) {
    const response = await axios.get(URL+`/api/estuary/list_data?offset=${offset}&limit=${limit}`);
    return response.data;
  } else{
      const response = await axios.get(URL+'/api/estuary/list_data?offset=0&limit=2');
      return response.data;
  }
}

exports.get_deals = async (content_id) =>{
  const response = await axios.get(URL+`/api/estuary/get_deals?content_id=${content_id}`);
  return response.data;
}

