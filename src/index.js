import parse from "./parse";
let templateStr = `<div>
    <ul class="red">
        <h3>hhh</h3>
        <li class="blue dd rerrreew">1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
    </ul>
    </div>`
console.log(parse(templateStr))