import { Directive} from "vue" 

export const vScale:Directive = {
    created(el: HTMLElement){
        el.style.position = 'absolute'
        el.style.resize = "both"
        el.style.overflow = "hidden"
    }
}