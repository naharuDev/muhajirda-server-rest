
const AbsenEnum =Object.freeze({
    NONE:'none',
    BELUM:'belum',
    PAGI:'pagi',
    TELAT:'telat',
    SIANG:'siang'
})

function mariadb_time_to_date(time_mariadb){
    var date = new Date()
    var t = (time_mariadb+'').split(":");
    date.setHours(Number(t[0]));
    date.setMinutes(Number(t[1]));
    date.setSeconds(Number(t[2]));
    return date
}

function get_absen_enum(now, jam_pagi, jam_siang){
    const mulai = new Date()
    mulai.setHours(6, 0, 0, 0);
    if(now.getTime() <= mulai.getTime()){
        //belum
        return {absensiEnum:AbsenEnum.BELUM, keterlambatan: 0}
    }
    else if (now.getDate() == jam_pagi.getDate() && now.getTime() <= jam_siang.getTime()){
        var difference = Math.floor((now.getTime()-jam_pagi.getTime())/60000)
        if (difference > 0){
            //telat
            return {absensiEnum:AbsenEnum.TELAT, keterlambatan: difference}
        }
        else{
            //belum telat
            return {absensiEnum:AbsenEnum.PAGI, keterlambatan: 0}
        }
    }
    else if(jam_siang.getDate() == now.getDate() && now.getTime() >= jam_siang.getTime()){
        //bisa absen siang
        return {absensiEnum:AbsenEnum.SIANG, keterlambatan: 0}
    }
    else{
        //tidak bisa absen
        return {absensiEnum:AbsenEnum.NONE, keterlambatan: 0}
    }
}

module.exports = {
    mariadb_time_to_date,
    get_absen_enum
}