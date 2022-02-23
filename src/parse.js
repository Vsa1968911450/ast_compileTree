import attrP from './attr.js'
export default function parse(str){ // 使用栈
    let index = 0
    let tag = ''
    let rest = ''
    let word = ''
    let StartReg = /^\<([a-z]+[1-9]?)(\s[^/<]+)?\>/  // 匹配div这种全是字符串 还有H3字母带数字
    let endReg = /^\<\/([a-z]+[1-9]?)\>/   // 多一个斜杠
    let stack = [] // 匹配到开始标签
    let stacks = [{'children':[]}] // 匹配到结束标签
    let emptyReg = /^\s+$/ // 全空
    let wordReg = /^([^\<]+)\<\/[a-z]+[1-6]?\>/  // 匹配中间的文字  不能以<为开头的文字 以<开始就是标签
    let stackPop = '' //stack栈中弹出的元素
    let stacksPop = '' // stacks栈中弹出的元素
    let attr = [] // 获取<>里面class等元素 id
    while(index<str.length-1){
        rest = str.substring(index)
        if(StartReg.test(rest)){//识别遍历的字符是不是一个开始标签 <字符串>
             tag = rest.match(StartReg)[1] // 获取<>两个符号中间的内
             stack.push(tag)  // 匹配到开头 就把开头存入到stack里面
             attr = attrP(rest.match(StartReg)[2]) // 获取class
             stacks.push({'tag':tag,'attr':attr,children:[]}) //存一个空的数组进去
             if(attr) {
                index += tag.length + 2 + attr.length // 需要加上<>的两个字符  + 上attr的长度 不然就不是 两个<>里面的长度了
             }else{
                index += tag.length + 2
             }
            //  index += tag.length + 2 + attr.length // 需要加上<>的两个字符  + 上attr的长度 不然就不是 两个<>里面的长度了
        } else if(endReg.test(rest)) {
            tag = rest.match(endReg)[1] // tag和stack顶部是相同的 不同说明<>没有闭合
            stackPop  = stack.pop()  // 取出的元素赋值 准备往树上放  这个是节点信息
            stacksPop = stacks.pop() //  取出的是 节点的文字信息
            if(tag == stackPop){//验证是否是同一个标签 先进后出 后进先出
            if(stacks.length>0){
                stacks[stacks.length-1].children.push(stacksPop)
            }
            // if(stacks[stacks.length-1].hasOwnProperty('children')){ // 判断是不是有子元素
            //     stacks[stacks.length-1].children = []
            // }
            } else {
                throw Error('标签未闭合') // 如果不是 基本上就是模板字符串没有闭合标签
            }
             index += tag.length + 3 // 需要加上</>的两个字符
            //  console.log(JSON.stringify(stacks))
        } else if(wordReg.test(rest)) { //不考虑 纯文字 比如 <div>wo<p>121221</p><div> 不考虑wo里面这种情况
            word = rest.match(wordReg)[1]
            if(!emptyReg.test(word)){
                stacks[stacks.length-1].children.push({'text':word,type:3})
            }
            index += word.length
        } else {
            index ++
        }
        // return JSON.stringify(stacks)
        // console.log(stack)
        // console.log(JSON.stringify(stacks))
    }
    return stacks[0].children[0]
}