# Custom Gaussian graphical for Javascript Canvas
Use `bezier curve` to draw `Gaussian graphical ` with `percent`

通过贝塞尔曲线，绘制百分比形状的高斯分布图

## Formula 
[Refenerce](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A)
![preview](https://wikimedia.org/api/rest_v1/media/math/render/svg/671f651757c2e7efb48da5801e835d3cafe4eeba)


## Preview
![preview](/preview.png)

## Example
```javascript
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let param = {
    // bezier值 reference https://www.cssportal.com/css-cubic-bezier-generator/
    bezier: [0.7, 0, 0.8, 1],
    // 顶点相对于画布的位置  (vertex point of Gaussian, relative (0,0))
    vertex: { x: 250, y: 120 },
    // 起点相对于画布的位置 (begin point of Gaussian, relative (0,0))
    begin: { x: 0, y: 300 },
    // 终点相对于画布的位置 (end point of Gaussian, relative (0,0))
    end : { x: 500, y: 300 },
}
// Context, 80percent, position param
drawGaussian(ctx, 0.8, param);
```
