/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import { ComponentAbstract } from '../ComponentAbstact';

/**
 * Here we will show letters and pictures on display on obniz Board.
 * ![](media://obniz_display_sphere.gif)
 *
 * @category Embeds
 */
export default class Display extends ComponentAbstract {
  /**
   * display width size
   *
   * @readonly
   */
  public readonly width: number;

  /**
   * display height size
   *
   * @readonly
   */
  public readonly height: number;

  private autoFlush = true;
  private fontSize = 16;
  private _canvas?: HTMLCanvasElement;
  private _pos = { x: 0, y: 0 };
  private _colorDepthCapabilities: [number] = [1];
  private _colorDepth = 1;
  private _color = '#000';
  private _paper_white = true;
  private _raw_alternate = false;

  constructor(obniz: any, info: any) {
    super(obniz);
    this.width = info.width;
    this.height = info.height;
    this._colorDepthCapabilities = info.color_depth;
    this._paper_white = info.paper_white;
    this._raw_alternate = info.raw_alternate;

    this._canvas = undefined;
    this._reset();
  }

  /**
   * This changes the font.
   * The options for fontFamily and fontSize depend on your browser.
   * If you are using node.js, node-canvas is required.
   *
   * The default font is Arial 16px.
   * If you set the parameter to null, you will be using the default font.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.font('Avenir',30)
   * obniz.display.print("Avenir")
   *
   * obniz.display.font(null,30) //default font(Arial) 30px
   * obniz.display.font('Avenir') //Avenir with default size(16px)
   * ```
   * ![](media://obniz_display_samples3.jpg)
   * ![](media://obniz_display_samples2.jpg)
   * ![](media://obniz_display_samples1.jpg)
   *
   * @param font font name
   * @param size size of font
   */
  public font(font: string | null, size?: number) {
    const ctx: any = this._ctx(true);
    if (ctx) {
      if (typeof size !== 'number') {
        size = 16;
      }
      if (typeof font !== 'string') {
        font = 'Arial';
      }
      this.fontSize = size;
      ctx.font = '' + +' ' + size + 'px ' + font;
    }
  }

  /**
   * Setting color for fill/stroke style for further rendering.
   * If you are using node.js, node-canvas is required.
   *
   * ```javascript
   * obniz.display.color('#FF0000');
   * obniz.display.rect(0, 0, 10, 10, false)
   * obniz.display.color('blue');
   * obniz.display.rect(0, 10, 10, 10, false)
   * ```
   *
   * @param color css acceptable color definition
   */
  public setColor(color: string) {
    const ctx: any = this._ctx(true);
    if (ctx) {
      this._color = color;
      ctx.fillStyle = this._color;
      ctx.strokeStyle = this._color;
    }
  }

  /**
   * Getting color for fill/stroke style for further rendering.
   *
   * ```javascript
   * const current = obniz.display.getColor();
   * ```
   *
   */
  public getColor() {
    return this._color;
  }

  /**
   * Clear the display.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.clear();
   * ```
   */
  public clear() {
    const ctx: any = this._ctx(false);
    this._pos.x = 0;
    this._pos.y = 0;
    if (ctx) {
      const currentFillStyle = ctx.fillStyle;
      ctx.fillStyle = this._paper_white ? '#FFF' : '#000';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = currentFillStyle;
      this.draw(ctx);
    } else {
      const obj: any = {};
      obj.display = {
        clear: true,
      };
      this.Obniz.send(obj);
    }
  }

  // eslint-disable-next-line rulesdir/non-ascii
  /**
   * It changes the display position of a text. If you are using print() to display a text, position it to top left.
   *
   * If you are using node.js, node-canvas is required.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.pos(0,30);
   * obniz.display.print("YES. こんにちは");
   * ```
   * ![](media://obniz_display_pos.jpg)
   *
   * @param x
   * @param y
   */
  public pos(x: number, y: number) {
    this._ctx(true); // crete first
    if (typeof x === 'number') {
      this._pos.x = x;
    }
    if (typeof y === 'number') {
      this._pos.y = y;
    }
    return this._pos;
  }

