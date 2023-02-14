import { Directive, DirectiveBinding } from 'vue'
import { addStyle, removeStyle, getTranslateXY } from '../tools'

// 本插件的限制：因为多个元素带有v-drag指令是，会共用这个targetElement，所以一次只能拖动一个元素
// 用一个全局的targetElement是为了后面在监听window上的mousemove事件时候，能够获取当前想要移动的DOM对象
let targetElement: HTMLElement
let targetDomRect:DOMRect
let targetBorderWidth: number
let parentElement: HTMLElement
let parentDOMRect: DOMRect
let parentBorderWidth: number
let _x: number
let _y: number

function mouseDownHandle (event: MouseEvent):void  {
    // mousedown这个事件是包括了元素的边框
    // 这个el不能写成target
    let el: HTMLElement = event.currentTarget as HTMLElement
    // 切换全局的 targetElement，便于在后面移动时候可以改变位置
    // 切换全局的 parentElement
    targetElement = el
    targetDomRect = targetElement.getBoundingClientRect()
    targetBorderWidth = parseInt(getComputedStyle(targetElement)['border'])
    parentElement = targetElement.parentElement
    parentDOMRect = parentElement.getBoundingClientRect()
    parentBorderWidth = parseInt(getComputedStyle(parentElement)['border'])

    let limit: number = Number(targetElement.getAttribute("limit"))
    
    // 鼠标点击时，鼠标相对于el元素的偏差offetX和offetY，是针对content-box而言的，无论box-sizing是什么都是这样
    // 为了使得边框也可以被点击和触发拖动，要加上borderWidth
    _x = event.offsetX + targetBorderWidth
    _y = event.offsetY + targetBorderWidth

    el.setAttribute("_x", _x.toString())
    el.setAttribute("_y", _y.toString())
    
    if(_y < targetElement.offsetHeight * limit){
        addStyle(el, JSON.parse(el.getAttribute("draggingClassList") as string))
        window.addEventListener("mousemove", mouseMoveHandle)
    }
}

function mouseUpHandle (event: MouseEvent):void {
    removeStyle(event.target as HTMLElement)
    window.removeEventListener("mousemove", mouseMoveHandle)
} 

function mouseMoveHandle (event: MouseEvent):void {

    // 元素的位移改为由transform的translate控制,性能更好
    targetElement.style.translate = `${event.clientX - _x - parentDOMRect.x - parentBorderWidth}px ${event.clientY - _y - parentDOMRect.y - parentBorderWidth}px`
    // 如果有活动区域限制就启动纠正程序
    // if(targetElement.getAttribute("dragArea") === "parent"){
    //     // 被拖动的元素只能只能在父元素内部活动
    //     console.log(event);
    //     let touchLfet = targetDomRect.left <= parentDOMRect.left + parentBorderWidth
    //     let touchTop = targetDomRect.top <= parentDOMRect.top + parentBorderWidth
    //     let touchRight = targetDomRect.right >= parentDOMRect.right - parentBorderWidth
    //     let touchBottom = targetDomRect.bottom >= parentDOMRect.bottom - parentBorderWidth
        
    //     // if(touchLfet && touchTop) {
    //     //     return;
    //     // }

    //     // if(touchLfet && touchBottom) {
    //     //     return;
    //     // }

    //     // if(touchRight && touchTop) {
    //     //     return;
    //     // }

    //     // if(touchRight && touchBottom) {
    //     //     return;
    //     // }

    //     if(touchLfet) {
    //         console.log("touch left: ", touchLfet);
    //         // targetElement.style.translate = `${0}px ${event.clientY - _y - parentDOMRect.y - parentBorderWidth}px`
    //     }
    //     // if(touchTop) {
    //     //     console.log("touch top")
    //     //     // targetElement.style.translate = `${event.clientX - _x - parentDOMRect.x - parentBorderWidth}px ${0}px`
    //     // }

    //     // if(touchRight) {
    //     //     console.log("touch right")
    //     // }

    //     // if(touchBottom) {
    //     //     console.log("touch bottom")
    //     // }

    //     // if(touchRight && touchBottom) {
    //     //     targetElement.style.translate = `${parentDOMRect.right - parentBorderWidth - targetDomRect.width - targetBorderWidth}px ${parentDOMRect.bottom - parentBorderWidth - targetDomRect.height - targetBorderWidth}}px`
    //     // } else if(touchRight) {
    //     //     console.log("touchRight")
    //     //     targetElement.style.translate = `${parentDOMRect.right - parentBorderWidth - targetDomRect.width - targetBorderWidth}px ${event.clientY - _y - parentDOMRect.y - parentBorderWidth}px`
    //     // } else if(touchBottom) {
    //     //     console.log("touchBottom")
    //     //     targetElement.style.translate = `${event.clientX - _x - parentDOMRect.x - parentBorderWidth}px ${parentDOMRect.bottom - parentBorderWidth - targetDomRect.height - targetBorderWidth}px`
    //     // }
    // }
}

/**
 * @param draggingClassList 触发拖动时的样式类名
 * @param limit 触发拖动的区域限制，只有鼠标在 (元素的height * limit) * (元素的width) 这个区域内才会被触发拖动
 * @param dragArea 元素拖动的活动区域，默认没有，也可以指定是“parent”
 */
type bindingValueType = {
    draggingClassList?: string[],
    limit?: number,
    dragArea?: undefined | "parent" | string
}

export const vDrag: Directive<HTMLElement, bindingValueType> = {
    created(el: HTMLElement, binding: DirectiveBinding){
        // console.log(binding.instance.$);
        let value: bindingValueType = binding.value ? binding.value : {}
        let draggingLimit: number = value.limit && value.limit >= 0 ? value.limit : 1
        let draggingClassList: string[] = value.draggingClassList ? value.draggingClassList : []
        let dragArea:string = value.dragArea === "parent" ? "parent" : ""

        // limit的默认值是1，limit对鼠标的位置进行限制，只有满足这个limit时候才能被拖动
        el.setAttribute("limit", draggingLimit.toString())
        el.setAttribute("draggingClassList", JSON.stringify(draggingClassList))
        el.setAttribute("dragArea", dragArea)
        el.style.position = "absolute"
    },
    mounted(el: HTMLElement){
        // 元素挂载，添加mousedown和mouseup的监听
        el.addEventListener("mousedown", mouseDownHandle)
        el.addEventListener("mouseup", mouseUpHandle)
    },
    unmounted(el: HTMLElement){
        // 元素挂载，移除mousedown和mouseup的监听
        el.removeEventListener("mousedown", mouseDownHandle)
        el.removeEventListener("mouseup", mouseUpHandle)
    }
}
