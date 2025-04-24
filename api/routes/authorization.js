const bcrypt = require('bcrypt')
const admin = require('./admin')
BigInt.prototype.toJSON = function () {
    return this.toString();
};

async function check_hash(pool, id_karyawan, key){
    try {
        const sqlGetUser = 'SELECT hashkey FROM karyawan WHERE id=?';
        const rows = await pool.query(sqlGetUser, id_karyawan);
        if(rows[0].hashkey != "-"){
            const isValid = await bcrypt.compare(key, rows[0].hashkey)
            if (isValid){
                return {authorized:true, message:"authorization is success"}
            }else{
                return {authorized:false, message:"unauthorized"}
            }
        }else{
            return {authorized:false, message:"id_karyawan is not claimed by any device yet"}
        }
    } catch (error) {
        return {authorized:false, message: error.message}
    }
    
}

async function auth_admin(admin_key){
    const isValid = await bcrypt.compare(admin_key, admin.get_key())
    return isValid
}

module.exports = {check_hash, auth_admin}