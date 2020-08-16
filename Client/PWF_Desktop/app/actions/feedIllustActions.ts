import {IllustData} from '../constants/storeType';

export const feedIllustUpdate = (data: Array<IllustData>) =>{
    return {
        type: 'ILLUST_UPDATE',
        data: data
    };
};