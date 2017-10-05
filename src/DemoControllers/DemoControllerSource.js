import React, { Component } from 'react';

class DemoControllerSource extends Component {
    renderConnection() {
        if(this.props.domID === 'SUP4') {
            return <div id="chargeLineBackup" />
        }
        if(this.props.domID !== 'SUP1') {
            return null;
        }
        let lines = [];
        for(let i = 1; i < 4; i++) {
            var div1 = document.getElementById('CRG'+i+'real');
            var div2 = document.getElementById('SUP1');
            var thickness = 5;

            var off1 = this.getOffset(div1);
            var off2 = this.getOffset(div2);
            // bottom right http://jsfiddle.net/cnmsc1tm/
            var x1 = off1.left + (off1.width / 2);
            var y1 = off1.top + (off1.height / 2);
            // top right
            var x2 = off2.left + (off2.width / 2);
            var y2 = off2.top + (off2.height / 2);
            // distance
            var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
            // center
            var cx = ((x1 + x2) / 2) - (length / 2);
            var cy = ((y1 + y2) / 2) - (thickness / 2);
            // angle
            var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
            // make hr
            cx = 0;
            cy = 0;
            if(i === 1) {
                cx = 40;
                cy = 100;
            }
            else if(i === 2) {
                cx = 0;
                cy = 126;
            }
            else if(i === 3) {
                cx = -18;
                cy = 140;
            }
            lines[i] = <div className="chargeLine" id={"chargeLine"+i} key={i} style={{padding:'0px',margin:'0px',height:"5px",borderTop:"7px dashed #1eb71e",lineHeight:'1px', position:'absolute', left:cx+'px', top: cy + "px", width: length + "px", MozTransform:"rotate(" + angle + "deg)", WebkitTransform: "rotate(" + angle + "deg)", OTransform:"rotate(" + angle + "deg)", msTransform:"rotate(" + angle + "deg)", transform:"rotate(" + angle + "deg)"}} />;
            // lines[i] = <div style={{padding:'0px',margin:'0px',height:"5px",backgroundColor:"#0F0",lineHeight:'1px', position:'absolute', width: length + "px", MozTransform:"rotate(" + angle + "deg)", WebkitTransform: "rotate(" + angle + "deg)", OTransform:"rotate(" + angle + "deg)", msTransform:"rotate(" + angle + "deg)", transform:"rotate(" + angle + "deg)"}} />;
        }
        return lines;
    }

    getOffset( el ) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }
}

export default DemoControllerSource;