  // eslint-disable-next-line rulesdir/non-ascii
  /**
   * Print text on display.
   *
   * If you are using node.js and text is included characters out of ASCII code range, node-canvas is required.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.print("Hello!");
   * ```
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.font('Serif',18)
   * obniz.display.print("Hello World🧡")
   * ```
   * ![](media://obniz_display_print.jpg)
   *
   * @param text Text to display. With browser, UTF8 string is available.
   */
  public print(text: string) {
    const ctx = this._ctx(false);
    if (ctx) {
      ctx.fillText(text, this._pos.x, this._pos.y + this.fontSize);
      this.draw(ctx);
      this._pos.y += this.fontSize;
    } else {
      // eslint-disable-next-line no-control-regex
      if (!text.toString().match(/^[\x00-\x7F]*$/)) {
        this.warnCanvasAvailability();
      }
      const obj: any = {};
      obj.display = {
        text: '' + text,
      };
      this.Obniz.send(obj);
    }
  }

  /**
   * Draw a line between two points.
   * If you are using node.js, node-canvas is required.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.line(30, 30, 100, 30);
   * obniz.display.rect(20, 20, 20, 20);
   * obniz.display.circle(100, 30, 20);
   *
   * obniz.display.line(60, 50, 100, 30);
   * obniz.display.rect(50, 40, 20, 20, true);
   * obniz.display.line(50, 10, 100, 30);
   * obniz.display.circle(50, 10, 10, true);
   * ```
   *
   * ![](media://obniz_display_draws.jpg)
   *
   * @param x_0
   * @param y_0
   * @param x_1
   * @param y_1
   */
  public line(x_0: number, y_0: number, x_1: number, y_1: number) {
    const ctx: any = this._ctx(true);
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x_0, y_0);
      ctx.lineTo(x_1, y_1);
      ctx.stroke();
      this.draw(ctx);
    }
  }

  /**
   * Draw a rectangle.
   * If you are using node.js, node-canvas is required.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.rect(10, 10, 20, 20);
   * obniz.display.rect(20, 20, 20, 20, true); // filled rect
   * ```
   *
   * @param x
   * @param y
   * @param width
   * @param height
   * @param mustFill
   */
  public rect(
    x: number,
    y: number,
    width: number,
    height: number,
    mustFill?: boolean
  ) {
    const ctx: any = this._ctx(true);
    if (ctx) {
      if (mustFill) {
        ctx.fillRect(x, y, width, height);
      } else {
        ctx.strokeRect(x, y, width, height);
      }
      this.draw(ctx);
    }
  }

  /**
   * Draw a circle.
   * If you are using node.js, node-canvas is required.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.circle(40, 30, 20);
   * obniz.display.circle(90, 30, 20, true); // filled circle
   * ```
   *
   * @param x
   * @param y
   * @param r
   * @param mustFill
   */
  public circle(x: number, y: number, r: number, mustFill?: boolean) {
    const ctx: any = this._ctx(true);
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (mustFill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
      this.draw(ctx);
    }
  }

  /**
   * This shows QR code with given text and correction level.
   * The correction level can be
   *
   * - L
   * - M(default)
   * - Q
   * - H
   *
   * H is the strongest error correction.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.qr("https://obniz.io")
   * ```
   *
   * @param text
   * @param correction
   */
  public qr(text: string, correction?: 'L' | 'M' | 'Q' | 'H') {
    const obj: any = {};
    obj.display = {
      qr: {
        text,
      },
    };
    if (correction) {
      obj.display.qr.correction = correction;
    }
    this.Obniz.send(obj);
  }

  /**
   * Draw BMP image
   *
   * ```javascript
   * obniz.display.raw([255, 255,,,,,])
   * ```
   *
   * You should care about colorDepth before sending raw datas.
   *
   * @param data data array.
   * The order is as below.
   * {1byte} {2byte} {3byte}...{16byte}
   * {17byte} {18byte} {19byte}...
   * .....
   * .....................
   */
  public raw(data: number[]) {
    const obj: any = {};
    obj.display = {
      raw: data,
    };
    if (this._colorDepth > 1) {
      obj.display.color_depth = this._colorDepth;
    }
    this.Obniz.send(obj);
  }

  /**
   * Setting color depth for all communication for the display
   * higher number will get more beautiful colors and lowest number 1 is just monochrome.
   * But 16 bit color mode is 16 times data bytes needed for same size rendering.
   *
   * ```javascript
   * obniz.display.setColorDepth(4); // => 4bit color mode.
   * ```
   *
   * @param depth monochrome display always 1. For color display 1(monochrome) and 4 and 16 can be selected.
   * default value is highest color depth for your display.
   * If you call just
   */
  public setColorDepth(depth: number) {
    const found = this._colorDepthCapabilities.find(
      (element) => element === depth
    );
    if (found) {
      this._colorDepth = depth;
    } else {
      throw new Error(
        `This device can't accept depth ${depth}. availables are ${JSON.stringify(
          this._colorDepthCapabilities
        )}`
      );
    }
  }

  /**
   * Getting color depth for all communication for the display
   *
   * ```javascript
   * const current = obniz.display.getColorDepth(); // => return current depth. 1 or higher
   * ```
   */
  public getColorDepth() {
    return this._colorDepth;
  }

  /**
   * @ignore
   * @param io
   * @param moduleName
   * @param funcName
   */
  public setPinName(io: number, moduleName: string, funcName: string) {
    const obj: any = {};
    obj.display = {};
    obj.display.pin_assign = {};
    obj.display.pin_assign[io] = {
      module_name: moduleName,
      pin_name: funcName,
    };

    this.Obniz.send(obj);
  }

  /**
   * @ignore
   * @param moduleName
   * @param data
   */
  public setPinNames(moduleName: string, data: any) {
    const obj: any = {};
    obj.display = {};
    obj.display.pin_assign = {};
    let noAssignee: any = true;
    for (const key in data) {
      noAssignee = false;
      obj.display.pin_assign[key] = {
        module_name: moduleName,
        pin_name: data[key],
      };
    }
    if (!noAssignee) {
      this.Obniz.send(obj);
    }
  }

  /**
   * Draw Display from HTML5 Canvas context.
   * With node-canvas, this works with node.js.
   *
   * - on HTML, load ctx from existing
   *
   * ```javascript
   * let ctx = $("#canvas")[0].getContext('2d');
   *
   * ctx.fillStyle = "white";
   * ctx.font = "30px Avenir";
   * ctx.fillText('Avenir', 0, 40);
   *
   * obniz.display.draw(ctx);
   * ```
   *
   * - on HTML, create new canvas dom and load it.
   *
   * ```javascript
   *
   * let ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);
   *
   * ctx.fillStyle = "white";
   * ctx.font = "30px Avenir";
   * ctx.fillText('Avenir', 0, 40);
   *
   * obniz.display.draw(ctx);
   * ```
   *
   * - running with node.js
   *
   * ```javascript
   * //    npm install canvas. ( version 2.0.0 or later required )
   * const { createCanvas } = require('canvas');
   * const canvas = createCanvas(128, 64);
   * const ctx = canvas.getContext('2d');
   *
   * ctx.fillStyle = "white";
   * ctx.font = "30px Avenir";
   * ctx.fillText('Avenir', 0, 40);
   *
   * obniz.display.draw(ctx);
   * ```
   *
   *
   * @param ctx
   */
  public draw(ctx: CanvasRenderingContext2D) {
    if (this.autoFlush) {
      this._draw(ctx);
    }
  }

  /**
   * You can specify to transfer the displayed data or not.
   * This affects only the functions that use canvas like clear/print/line/rect/circle/draw.
   * If you are using node.js, node-canvas is required.
   *
   * Use false to stop updating display and true to restart updating.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.drawing(false);
   * for (var i=0;i<100; i++) {
   *   var x0 = Math.random() * 128;
   *   var y0 = Math.random() * 64;
   *   var x1 = Math.random() * 128;
   *   var y1 = Math.random() * 64;
   *   obniz.display.clear();
   *   obniz.display.line(x0, y0, x1, y1);
   * }
   * obniz.display.drawing(true);
   * ```
   *
   * @param autoFlush
   */
  public drawing(autoFlush: boolean) {
    this.autoFlush = !!autoFlush;
    const ctx: any = this._ctx(true);
    if (ctx) {
      this.draw(ctx);
    }
  }

  public schemaBasePath(): string {
    return 'display';
  }

  protected _reset() {
    this.autoFlush = true;
    // reset to default
    this._pos = { x: 0, y: 0 };
    this._color = this._paper_white ? '#000' : '#FFF';
    this.fontSize = this.height > 200 ? 32 : 16;
    this._colorDepth = this._colorDepthCapabilities[
      this._colorDepthCapabilities.length - 1
    ];
    this._reset_canvas();
  }

  private warnCanvasAvailability() {
    if (this.Obniz.isNode) {
      throw new Error(
        'obniz.js require node-canvas to draw rich contents or characters out of ASCII code range. see more detail on docs'
      );
    } else {
      throw new Error('obniz.js cant create canvas element to body');
    }
  }

  private _reset_canvas() {
    // reset canvas
    if (this._canvas) {
      const ctx: any = this._canvas.getContext('2d');
      ctx.fillStyle = this._paper_white ? '#FFF' : '#000';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = this._color;
      ctx.strokeStyle = this._color;
      ctx.font = `${this.fontSize}px Arial`;
    }
  }

  private _preparedCanvas() {
    if (this._canvas) {
      return this._canvas;
    }
    if (this.Obniz.isNode) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { createCanvas } = require('canvas');
        this._canvas = createCanvas(this.width, this.height);
        this._reset_canvas();
      } catch (e) {
        return undefined;
      }
    } else {
      const identifier: any = 'obnizcanvas-' + this.Obniz.id;
      let canvas: any = document.getElementById(identifier);
      if (canvas) {
        this._canvas = canvas;
        this._reset_canvas();
      } else {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', identifier);
        canvas.style.visibility = 'hidden';
        canvas.width = this.width;
        canvas.height = this.height;
        if (this._colorDepthCapabilities.length === 1) {
          // for monochro display
          canvas.style['-webkit-font-smoothing'] = 'none';
        }
        const body: any = document.getElementsByTagName('body')[0];
        body.appendChild(canvas);

        this._canvas = canvas;
        this._reset_canvas();
      }
    }
    return this._canvas;
  }

  private _ctx(required = false) {
    const canvas: any = this._preparedCanvas();
    if (canvas) {
      return canvas.getContext('2d');
    }
    if (required) {
      this.warnCanvasAvailability();
    }
    return undefined;
  }

  private _draw(ctx: CanvasRenderingContext2D) {
    const raw = new Array((this.width * this.height * this._colorDepth) / 8);
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    if (this._colorDepth === 16) {
      for (
        let pixel_index = 0;
        pixel_index < this.width * this.height;
        pixel_index++
      ) {
        const red = data[pixel_index * 4];
        const green = data[pixel_index * 4 + 1];
        const blue = data[pixel_index * 4 + 2];
        const hexColor =
          (((red >> 3) & 0x1f) << 11) |
          (((green >> 2) & 0x3f) << 5) |
          (((blue >> 3) & 0x1f) << 0);
        raw[pixel_index * 2] = (hexColor >> 8) & 0xff;
        raw[pixel_index * 2 + 1] = hexColor & 0xff;
      }
    } else if (this._colorDepth === 4) {
      const stride = this.width / 2;
      for (
        let pixel_index = 0;
        pixel_index < this.width * this.height;
        pixel_index++
      ) {
        const red = data[pixel_index * 4];
        const green = data[pixel_index * 4 + 1];
        const blue = data[pixel_index * 4 + 2];
        const brightness = 0.34 * red + 0.5 * green + 0.16 * blue;
        const line = Math.floor(pixel_index / this.width);
        const col = Math.floor((pixel_index - line * this.width) / 2);
        const bits = Math.floor(pixel_index - line * this.width) % 2;

        let pixel = 0b0000;
        if (red > 0x7f) {
          pixel |= 0b1000;
        }
        if (green > 0x7f) {
          pixel |= 0b0100;
        }
        if (blue > 0x7f) {
          pixel |= 0b0010;
        }
        if (brightness > 0x7f) {
          pixel |= 0b0001;
        }

        if (bits === 0) {
          raw[line * stride + col] = pixel << 4;
        } else {
          raw[line * stride + col] |= pixel;
        }
      }
    } else {
      const stride = this.width / 8;
      for (
        let pixel_index = 0;
        pixel_index < this.width * this.height;
        pixel_index++
      ) {
        const red = data[pixel_index * 4];
        const green = data[pixel_index * 4 + 1];
        const blue = data[pixel_index * 4 + 2];
        const brightness = 0.34 * red + 0.5 * green + 0.16 * blue;
        const row = Math.floor(pixel_index / this.width);
        const col = Math.floor((pixel_index - row * this.width) / 8);
        const bits = Math.floor(pixel_index - row * this.width) % 8;
        if (bits === 0) {
          raw[row * stride + col] = 0x00;
        }

        if (brightness > 0x7f) {
          raw[row * stride + col] |= 0x80 >> bits;
        }
      }
    }
    if (this._raw_alternate) {
      for (let i = 0; i < raw.length; i++) {
        raw[i] = ~raw[i] & 0xff;
      }
    }

    this.raw(raw);
  }
}
