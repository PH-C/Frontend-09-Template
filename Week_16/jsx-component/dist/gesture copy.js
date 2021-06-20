// let element = document.documentElement;



// let handler;
// let startX, startY;
// let isPan = false,
//   isPress = false,
//   isTap = false;
export class Dispatcher {
  constructor(element){
    this.element = element
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

// listen=>recognize=>dispatch

// new Listener(new Recognizer(dispatch))

export class Listener{
  constructor(element, recognizer){
    let contexts = new Map();
    let isListeningMouse = false;

    element.addEventListener("mousedown", (event) => {
      let context = Object.create(null);
      // contexts.set(`mouse${event.button}`, context);
      contexts.set(`mouse${1 << event.button}`, context);

      recognizer.start(event, context);

      let mousemove = (event) => {
        let button = 1;

        while (button <= event.buttons) {
          if (button & event.buttons) {
            let key;
            // Order of buttons & button is not the same
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }

            let context = contexts.get("mouse" + key);
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      };

      let mouseup = (event) => {
        let context = contexts.get(`mouse${1 << event.button}`);
        recognizer.end(event, context);
        contexts.delete(`mouse${1 << event.button}`);

        if (event.buttons === 0) {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup);
          isListeningMouse = false;
        }
      };

      if (!isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        isListeningMouse = true;
      }
    });

    element.addEventListener("touchstart", (event) => {
      console.log(event.changedTouches);
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });

    element.addEventListener("touchmove", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });

    element.addEventListener("touchend", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });

    element.addEventListener("cancel", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognize{
  constructor(dispatcher){
    this.dispatcher = dispatcher
  }
  
  start(point, context) {
    // console.log('start', point.clientX, point.clientY);

    (context.startX = point.clientX), (context.startY = point.clientY);

    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ];

    context.isPan = false;
    context.isTap = true;
    context.isPress = false;

    context.handler = setTimeout(() => {
      context.isPan = false;
      context.isTap = false;
      context.isPress = true;
      // console.log("presss ");
      this.dispatcher.dispatch("press", {})
      context.handler = null;
    }, 500);
  }

  move(point, context) {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;

    let d = dx ** 2 + dy ** 2;
    if (!context.isPan && d > 100) {
      context.isPan = true;
      context.isTap = false;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      // console.log("pan-start");
      this.dispatcher.dispatch("panstart", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
      clearTimeout(context.handler);
    }
    if (context.isPan) {
      this.dispatcher.dispatch("pan", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
      })
      console.log(dx, dy);
      // console.log("pan");
    }

    context.points = context.points.filter((point) => Date.now() - point.t < 500);

    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    });

    // console.log('move', point.clientX, point.clientY);
  }

  end(point, context) {
    context.isFlick = false;

    if (context.isTap) {
      // console.log("tap");
      this.dispatcher.dispatch("tap", {});
      clearTimeout(context.handler);
    }
    if (context.isPress) {
      this.dispatcher.dispatch("pressend", {})
      // console.log("press-end");
    }
    if (context.isPan) {
      
      context.points = context.points.filter(
        (point) => Date.now() - point.t < 500
      );

      let d, v;
      if (!context.points.length) {
        v = 0;
      } else {
        d = Math.sqrt(
          (point.clientX - context.points[0].x) ** 2 +
            (point.clientY - context.points[0].y) ** 2
        );
        v = d / (Date.now() - context.points[0].t);
      }

      if (v > 1.5) {
        context.isFlick = true;
        // console.log("flick");
        this.dispatcher.dispatch("flick", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick,
          velocity: v
        })
      } else {
        context.isFlick = false;
        // dispatch("panend", {});
        this.dispatcher.dispatch("panend", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick
        })
      }

      // console.log("pan-end");
    }

   
    // console.log('end', point.clientX, point.clientY);
  }

  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch("cancel", {})
    // console.log('cancel', point.clientX, point.clientY);
  }
}


export function enableGesture(element){
  new Listener(element, new Recognize(new Dispatcher(element)))
}