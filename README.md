# How to install ? 
~~~
npm install simple-vue-drag-directive
~~~ 

# How to use ? 
After installing the package, you can import as ***ES Module***: 
~~~html
<script setup>
    import { vDrag } from 'simple-vue-drag-directive'
</script>

<template>
    <your-component v-drag={}></your-component>
</template>
~~~
And now you can drag ``<your-compnonet></your-compnonet>`` everywhere! 

All right, if you want more function, you can also give ``v-drag`` some value. Just like the following. 
~~~html
<template>
    <your-component v-drag="{limit: 0.5, draggingClassList:['draging']}"></your-component>
</template>

~~~ 
~~~css
.draging {
    opacity: 0.5;
}
~~~
| property | value's type | default value | description | 
|----|----|------|-----|
|limit|number|1|This proporty is design to narrow down the range within which an ``mousedown`` event is useful. Assume the element with ``v-drag`` has a height of ``100px`` ans a width of ``100px`` and you set ``limit`` as ``0.5``, the area which can listen your ``mousedown`` event will be narrow down to ``20px(height)`` x ``100px(width)``.| 
|draggingClassList|string[ ]|[ ]|Classes in the classList will be added to the dragging element, and will be removed when ``mouseup`` event emits.| 



# About the project dictionary 
the directive code is in the ``./src/directive`` 

# How to start ther demo ? 
~~~
npm run dev
~~~ 

If you have any good ideas, welcome to fork the project.  

My email address is 1446909703@qq.com.