export const mutations = {
    // 缓存推荐数据
    OrderData(state,data){
        let list = [];
        list.push(data);
        state.OrderData = list;
    },
}