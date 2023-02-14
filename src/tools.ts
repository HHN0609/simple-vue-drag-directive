export function getTranslateXY( translate: string ): number[] {
    return translate.trim().split(" ").map((_) => parseInt(_));
}

/**
 * 添加拖动过程中的一些样式class
 * @param el 被拖动的元素
 * @param classList 需要添加到el元素上的class类名数组
 */
export function addStyle (el: HTMLElement, classList: string[] = []):void {
    el.classList.add(...classList)
}

/**
 * 拖动结束后回收元素上的样式
 * @param el 被拖动的元素
 */
export function removeStyle (el: HTMLElement):void {
    let classNameList:string[] = JSON.parse(el.getAttribute("draggingClassList") as string)
    classNameList.forEach(className => {
      el.classList.remove(className)
    })
}