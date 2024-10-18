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

  return (
      <div style={{display: 'flex'}}>
        <canvas
            style={{border: '1px solid black'}}
            width={800}
            height={600}
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
            <button className='btn'>Clear canvas</button>
          </div>
        </div>
      </div>
  )
};

export default App
