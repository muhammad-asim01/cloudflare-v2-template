class PolygonBorder {
    static get inputProperties() {
      return ['--path', '--border'];
    }
  
    paint(ctx, size, properties) {
      const points = properties.get('--path').toString().split(',');
      const borderWidth = parseFloat(properties.get('--border').value);
      const width = size.width;
      const height = size.height;
  
      const convertCoordinates = (x, y) => {
        const fx = x.includes('%') ? (parseFloat(x) / 100) * width : parseFloat(x);
        const fy = y.includes('%') ? (parseFloat(y) / 100) * height : parseFloat(y);
        return [fx, fy];
      };
  
      let [x0, y0] = points[0].trim().split(' ');
      [x0, y0] = convertCoordinates(x0, y0);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
  
      for (let i = 1; i < points.length; i++) {
        let [x, y] = points[i].trim().split(' ');
        [x, y] = convertCoordinates(x, y);
        ctx.lineTo(x, y);
      }
  
      ctx.closePath();
      ctx.lineWidth = 2 * borderWidth;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
  }
  
  // Register the paint worklet
  registerPaint('polygon-border', PolygonBorder);
  

  // if (window.CSS && CSS.paintWorklet) {
  //   CSS.paintWorklet.addModule('worklet.js');
  // }
