import {state} from './state'
import {mutations} from './mutations'
import {actions} from './actions'

export const homePage = {
    namespaced:true,
    state,
    mutations,
    actions
}