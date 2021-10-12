
/**
 * 获取bezier某一位置的坐标
 * 
 * 算法实现参考 https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A#:~:text=%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF%E3%80%82-,%E4%B8%89%E6%AC%A1%E6%96%B9%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF%5B%E7%BC%96%E8%BE%91%5D,-P0%E3%80%81P1%E3%80%81P2
 * 
 * @param {*} t 百分比小数,
 * @param {*} p0 起点
 * @param {*} p1 控制点1
 * @param {*} p2 控制点2
 * @param {*} p3 终点
 * @returns 实时坐标
 */
let bezierFunction = function (t, p0, p1, p2, p3) {
    var cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX;

    var cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY;

    var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

    return { x: x, y: y };
}

/**
 * 
 * @param {*} ctx canvas context
 * @param {*} percent 百分比
 */
function drawGaussian(ctx, percent, {bezier, vertex, begin, end}) {
    // 先绘制高斯分布函数线
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(140, 120, 83)';
    ctx.lineWidth = 2;
    ctx.moveTo(begin.x, begin.y);
    // 坐标的控制点
    const left_point1 = {
        x: vertex.x * bezier[0],
        y: (begin.y + end.y) / 2,
    }
    const left_point2 = {
        x: vertex.x * bezier[2],
        y: vertex.y,
    }
    ctx.bezierCurveTo(left_point1.x, left_point1.y, left_point2.x, left_point2.y, vertex.x, vertex.y);


    const right_point1 = {
        x: vertex.x + vertex.x * (1 - bezier[2]),
        y: vertex.y,
    }
    const right_point2 = {
        x: vertex.x + vertex.x * (1 - bezier[0]),
        y: (begin.y + end.y) / 2,
    }
    ctx.bezierCurveTo(right_point1.x, right_point1.y, right_point2.x, right_point2.y, end.x, end.y);
    ctx.moveTo(begin.x, begin.y);

    // 先填充整个背景
    ctx.fillStyle = 'rgb(250, 241, 224)';
    ctx.fill();
    // 绘制线
    ctx.stroke();

    // 进行深色二次覆盖
    let remainingPercent = 1 - percent;
    ctx.fillStyle = 'rgb(140, 120, 83)';


    if (remainingPercent > 0.5) {

        // 左半边也需要覆盖

        let leftPercent = (remainingPercent - 0.5) * 2;
        const leftDelta = 1 / Math.max(Math.min((vertex.x - begin.x) * leftPercent, Math.abs((vertex.y - begin.y)) * leftPercent), 1000);
        let leftBeginPoint = bezierFunction(leftPercent, begin, left_point1, left_point2, vertex);
        ctx.moveTo(leftBeginPoint.x, leftBeginPoint.y);
        ctx.beginPath();
        for (let i = leftPercent; i < 1; i += leftDelta) {
            let tempPoint = bezierFunction(i, begin, left_point1, left_point2, vertex);
            ctx.lineTo(tempPoint.x, tempPoint.y);
        }
        ctx.lineTo(vertex.x, vertex.y);
        ctx.lineTo(vertex.x, (begin.y + end.y) / 2);
        ctx.lineTo(vertex.x, (begin.y + end.y) / 2);
        ctx.lineTo(leftBeginPoint.x, (begin.y + end.y) / 2);
        ctx.fill();
        remainingPercent = 0.5;
    }

    //覆盖右半边
    let rightPercent = (0.5 - remainingPercent) * 2;
    const rightDelta = 1 / Math.max(Math.min(Math.abs(vertex.x - end.x) * rightPercent, Math.abs(vertex.y - end.y) * rightPercent), 1000);
    // 计算在贝塞尔曲线上的开始坐标
    let rightBeginPoint = bezierFunction(rightPercent, vertex, right_point1, right_point2, end);
    // 移动到坐标
    ctx.moveTo(rightBeginPoint.x, rightBeginPoint.y);
    ctx.beginPath();
    for (let i = rightPercent; i < 1; i += rightDelta) {
        // 开始绘制贝塞尔曲线
        let tempPoint = bezierFunction(i, vertex, right_point1, right_point2, end);
        ctx.lineTo(tempPoint.x, tempPoint.y);
    }
    // 移动到终点
    ctx.lineTo(end.x, end.y);
    // 移动回贝塞尔开始坐标的x点
    ctx.lineTo(rightBeginPoint.x, (begin.y + end.y) / 2);
    ctx.fill();
}
