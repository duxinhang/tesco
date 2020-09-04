export const mutations = {
    //缓存热推榜数据
    PushListDataCation(state,data){
        state.PushListData = data;
    },
    SearchListDataCation(state,data){
        state.SearchListData = data;
    },
    HotCakesDataCation(state,data){
        state.HotCakesData = data;
    },
    SalesListDataCation(state,data){
        state.SalesListData = data;
    },
}