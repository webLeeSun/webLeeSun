
//  xtype=1  表示星秀

import { get } from '../get'

export function getHomeData(pageno) {
    const result = get(`//m.api.xingyan.panda.tv/room/list?xtype=1&banner=1&pageno=${pageno}&pagenum=10`)
    return result
}
export function getHomeNewer(pageno) {
    const result = get(`//m.api.xingyan.panda.tv/list/host?type=newer&pageno=${pageno}&pagenum=20`)
    return result
}
export function getHotData(pageno) {
    const result = get(`//m.api.xingyan.panda.tv/list/host?type=hot&pageno=${pageno}&pagenum=20`)
    return result
}
export function getAdData() {
    const result = get('/api/homead')
    return result
}

export function getListData(city, page) {
    const result = get('/api/homelist/' + encodeURIComponent(city) + '/' + page)
    return result
}