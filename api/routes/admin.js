const data={
    hashkey: ""
};

function set_key(key){
    data.hashkey = key;
    Object.freeze(data)
}
function get_key(){
    return data.hashkey
}

module.exports = {set_key, get_key}