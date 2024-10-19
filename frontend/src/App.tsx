import './App.css'
import {useEffect, useRef, useState} from "react";
import {Canvas} from "./types.ts";

const App = () => {
  const [state, setState] = useState<Canvas>({
    mouseDown: false,
    pixelsArray: [],
    color: '#000000',
    size: 1,
  });
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/canvas');
    setWebSocket(ws)

    ws.onmessage = event => {
      const decoded = JSON.parse(event.data);

      switch (decoded.type) {
        case 'NEW_PIXELS_ARRAY':
          decoded.message.forEach(message => {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');

              ctx.fillStyle = message.color;
              ctx.beginPath();
              ctx.arc(message.x, message.y, message.size / 2,0,2*Math.PI);
              ctx.fill();
            }

          });
          break;
        case 'CLEAR_CANVAS':
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          break;
        default:
          console.log('Unknown message type: ', decoded.type);
      }
    };
    return () => {
      ws.close();
    }
  }, []);

  const canvasMouseMoveHandler = event => {
    if (state.mouseDown) {
      event.persist();
      const clientX = event.nativeEvent.offsetX;
      const clientY = event.nativeEvent.offsetY;

      setState(prevState => {
        return {
          ...prevState,
          pixelsArray: [...prevState.pixelsArray, {
            x: clientX,
            y: clientY,
            color: state.color,
            size: state.size,
          }]
        };
      });

      const canvas = canvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = state.color;
        ctx.beginPath();
        ctx.arc(event.nativeEvent.offsetX, event.nativeEvent.offsetY, state.size / 2,0,2*Math.PI);
        ctx.fill();
      }
    }
  };

  const mouseDownHandler = () => {
    setState({...state, mouseDown: true});
  };

  const mouseUpHandler = () => {
    if (webSocket) {
      webSocket.send(JSON.stringify({
        type: 'CREATE_PIXELS_ARRAY',
        pixelsArray: state.pixelsArray,
      }));
    }

    setState({...state, mouseDown: false, pixelsArray: []});
  };

  const clearHandler = () => {
    if (webSocket) {
      webSocket.send(JSON.stringify({
        type: 'CLEAR_CANVAS',
      }));
    }
  };

  return (
      <div style={{display: 'flex'}}>
        <canvas
            ref={canvasRef}
            style={{border: '1px solid black'}}
            width={800}
            height={600}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler}
            onMouseMove={canvasMouseMoveHandler}
        />
        <div>
          <div className='color-picker'>
            <input
                className='color'
                type="color"
                id='color'
                onChange={(e) => setState({...state, color: e.target.value})}
            />
            <label htmlFor="color">Color</label>
          </div>
          <div className='size-picker'>
            <div>
              <input
                  type="range"
                  min="1"
                  max="50"
                  id='size'
                  defaultValue='1'
                  onChange={(e) => setState({...state, size: parseInt(e.target.value)})}
              />
              <label htmlFor="size">Size</label>
            </div>
            <p className='size-label'>{state.size} px</p>
            <button onClick={clearHandler} className='btn'>Clear canvas</button>
          </div>
        </div>
      </div>
  )
};

export default App
