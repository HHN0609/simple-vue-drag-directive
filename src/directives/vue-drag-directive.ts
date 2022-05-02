import { Directive, DirectiveBinding } from 'vue'
// 本插件的限制：因为多个元素带有v-drag指令是，会共用这个targetElement，所以一次只能拖动一个元素
// 用一个全局的targetElement是为了后面在监听window上的mousemove事件时候，能够获取当前想要移动的DOM对象
let targetElement: HTMLElement
let parentElement: HTMLElement
let parentDOMRect: DOMRect

function mouseDownHandle (event: MouseEvent):void  {
    // mousedown这个事件是包括了元素的边框

    let el: HTMLElement = event.currentTarget as HTMLElement
    // 切换全局的 targetElement，便于在后面移动时候可以改变位置
    // 切换全局的 parentElement
    targetElement = el
    parentElement = targetElement.parentElement!
    parentDOMRect = parentElement.getBoundingClientRect()

    let limit: number = Number(targetElement.getAttribute("limit"))
    
    // 鼠标点击时，鼠标相对于el元素的偏差offetX和offetY，是针对content-box而言的，无论box-sizing是什么都是这样
    let borderWidth = parseInt(getComputedStyle(targetElement)['border'])
    let _x: number = event.offsetX + borderWidth
    let _y: number = event.offsetY + borderWidth

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
    let _x:number = Number(targetElement.getAttribute("_x"))
    let _y:number = Number(targetElement.getAttribute("_y"))
    let parentBorderWidth = parseInt(getComputedStyle(parentElement).border)
    let targetBorderWidth = parseInt(getComputedStyle(targetElement).border)
    // 考虑父元素的宽
    targetElement.style.top = (event.clientY - _y - parentDOMRect.y - parentBorderWidth) + "px"
    targetElement.style.left = (event.clientX - _x - parentDOMRect.x - parentBorderWidth) + "px"

    // 如果有活动区域限制就启动纠正程序
    if(targetElement.getAttribute("draggingArea") === "parent"){
        // 被拖动的元素只能只能在父元素内部活动
        if(targetElement.offsetTop < 0){
            targetElement.style.top = "0px"
        } 
        if(targetElement.offsetLeft < 0){
            targetElement.style.left = "0px"
        }

        if(targetElement.offsetTop + targetElement.offsetHeight> parentDOMRect.height - 2 * parentBorderWidth){
            targetElement.style.top = parentDOMRect.height - 2 * parentBorderWidth - targetElement.offsetHeight + "px"
        }
        if(targetElement.offsetLeft + targetElement.offsetWidth > parentDOMRect.width - 2 * parentBorderWidth){
            targetElement.style.left = parentDOMRect.width - 2 * parentBorderWidth - targetElement.offsetWidth + "px"
        }
    }
}

/**
 * 添加拖动过程中的一些样式class
 * @param el 被拖动的元素
 * @param classList 需要添加到el元素上的class类名数组
 */
function addStyle (el: HTMLElement, classList: string[] = []):void {
    el.classList.add(...classList)
}

/**
 * 拖动结束后回收元素上的样式
 * @param el 被拖动的元素
 */
function removeStyle (el: HTMLElement):void {
    let classNameList:string[] = JSON.parse(el.getAttribute("draggingClassList") as string)
    classNameList.forEach(className => {
      el.classList.remove(className)
    })
}

/**
 * @param className 触发拖动时的样式类名
 * @param limit 触发拖动的区域限制，只有鼠标在 (元素的height * limit) * (元素的width) 这个区域内才会被触发拖动
 * @param dragArea 元素拖动的活动区域，默认没有，也可以指定是“parent”
 */
type bindingValueType = {
    classList?: string[],
    limit?: number,
    dragArea?: string
}

export const vDrag: Directive = {
    created(el: HTMLElement, binding: DirectiveBinding){
        let value: bindingValueType = binding.value ? binding.value : {}
        let draggingLimit: number = value.limit && value.limit >= 0 ? value.limit : 1
        let draggingClassList: string[] = value.classList ? value.classList : []
        let draggingArea:string = value.dragArea === "parent" ? value.dragArea : ""

        // limit的默认值是1，limit对鼠标的位置进行限制，只有满足这个limit时候才能被拖动
        el.setAttribute("limit", draggingLimit.toString())
        el.setAttribute("draggingClassList", JSON.stringify(draggingClassList))
        el.setAttribute("draggingArea", draggingArea)
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
