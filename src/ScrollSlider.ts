/* Scroll slider
 * @Author: bai 
 * @Date: 2019-12-04 17:24:22 
 * @Last Modified by: bai
 * @Last Modified time: 2019-12-17 12:02:32
 */

import SlideBars from './SlideBars';
// import './ScrollSlider.css';

export default class ScrollSlider extends SlideBars {

    constructor($elm, options = {}, callbackMaps={}) 
    {
        var defaultOptions = {
            horizontal: 1,
            startAt:1,
            smart:true,
            activateOn: 'click',
            itemNav: "basic",
            dragContent: 1,
            scrollBy: 1,
            // releaseSwing: 1,
            speed: 300,
            // elasticBounds: 1,
            easing: 'easeOutExpo',
            // mouseDragging: 1,
            touchDragging: 1,
            clickButton: '.button'
            // easing: "easeOutBack", //
            //     prev: prevButton,
            //     next: nextButton,
        };
        
        super($elm, Object.assign(defaultOptions, options), callbackMaps);
    }
 
}