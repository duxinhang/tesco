export const mutations = {
    // 缓存推荐数据
    CacheData(state,data){
        state.HomePageCacheData = data.getlist;
    },
    // 缓存推荐数据
    ShoppingData(state,data){
        state.ShoppingCacheData = data.getlist;
    },
    // 缓存购物车数据
    ShoppingCartData(state,data){
        state.ShoppingCartDataListData = data;
    },
    ShoppingDindanData(state,data){
        state.ShoppingDindanListData = data;
    },

    // 缓存推荐数据
    OrderData(state,data){
        state.OrderData.push(data.aaa);
        for(let i=0;i<state.ShoppingCartDataListData.length;i++){
            state.ShoppingCartDataListData[i].isActive == true;
            state.ShoppingCartDataListData.splice(i,1);
            i--;
        }
    },

    // 缓存浏览记录
    BrowsingHistoryData(state,data){
        // if(state.BrowsingHistory.length > 0){
        //     if(state.BrowsingHistory == data.goods_id){
        //         return;
        //     }else{

        //         state.BrowsingHistory.push(data.goods_id);
        //     }
        if(state.BrowsingHistory.length == 0){
            state.BrowsingHistory.push(data.goods_id);
            return;
        }
        
        if(state.BrowsingHistory.length == 1){
            if(state.BrowsingHistory[0] != data.goods_id){
                state.BrowsingHistory.push(data.goods_id);
                return;
            }
        }
        
        if(state.BrowsingHistory.length > 1){
            
            state.BrowsingHistory.push(data.goods_id);
            
            for(let i=0;i<state.BrowsingHistory.length;i++){
                for(let j=i+1;j<state.BrowsingHistory.length;j++){
                    if(state.BrowsingHistory[i] == state.BrowsingHistory[j]){
                        state.BrowsingHistory.splice(i,1);
                        i--;
                    }else{
                        
                    }
                }
            } 
            return;
        }
        // }else{
        // }
    },

    RemoveBrowsingHistoryData(state,data){
        state.BrowsingHistory.splice(data,1)
    }
}