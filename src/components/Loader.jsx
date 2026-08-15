import React from 'react'

export const Loader = ({ fadeOut }) => {
  return (
    <div className={`loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div id="div1">
        <div id="l" style={{ margin: '33px' }}>
          <div className="pupil">
            <div className="p5">
              <div className="pupl2">
                <div className="pupil3"></div>
                <div className="pupil4"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="m" style={{ margin: '33px' }}>
          <div className="pupil">
            <div className="p5">
              <div className="pupl2">
                <div className="pupil3"></div>
                <div className="pupil4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="loader-text">WAIT FOR IT...</div>
    </div>
  )
}

export default Loader
