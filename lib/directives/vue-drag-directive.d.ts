import { Directive } from 'vue';
/**
 * @param draggingClassList 触发拖动时的样式类名
 * @param limit 触发拖动的区域限制，只有鼠标在 (元素的height * limit) * (元素的width) 这个区域内才会被触发拖动
 * @param dragArea 元素拖动的活动区域，默认没有，也可以指定是“parent”
 */
type bindingValueType = {
    draggingClassList?: string[];
    limit?: number;
    dragArea?: undefined | "parent" | string;
};
export declare const vDrag: Directive<HTMLElement, bindingValueType>;
export {};
