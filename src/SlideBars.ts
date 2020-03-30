/* slide bars, Be based on Sly see: https://github.com/darsain/sly
 * @Author: bai 
 * @Date: 2019-12-04 13:52:17 
 * @Last Modified by: bai
 * @Last Modified time: 2020-03-30 15:13:09
 */
let $ = require('jquery');
let easing = require('jquery.easing');
import ResizeObserver from 'resize-observer-polyfill';


export default class SlideBars{

    // Local WindowAnimationTiming interface
	// static cAF:Function;
    // static rAF:Function;

    pluginName:string = 'slideBars';
	className:string  = 'SlideBars';
    namespace:string  = 'slideBars';


    // Support indicators
    transform;
    gpuAcceleration;

    // Other global values
    $doc;
	dragInitEvents:string;
	dragMouseEvents:string;
	dragTouchEvents:string;
	wheelEvent:string;
	clickEvent:string;
	mouseDownEvent:string;
	interactiveElements:Array<string>;
	tmpArray:Array<any>;
	time;

	// Math shorthands
	abs = Math.abs;
	sqrt = Math.sqrt;
	pow = Math.pow;
	round = Math.round;
	max = Math.max;
    min = Math.min;

    // Expose properties
    initialized;
    frame;
    slidee;
    pos;
    rel;
    items:any;
    pages;
    isPaused;
    options;
    dragging:any;

    // Extend options
    o;
    // Private variables
    parallax;

    // Frame
    $frame;
    $slidee;
    frameSize;
    slideeSize;
    // pos;
    // Scrollbar
    $sb;
    $handle;
    sbSize;
    handleSize;
    hPos;

    // Pagesbar
    $pb;
    $pages;
    // pages;

    // Items
    $items;
    // items;
    // rel;
    // Styles
    frameStyles;
    slideeStyles;
    sbStyles;
    handleStyles;

    // Navigation type booleans
    basicNav;
    forceCenteredNav;
    centeredNav;
    itemNav;

	// Miscellaneous
    $scrollSource;
    $dragSource;
    $forwardButton;
    $backwardButton;
    $prevButton;
    $nextButton;
    $prevPageButton;
    $nextPageButton;
    callbacks;
    last:any;
    animation;
    move;
    // dragging;
    scrolling;
    renderID;
    historyID;
    cycleID;
    continuousID;
    i
    l;
    lastGlobalWheel;
    callbackMap;
    parentNode;

    defaults:any;

 

    constructor(frame, options, callbackMap) {

        window.cancelAnimationFrame = (window as any).cancelAnimationFrame || (window as any).cancelRequestAnimationFrame;
        window.requestAnimationFrame = (window as any).requestAnimationFrame;

        this.$doc = $(document);

        this.dragInitEvents = 'touchstart.' + this.namespace + ' mousedown.' + this.namespace;
        this.dragMouseEvents = 'mousemove.' + this.namespace + ' mouseup.' + this.namespace;
        this.dragTouchEvents = 'touchmove.' + this.namespace + ' touchend.' + this.namespace;
        this.wheelEvent = (document.implementation.hasFeature('Event.wheel', '3.0') ? 'wheel.' : 'mousewheel.') + this.namespace;
        this.clickEvent = 'click.' + this.namespace;
        this.mouseDownEvent = 'mousedown.' + this.namespace;
        this.interactiveElements = ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'];
        this.tmpArray = [];
    
        // Math shorthands
        this.abs = Math.abs;
        this.sqrt = Math.sqrt;
        this.pow = Math.pow;
        this.round = Math.round;
        this.max = Math.max;
        this.min = Math.min;


        // Keep track of last fired global wheel event
        this.lastGlobalWheel = 0;
        this.$doc.on(this.wheelEvent, event=> {
            let sly = event.originalEvent[this.namespace];
            let time = +new Date();
            // Update last global wheel time, but only when event didn't originate
            // in Sly frame, or the origin was less than scrollHijack time ago
            if (!sly || sly.options.scrollHijack < time - this.lastGlobalWheel) this.lastGlobalWheel = time;
        });
        
        this.callbackMap = callbackMap;
        this.callbacks = {};

        //Sly ------------------------------------------------------------------------
    
        // if (!(this instanceof SlideBars)) return new SlideBars(frame, options, callbackMap);
        
        // Default options
        this.defaults = {
            slidee:     null,  // Selector, DOM element, or jQuery object with DOM element representing SLIDEE.
            horizontal: false, // Switch to horizontal mode.

            // Item based navigation
            itemNav:        null,  // Item navigation type. Can be: 'basic', 'centered', 'forceCentered'.
            itemSelector:   null,  // Select only items that match this selector.
            smart:          false, // Repositions the activated item to help with further navigation.
            activateOn:     null,  // Activate an item on this event. Can be: 'click', 'mouseenter', ...
            activateMiddle: false, // Always activate the item in the middle of the FRAME. forceCentered only.

            // Scrolling
            scrollSource: null,  // Element for catching the mouse wheel scrolling. Default is FRAME.
            scrollBy:     0,     // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
            scrollHijack: 300,   // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
            scrollTrap:   false, // Don't bubble scrolling when hitting scrolling limits.

            // Dragging
            dragSource:    null,  // Selector or DOM element for catching dragging events. Default is FRAME.
            mouseDragging: false, // Enable navigation by dragging the SLIDEE with mouse cursor.
            touchDragging: false, // Enable navigation by dragging the SLIDEE with touch events.
            releaseSwing:  false, // Ease out on dragging swing release.
            swingSpeed:    0.2,   // Swing synchronization speed, where: 1 = instant, 0 = infinite.
            elasticBounds: false, // Stretch SLIDEE position limits when dragging past FRAME boundaries.
            dragThreshold: 3,     // Distance in pixels before Sly recognizes dragging.
            interactive:   null,  // Selector for special interactive elements.

            // Scrollbar
            scrollBar:     null,  // Selector or DOM element for scrollbar container.
            dragHandle:    false, // Whether the scrollbar handle should be draggable.
            dynamicHandle: false, // Scrollbar handle represents the ratio between hidden and visible content.
            minHandleSize: 50,    // Minimal height or width (depends on sly direction) of a handle in pixels.
            clickBar:      false, // Enable navigation by clicking on scrollbar.
            syncSpeed:     0.5,   // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.

            // Pagesbar
            pagesBar:       null, // Selector or DOM element for pages bar container.
            activatePageOn: null, // Event used to activate page. Can be: click, mouseenter, ...
            pageBuilder:          // Page item generator.
                function (index) {
                    return '<li>' + (index + 1) + '</li>';
                },

            // Navigation buttons
            forward:  null, // Selector or DOM element for "forward movement" button.
            backward: null, // Selector or DOM element for "backward movement" button.
            prev:     null, // Selector or DOM element for "previous item" button.
            next:     null, // Selector or DOM element for "next item" button.
            prevPage: null, // Selector or DOM element for "previous page" button.
            nextPage: null, // Selector or DOM element for "next page" button.

            // Automated cycling
            cycleBy:       null,  // Enable automatic cycling by 'items' or 'pages'.
            cycleInterval: 5000,  // Delay between cycles in milliseconds.
            pauseOnHover:  false, // Pause cycling when mouse hovers over the FRAME.
            startPaused:   false, // Whether to start in paused sate.

            // Mixed options
            moveBy:        300,     // Speed in pixels per second used by forward and backward buttons.
            speed:         0,       // Animations speed in milliseconds. 0 to disable animations.
            easing:        'swing', // Easing for duration based (tweening) animations.
            startAt:       null,    // Starting offset in pixels or items.
            keyboardNavBy: null,    // Enable keyboard navigation by 'items' or 'pages'.

            // Classes
            draggedClass:  'dragged', // Class for dragged elements (like SLIDEE or scrollbar handle).
            activeClass:   'active',  // Class for active items and pages.
            disabledClass: 'disabled' // Class for disabled navigation elements.
        };
		// Extend options
		this.o = $.extend({}, this.defaults, options);

        if (frame instanceof HTMLElement)
        {   
            if(frame.clientWidth == 0)
            {
                this.mutationObserver(frame, ()=>{
                    setTimeout(() => this.create(frame), 100);
                });
            }
            else
            {
                setTimeout(() => this.create(frame), 100);
            }
        }
        else
        {
            throw new Error('Must HTMLElement type !');
        }
    }
    
    create(frame)
    {
        	// Private variables
		this.parallax = this.isNumber(frame);

		// Frame
		this.$frame = $(frame);
		this.$slidee = this.o.slidee ? $(this.o.slidee).eq(0) : this.$frame.children().eq(0);
		this.frameSize = 0;
		this.slideeSize = 0;
		this.pos = {
			start: 0,
			center: 0,
			end: 0,
			cur: 0,
			dest: 0
		};

		// Scrollbar
		this.$sb = $(this.o.scrollBar).eq(0);
		this.$handle = this.$sb.children().eq(0);
		this.sbSize = 0;
		this.handleSize = 0;
		this.hPos = {
			start: 0,
			end: 0,
			cur: 0
		};

		// Pagesbar
		this.$pb = $(this.o.pagesBar);
		this.$pages = 0;
		this.pages = [];

		// Items
		this.$items = 0;
		this.items = [];
		this.rel = {
			firstItem: 0,
			lastItem: 0,
			centerItem: 0,
			activeItem: null,
			activePage: 0
		};

		// Styles
		this.frameStyles = new StyleRestorer(this.$frame[0]);
		this.slideeStyles = new StyleRestorer(this.$slidee[0]);
		this.sbStyles = new StyleRestorer(this.$sb[0]);
		this.handleStyles = new StyleRestorer(this.$handle[0]);

		// Navigation type booleans
		this.basicNav = this.o.itemNav === 'basic';
		this.forceCenteredNav = this.o.itemNav === 'forceCentered';
		this.centeredNav = this.o.itemNav === 'centered' || this.forceCenteredNav;
		this.itemNav = !this.parallax && (this.basicNav || this.centeredNav || this.forceCenteredNav);

		// Miscellaneous
		this.$scrollSource = this.o.scrollSource ? $(this.o.scrollSource) : this.$frame;
		this.$dragSource = this.o.dragSource ? $(this.o.dragSource) : this.$frame;
		this.$forwardButton = $(this.o.forward);
		this.$backwardButton = $(this.o.backward);
		this.$prevButton = $(this.o.prev);
		this.$nextButton = $(this.o.next);
		this.$prevPageButton = $(this.o.prevPage);
        this.$nextPageButton = $(this.o.nextPage);
        
        if(!this.callbacks) 
            this.callbacks  = {};

		this.last = {};
		this.animation = {};
		this.move = {};
		this.dragging = {
            released: 1,
            init:undefined
		};
		this.scrolling = {
			last: 0,
			delta: 0,
			resetTime: 200
		};
		this.renderID = 0;
		this.historyID = 0;
		this.cycleID = 0;
		this.continuousID = 0;
        this.i = 0;
        this.l = 0;

		// Normalizing frame
		if (!this.parallax) {
			frame = this.$frame[0];
		}

		// Expose properties
		this.initialized = 0;
		this.frame = frame;
		this.slidee = this.$slidee[0];
		this.pos = this.pos;
		this.rel = this.rel;
		// this.items = this.items;
		this.pages = this.pages;
		this.isPaused = 0;
		this.options = this.o;
        // this.dragging = this.dragging;
        
        this.polyfill();
        this.featureDetects();
        this.init();
    }
    /**
     * 创建jquery代理
     */
    createJqueryProxy()
    {
        // jQuery proxy
        $.fn[this.pluginName] = function (options, callbackMap) {
            var method, methodArgs;

            // Attributes logic
            if (!$.isPlainObject(options)) {
                if (SlideBars.type(options) === 'string' || options === false) {
                    method = options === false ? 'destroy' : options;
                    methodArgs = Array.prototype.slice.call(arguments, 1);
                }
                options = {};
            }

            // Apply to all elements
            return this.each( (i, element) => {
                // Call with prevention against multiple instantiations
                var plugin = SlideBars.getInstance(element,this.namespace);
         
                if (!plugin && !method) {
                    // Create a new object if it doesn't exist yet
                    plugin = new SlideBars(element, options, callbackMap).init();
                } else if (plugin && method) {
                    // Call method
                    if (plugin[method]) {
                        plugin[method].apply(plugin, methodArgs);
                    }
                }
            });
        };
    }

    // Local WindowAnimationTiming interface polyfill
    private polyfill()
    {
        (window as any).requestAnimationFrame = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || fallback;

        /**
        * Fallback implementation.
        */
        var prev = new Date().getTime();
        function fallback(fn) {
            var curr = new Date().getTime();
            var ms = Math.max(0, 16 - (curr - prev));
            var req = setTimeout(fn, ms);
            prev = curr;
            return req;
        }

        /**
        * Cancel.
        */
        var cancel = window.cancelAnimationFrame
            || window.webkitCancelAnimationFrame
            || window.clearTimeout;

            window.cancelAnimationFrame = (id)=>{
                cancel.call(window, id);
        }   ;
       
    }

    //Feature detects
    private featureDetects()
    {
        var prefixes = ['', 'Webkit', 'Moz', 'ms', 'O'];
        var el = document.createElement('div');

        function testProp(prop) {
            for (var p = 0, pl = prefixes.length; p < pl; p++) {
                var prefixedProp = prefixes[p] ? prefixes[p] + prop.charAt(0).toUpperCase() + prop.slice(1) : prop;
                if (el.style[prefixedProp] != null) {
                    return prefixedProp;
                }
            }
        }

        // Global support indicators
        this.transform = testProp('transform');
        this.gpuAcceleration = testProp('perspective') ? 'translateZ(0) ' : '';
    

        // Expose class globally
        window[this.className] = SlideBars;

    }
    /**
     * dom element observer
     * @param element
     * @param ready 
     */
    private mutationObserver(element:Node, ready:Function)
    {
        const observer = new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                const {left, top, width, height} = entry.contentRect;
                // console.log('Element:', entry.target);
                // console.log(`Element's size: ${ width }px x ${ height }px`);
                // console.log(`Element's paddings: ${ top }px ; ${ left }px`);
                if(width>0)
                {
                    observer.disconnect();
                    ready();
                }
            }
        });
        observer.observe(document.body);
    }
    /**
     * Loading function.
     *
     * Populate arrays, set sizes, bind events, ...
     *
     * @param {Boolean} [isInit] Whether load is called from within self.init().
     * @return {Void}
     */
	load(isInit=false) {
        // Local variables
        var lastItemsCount = 0;
        var lastPagesCount = this.pages.length;

        // Save old position
        this.pos.old = $.extend({}, this.pos);

        // Reset global variables
        this.frameSize = this.parallax ? 0 : this.$frame[this.o.horizontal ? 'width' : 'height']();
        this.sbSize = this.$sb[this.o.horizontal ? 'width' : 'height']();
        this.slideeSize = this.parallax ? this.frame : this.$slidee[this.o.horizontal ? 'outerWidth' : 'outerHeight']();
        this.pages.length = 0;
        // Set position limits & relatives
        this.pos.start = 0;
        this.pos.end = this.max(this.slideeSize - this.frameSize, 0);
  
        // Sizes & offsets for item based navigations
        if (this.itemNav) {
            // Save the number of current items
            lastItemsCount =  this.items.length;

            // Reset itemNav related variables
            this.$items = this.$slidee.children(this.o.itemSelector);
            this.items.length = 0;

            // Needed variables
            let paddingStart = this.getPx(this.$slidee, this.o.horizontal ? 'paddingLeft' : 'paddingTop');
            let paddingEnd = this.getPx(this.$slidee, this.o.horizontal ? 'paddingRight' : 'paddingBottom');
            let borderBox = $(this.$items).css('boxSizing') === 'border-box';
            let areFloated = this.$items.css('float') !== 'none';
            let ignoredMargin = 0;
            let lastItemIndex = this.$items.length - 1;
            let lastItem;

            // Reset slideeSize
            this.slideeSize = 0;

            // Iterate through items
            this.$items.each( (i, element)=> {
                // Item
                let $item = $(element);
                let rect = element.getBoundingClientRect();
                let itemSize = this.round(this.o.horizontal ? rect.width || rect.right - rect.left : rect.height || rect.bottom - rect.top);
                let itemMarginStart = this.getPx($item, this.o.horizontal ? 'marginLeft' : 'marginTop');
                let itemMarginEnd = this.getPx($item, this.o.horizontal ? 'marginRight' : 'marginBottom');
                let itemSizeFull = itemSize + itemMarginStart + itemMarginEnd;
                let singleSpaced = !itemMarginStart || !itemMarginEnd;
                let item:any = {};
                item.el = element;
                item.size = singleSpaced ? itemSize : itemSizeFull;
                item.half = item.size / 2;
                item.start = this.slideeSize + (singleSpaced ? itemMarginStart : 0);
                item.center = item.start - this.round(this.frameSize / 2 - item.size / 2);
                item.end = item.start - this.frameSize + item.size;

                // Account for slidee padding
                if (!i) {
                    this.slideeSize += paddingStart;
                }

                // Increment slidee size for size of the active element
                this.slideeSize += itemSizeFull;

                // Try to account for vertical margin collapsing in vertical mode
                // It's not bulletproof, but should work in 99% of cases
                if (!this.o.horizontal && !areFloated) {
                    // Subtract smaller margin, but only when top margin is not 0, and this is not the first element
                    if (itemMarginEnd && itemMarginStart && i > 0) {
                        this.slideeSize -= this.min(itemMarginStart, itemMarginEnd);
                    }
                }

                // Things to be done on last item
                if (i === lastItemIndex) {
                    item.end += paddingEnd;
                    this.slideeSize += paddingEnd;
                    ignoredMargin = singleSpaced ? itemMarginEnd : 0;
                }

                // Add item object to items array
                this.items.push(item);
                lastItem = item;
            });

            // Resize SLIDEE to fit all items
            this.$slidee[0].style[this.o.horizontal ? 'width' : 'height'] = (borderBox ? this.slideeSize: this.slideeSize - paddingStart - paddingEnd) + 'px';

            // Adjust internal SLIDEE size for last margin
            this.slideeSize -= ignoredMargin;

            // Set limits
            if (this.items.length) {
                this.pos.start =  this.items[0][this.forceCenteredNav ? 'center' : 'start'];
                this.pos.end = this.forceCenteredNav ? lastItem.center : this.frameSize < this.slideeSize ? lastItem.end : this.pos.start;
            } else {
                this.pos.start = this.pos.end = 0;
            }
        }

        // Calculate SLIDEE center position
        this.pos.center = this.round( this.pos.end / 2 +  this.pos.start / 2);

        // Update relative positions
        this.updateRelatives();

        // Scrollbar
        if (this.$handle.length && this.sbSize > 0) {
            // Stretch scrollbar handle to represent the visible area
            if (this.o.dynamicHandle) {
                this.handleSize = this.pos.start === this.pos.end ? this.sbSize : this.round(this.sbSize * this.frameSize / this.slideeSize);
                this.handleSize = this.within(this.handleSize, this.o.minHandleSize, this.sbSize);
                this.$handle[0].style[this.o.horizontal ? 'width' : 'height'] = this.handleSize + 'px';
            } else {
                this.handleSize = this.$handle[this.o.horizontal ? 'outerWidth' : 'outerHeight']();
            }

            this.hPos.end = this.sbSize - this.handleSize;

            if (!this.renderID) {
                this.syncScrollbar();
            }
        }

        // Pages
        if (!this.parallax && this.frameSize > 0) {
            var tempPagePos = this.pos.start;
            var pagesHtml = '';

            // Populate pages array
            if (this.itemNav) {
                $.each(this.items,  (i, item)=>{
                    if (this.forceCenteredNav) {
                        this.pages.push(item.center);
                    } else if (item.start + item.size > tempPagePos && tempPagePos <= this.pos.end) {
                        tempPagePos = item.start;
                        this.pages.push(tempPagePos);
                        tempPagePos += this.frameSize;
                        if (tempPagePos > this.pos.end && tempPagePos < this.pos.end + this.frameSize) {
                            this.pages.push(this.pos.end);
                        }
                    }
                });
            } else {
                while (tempPagePos - this.frameSize < this.pos.end) {
                    this.pages.push(tempPagePos);
                    tempPagePos += this.frameSize;
                }
            }

            // Pages bar
            if (this.$pb[0] && lastPagesCount !== this.pages.length) {
                for (var i = 0; i < this.pages.length; i++) {
                    pagesHtml += this.o.pageBuilder.call(this, i);
                }
                this.$pages = this.$pb.html(pagesHtml).children();
                this.$pages.eq(this.rel.activePage).addClass(this.o.activeClass);
            }
        }

        // Extend relative variables object with some useful info
        this.rel.slideeSize = this.slideeSize;
        this.rel.frameSize = this.frameSize;
        this.rel.sbSize = this.sbSize;
        this.rel.handleSize = this.handleSize;

        // Activate requested position
        if (this.itemNav) {
            if (isInit && this.o.startAt != null) {
                this._activate(this.o.startAt);
                if(this.centeredNav)
                    this.toCenter(this.o.startAt);
                else
                    this.toStart(this.o.startAt);
            }
            // Fix possible overflowing
            var activeItem = this.items[this.rel.activeItem];
            this._slideTo(this.centeredNav && activeItem ? activeItem.center : this.within(this.pos.dest, this.pos.start, this.pos.end));
        } else {
            if (isInit) {
                if (this.o.startAt != null) this.slideTo(this.o.startAt, true);//1
            } else {
                // Fix possible overflowing
                this._slideTo(this.within(this.pos.dest, this.pos.start, this.pos.end));
            }
        }

        // Trigger load event
        this.trigger('load');
    }

    reload() { this.load(); };
    /**
     * Animate to a position.
     *
     * @param {Int}  newPos    New position.
     * @param {Bool} immediate Reposition immediately without an animation.
     * @param {Bool} dontAlign Do not align items, use the raw position passed in first argument.
     *
     * @return {Void}
     */
    private _slideTo(newPos, immediate =false, dontAlign=false) {
        // Align items
        if (this.itemNav && this.dragging.released && !dontAlign) {
            var tempRel = this.getRelatives(newPos);
            var isNotBordering = newPos > this.pos.start && newPos < this.pos.end;

            if (this.centeredNav) {
                if (isNotBordering) {
                    newPos = this.items[tempRel.centerItem].center;
                }
                if (this.forceCenteredNav && this.o.activateMiddle) {
                    this._activate(tempRel.centerItem);
                }
            } else if (isNotBordering) {
                newPos = this.items[tempRel.firstItem].start;
            }
        }
        
        // Handle overflowing position limits
        if (this.dragging.init && this.dragging.slidee && this.o.elasticBounds) {
            if (newPos > this.pos.end) {
                newPos = this.pos.end + (newPos - this.pos.end) / 6;
            } else if (newPos < this.pos.start) {
                newPos = this.pos.start + (newPos - this.pos.start) / 6;
            }
        } else {
            newPos = this.within(newPos, this.pos.start, this.pos.end);
        }

        // Update the animation object
        this.animation.start = +new Date();
        this.animation.time = 0;
        this.animation.from = this.pos.cur;
        this.animation.to = newPos;
        this.animation.delta = newPos - this.pos.cur;
        this.animation.tweesing = this.dragging.tweese || this.dragging.init && !this.dragging.slidee;
        this.animation.immediate = !this.animation.tweesing && (immediate || this.dragging.init && this.dragging.slidee || !this.o.speed);

        // Reset dragging tweesing request
        this.dragging.tweese = 0;
        
        // Start animation rendering
        if (newPos !== this.pos.dest) {
            this.pos.dest = newPos;
            this.trigger('change');
            if (!this.renderID) {
                this.render();
            }
        }

        // Reset next cycle timeout
        this.resetCycle();

        // Synchronize states
        this.updateRelatives();
        this.updateButtonsState();
        this.syncPagesbar();
    }
    /**
     * Render animation frame.
     *
     * @return {Void}
     */
    render() {
        if (!this.initialized) {
            return;
        }

        // If first render call, wait for next animationFrame
        if (!this.renderID) {
            this.renderID = requestAnimationFrame(this.render.bind(this));
            if (this.dragging.released) {
                this.trigger('moveStart');
            }
            return;
        }

        // If immediate repositioning is requested, don't animate.
        if (this.animation.immediate) {
            this.pos.cur = this.animation.to;
        }
        // Use tweesing for animations without known end point
        else if (this.animation.tweesing) {
            this.animation.tweeseDelta = this.animation.to - this.pos.cur;
            // Fuck Zeno's paradox
            if (this.abs(this.animation.tweeseDelta) < 0.1) {
                this.pos.cur = this.animation.to;
            } else {
                this.pos.cur += this.animation.tweeseDelta * (this.dragging.released ? this.o.swingSpeed : this.o.syncSpeed);
            }
        }
        // Use tweening for basic animations with known end point
        else {
            this.animation.time = this.min(+new Date() - this.animation.start, this.o.speed);
            this.pos.cur = this.animation.from + this.animation.delta * $.easing[this.o.easing](this.animation.time/this.o.speed, this.animation.time, 0, 1, this.o.speed);
        }

        // If there is nothing more to render break the rendering loop, otherwise request new animation frame.
        if (this.animation.to === this.pos.cur) {
            this.pos.cur = this.animation.to;
            this.dragging.tweese = this.renderID = 0;
        } else {
            this.renderID = requestAnimationFrame(this.render.bind(this));
        }

        this.trigger('move');

        // Update SLIDEE position
        if (!this.parallax) {
            if (this.transform) {
                this.$slidee[0].style[this.transform] = this.gpuAcceleration + (this.o.horizontal ? 'translateX' : 'translateY') + '(' + (-this.pos.cur) + 'px)';
            } else {
                this.$slidee[0].style[this.o.horizontal ? 'left' : 'top'] = -this.round(this.pos.cur) + 'px';
            }
        }

        // When animation reached the end, and dragging is not active, trigger moveEnd
        if (!this.renderID && this.dragging.released) {
            this.trigger('moveEnd');
        }

        this.syncScrollbar();
    }

    
    /**
     * Synchronizes scrollbar with the SLIDEE.
     *
     * @return {Void}
     */
    private syncScrollbar() {
        if (this.$handle.length) {
            this.hPos.cur = this.pos.start === this.pos.end ? 0 : (((this.dragging.init && !this.dragging.slidee) ? this.pos.dest : this.pos.cur) - this.pos.start) / (this.pos.end - this.pos.start) * this.hPos.end;
            this.hPos.cur = this.within(this.round(this.hPos.cur), this.hPos.start, this.hPos.end);
            if (this.last.hPos !== this.hPos.cur) {
                this.last.hPos = this.hPos.cur;
                if (this.transform) {
                    this.$handle[0].style[this.transform] = this.gpuAcceleration + (this.o.horizontal ? 'translateX' : 'translateY') + '(' + this.hPos.cur + 'px)';
                } else {
                    this.$handle[0].style[this.o.horizontal ? 'left' : 'top'] = this.hPos.cur + 'px';
                }
            }
        }
    }

    /**
     * Synchronizes pagesbar with SLIDEE.
     *
     * @return {Void}
     */
    private syncPagesbar() {
        if (this.$pages[0] && this.last.page !== this.rel.activePage) {
            this.last.page = this.rel.activePage;
            this.$pages.removeClass(this.o.activeClass).eq(this.rel.activePage).addClass(this.o.activeClass);
            this.trigger('activePage', this.last.page);
        }
    }

    /**
     * Returns the position object.
     *
     * @param {Mixed} item
     *
     * @return {Object}
     */
    private getPos(item) {
        if (this.itemNav) {
            let index = this.getIndex(item);
            return index !== -1 ? this.items[index] : false;
        } else {
            var $item = this.$slidee.find(item).eq(0);

            if ($item[0]) {
                var offset = this.o.horizontal ? $item.offset().left - this.$slidee.offset().left : $item.offset().top - this.$slidee.offset().top;
                var size = $item[this.o.horizontal ? 'outerWidth' : 'outerHeight']();

                return {
                    start: offset,
                    center: offset - this.frameSize / 2 + size / 2,
                    end: offset - this.frameSize + size,
                    size: size
                };
            } else {
                return false;
            }
        }
    }

    /**
     * Continuous move in a specified direction.
     *
     * @param  {Bool} forward True for forward movement, otherwise it'll go backwards.
     * @param  {Int}  speed   Movement speed in pixels per frame. Overrides options.moveBy value.
     *
     * @return {Void}
     */
    private moveBy(speed) 
    {
        this.move.speed = speed;
        // If already initiated, or there is nowhere to move, abort
        if (this.dragging.init || !this.move.speed || this.pos.cur === (this.move.speed > 0 ? this.pos.end : this.pos.start)) {
            return;
        }
        // Initiate move object
        this.move.lastTime = +new Date();
        this.move.startPos = this.pos.cur;
        // Set dragging as initiated
        this.continuousInit('button');
        this.dragging.init = 1;
        // Start movement
        this.trigger('moveStart');
        cancelAnimationFrame(this.continuousID.bind(this));
        this.moveLoop();
    }

    /**
     * Continuous movement loop.
     *
     * @return {Void}
     */
    private moveLoop() 
    {
        // If there is nowhere to move anymore, stop
        if (!this.move.speed || this.pos.cur === (this.move.speed > 0 ? this.pos.end : this.pos.start)) {
            this.stop();
        }
        // Request new move loop if it hasn't been stopped
        this.continuousID = this.dragging.init ? requestAnimationFrame(this.moveLoop.bind(this)) : 0;
        // Update move object
        this.move.now = +new Date();
        this.move.pos = this.pos.cur + (this.move.now - this.move.lastTime) / 1000 * this.move.speed;
        // Slide
        this.slideTo(this.dragging.init ? this.move.pos : this.round(this.move.pos));
        // Normally, this is triggered in render(), but if there
        // is nothing to render, we have to do it manually here.
        if (!this.dragging.init && this.pos.cur === this.pos.dest) {
            this.trigger('moveEnd');
        }
        // Update times for future iteration
        this.move.lastTime = this.move.now;
    }

    /**
     * Stops continuous movement.
     *
     * @return {Void}
     */
    stop () {
        if (this.dragging.source === 'button') {
            this.dragging.init = 0;
            this.dragging.released = 1;
        }
    }

    /**
     * Activate previous item.
     *
     * @return {Void}
     */
    prev () {
        this.activate(this.rel.activeItem == null ? 0 : this.rel.activeItem - 1);
    }

    /**
     * Activate next item.
     *
     * @return {Void}
     */
    next() {
        this.activate(this.rel.activeItem == null ? 0 : this.rel.activeItem + 1);
    }

    /**
     * Activate previous page.
     *
     * @return {Void}
     */
    prevPage() {
        this.activatePage(this.rel.activePage - 1);
    }

    /**
     * Activate next page.
     *
     * @return {Void}
     */
    nextPage() {
        this.activatePage(this.rel.activePage + 1);
    };

    /**
     * Slide SLIDEE by amount of pixels.
     *
     * @param {Int}  delta     Pixels/Items. Positive means forward, negative means backward.
     * @param {Bool} immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    slideBy(delta, immediate = false) {
        if (!delta) {
            return;
        }
        if (this.itemNav) {
            (this.centeredNav ? this.toCenter : this.toStart)(
                this.within((this.centeredNav ? this.rel.centerItem : this.rel.firstItem) + this.o.scrollBy * delta, 0, this.items.length)
            );
        } else {
            this.slideTo(this.pos.dest + delta, immediate);
        }
    };

    /**
     * Animate SLIDEE to a specific position.
     *
     * @param {Int}  pos       New position.
     * @param {Bool} immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    slideTo(pos, immediate=false) 
    {
        this._slideTo(pos, immediate);
    }

    /**
     * Core method for handling `toLocation` methods.
     *
     * @param  {String} location
     * @param  {Mixed}  item
     * @param  {Bool}   immediate
     *
     * @return {Void}
     */
    private to(location, item, immediate) {
        // Optional arguments logic
        if (SlideBars.type(item) === 'boolean') {
            immediate = item;
            item = undefined;
        }

        if (item === undefined) {
            this._slideTo(this.pos[location], immediate);
        } else {
            // You can't align items to sides of the frame
            // when centered navigation type is enabled
            if (this.centeredNav && location !== 'center') {
                return;
            }

            var itemPos = this.getPos(item);
            if (itemPos) {
                this._slideTo(itemPos[location], immediate, !this.centeredNav);
            }
        }
    }

    /**
     * Animate element or the whole SLIDEE to the start of the frame.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
     * @param {Bool}  immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    toStart(item, immediate = false)
    {
        this.to('start', item, immediate);
    }

    /**
     * Animate element or the whole SLIDEE to the end of the frame.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
     * @param {Bool}  immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    toEnd(item, immediate) {
        this.to('end', item, immediate);
    }

    /**
     * Animate element or the whole SLIDEE to the center of the frame.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
     * @param {Bool}  immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    toCenter(item, immediate = false) {
        this.to('center', item, immediate);
    }

    /**
     * Get the index of an item in SLIDEE.
     *
     * @param {Mixed} item     Item DOM element.
     *
     * @return {Int}  Item index, or -1 if not found.
     */
    private getIndex(item) {
        return item != null ?
                this.isNumber(item) ?
                    item >= 0 && item < this.items.length ? item : -1 :
                    this.$items.index(item) :
                -1;
    }
    /**
     * Get index of an item in SLIDEE based on a variety of input types.
     *
     * @param  {Mixed} item DOM element, positive or negative integer.
     *
     * @return {Int}   Item index, or -1 if not found.
     */
    private getRelativeIndex(item) {
        return this.getIndex(this.isNumber(item) && item < 0 ? item + this.items.length : item);
    }

    /**
     * Activates an item.
     *
     * @param  {Mixed} item Item DOM element, or index starting at 0.
     *
     * @return {Mixed} Activated item index or false on fail.
     */
    private _activate(item, force=undefined) {
        var index = this.getIndex(item);

        if (!this.itemNav || index < 0) {
            return false;
        }

        // Update classes, last active index, and trigger active event only when there
        // has been a change. Otherwise just return the current active index.
        if (this.last.active !== index || force) {
            // Update classes
            this.$items.eq(this.rel.activeItem).removeClass(this.o.activeClass);
            this.$items.eq(index).addClass(this.o.activeClass);

            this.last.active = this.rel.activeItem = index;

            this.updateButtonsState();
            this.trigger('active', index);
        }

        return index;
    }

    /**
     * Activates an item and helps with further navigation when o.smart is enabled.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0.
     * @param {Bool}  immediate Whether to reposition immediately in smart navigation.
     *
     * @return {Void}
     */
    activate(item, immediate = false)
    {
        var index = this._activate(item);

        // Smart navigation
        if (this.o.smart && index !== false) {
            // When centeredNav is enabled, center the element.
            // Otherwise, determine where to position the element based on its current position.
            // If the element is currently on the far end side of the frame, assume that user is
            // moving forward and animate it to the start of the visible frame, and vice versa.
          if (this.centeredNav) {
                this.toCenter(index, immediate);
            } else if (index >= this.rel.lastItem) {
                this.toStart(index, immediate);
            } else if (index <= this.rel.firstItem) {
                this.toEnd(index, immediate);
            } else {
                this.resetCycle();
            }
        }
    }

    /**
     * Activates a page.
     *
     * @param {Int}  index     Page index, starting from 0.
     * @param {Bool} immediate Whether to reposition immediately without animation.
     *
     * @return {Void}
     */
    activatePage (index, immediate=false) {
        if (this.isNumber(index)) {
            this.slideTo(this.pages[this.within(index, 0, this.pages.length - 1)], immediate);
        }
    }

    /**
     * Return relative positions of items based on their visibility within FRAME.
     *
     * @param {Int} slideePos Position of SLIDEE.
     *
     * @return {Void}
     */
    private getRelatives(slideePos) {
        slideePos = this.within(this.isNumber(slideePos) ? slideePos : this.pos.dest, this.pos.start, this.pos.end);

        let relatives:any = {};
        let centerOffset = this.forceCenteredNav ? 0 : this.frameSize / 2;

        // Determine active page
        if (!this.parallax) {
            for (let p = 0, pl = this.pages.length; p < pl; p++) {
                if (slideePos >= this.pos.end || p === this.pages.length - 1) {
                    relatives.activePage = this.pages.length - 1;
                    break;
                }

                if (slideePos <= this.pages[p] + centerOffset) {
                    relatives.activePage = p;
                    break;
                }
            }
        }

        // Relative item indexes
        if (this.itemNav) {
            let first:any = false;
            let last:any = false;
            let center:any = false;

            // From start
            for (let i = 0, il = this.items.length; i < il; i++) {
                // First item
                if (first === false && slideePos <= this.items[i].start + this.items[i].half) {
                    first = i;
                }

                // Center item
                if (center === false && slideePos <= this.items[i].center + this.items[i].half) {
                    center = i;
                }

                // Last item
                if (i === il - 1 || slideePos <= this.items[i].end + this.items[i].half) {
                    last = i;
                    break;
                }
            }

            // Safe assignment, just to be sure the false won't be returned
            relatives.firstItem = this.isNumber(first) ? first : 0;
            relatives.centerItem = this.isNumber(center) ? center : relatives.firstItem;
            relatives.lastItem = this.isNumber(last) ? last : relatives.centerItem;
        }

        return relatives;
    }

    /**
     * Update object with relative positions.
     *
     * @param {Int} newPos
     *
     * @return {Void}
     */
    private updateRelatives(newPos=undefined) {
        $.extend(this.rel, this.getRelatives(newPos));
    }
	/**
     * Disable navigation buttons when needed.
     *
     * Adds disabledClass, and when the button is <button> or <input>, activates :disabled state.
     *
     * @return {Void}
     */
    private updateButtonsState() {
        var isStart = this.pos.dest <= this.pos.start;
        var isEnd = this.pos.dest >= this.pos.end;
        var slideePosState = (isStart ? 1 : 0) | (isEnd ? 2 : 0);

        // Update paging buttons only if there has been a change in SLIDEE position
        if (this.last.slideePosState !== slideePosState) {
            this.last.slideePosState = slideePosState;

            if (this.$prevPageButton.is('button,input')) {
                this.$prevPageButton.prop('disabled', isStart);
            }

            if (this.$nextPageButton.is('button,input')) {
                this.$nextPageButton.prop('disabled', isEnd);
            }

            this.$prevPageButton.add(this.$backwardButton)[isStart ? 'addClass' : 'removeClass'](this.o.disabledClass);
            this.$nextPageButton.add(this.$forwardButton)[isEnd ? 'addClass' : 'removeClass'](this.o.disabledClass);
        }

        // Forward & Backward buttons need a separate state caching because we cannot "property disable"
        // them while they are being used, as disabled buttons stop emitting mouse events.
        if (this.last.fwdbwdState !== slideePosState && this.dragging.released) {
            this.last.fwdbwdState = slideePosState;

            if (this.$backwardButton.is('button,input')) {
                this.$backwardButton.prop('disabled', isStart);
            }

            if (this.$forwardButton.is('button,input')) {
                this.$forwardButton.prop('disabled', isEnd);
            }
        }

        // Item navigation
        if (this.itemNav && this.rel.activeItem != null) {
            var isFirst = this.rel.activeItem === 0;
            var isLast = this.rel.activeItem >= this.items.length - 1;
            var itemsButtonState = (isFirst ? 1 : 0) | (isLast ? 2 : 0);

            if (this.last.itemsButtonState !== itemsButtonState) {
                this.last.itemsButtonState = itemsButtonState;

                if (this.$prevButton.is('button,input')) {
                    this.$prevButton.prop('disabled', isFirst);
                }

                if (this.$nextButton.is('button,input')) {
                    this.$nextButton.prop('disabled', isLast);
                }

                this.$prevButton[isFirst ? 'addClass' : 'removeClass'](this.o.disabledClass);
                this.$nextButton[isLast ? 'addClass' : 'removeClass'](this.o.disabledClass);
            }
        }
    }

    /**
     * Resume cycling.
     *
     * @param {Int} priority Resume pause with priority lower or equal than this. Used internally for pauseOnHover.
     *
     * @return {Void}
     */
    resume(priority=-1) 
    {
        if (!this.o.cycleBy || !this.o.cycleInterval || this.o.cycleBy === 'items' && (!this.items[0] || this.rel.activeItem == null) || priority < this.isPaused) {
            return;
        }

        this.isPaused = 0;

        if (this.cycleID) {
            this.cycleID = clearTimeout(this.cycleID);
        } else {
            this.trigger('resume');
        }

        this.cycleID = setTimeout( ()=>{
            this.trigger('cycle');
            switch (this.o.cycleBy) {
                case 'items':
                    this.activate(this.rel.activeItem >= this.items.length - 1 ? 0 : this.rel.activeItem + 1);
                    break;

                case 'pages':
                    this.activatePage(this.rel.activePage >= this.pages.length - 1 ? 0 : this.rel.activePage + 1);
                    break;
            }
        }, this.o.cycleInterval);
    }

    /**
     * Pause cycling.
     *
     * @param {Int} priority Pause priority. 100 is default. Used internally for pauseOnHover.
     *
     * @return {Void}
     */
    pause(priority=-1) {
        if (priority < this.isPaused) {
            return;
        }

        this.isPaused = priority || 100;

        if (this.cycleID) {
            this.cycleID = clearTimeout(this.cycleID);
            this.trigger('pause');
        }
    }

    /**
     * Toggle cycling.
     *
     * @return {Void}
     */
    toggle()
    {
        this.cycleID ? this.pause() : this.resume();
    }

    /**
     * Updates a signle or multiple option values.
     *
     * @param {Mixed} name  Name of the option that should be updated, or object that will extend the options.
     * @param {Mixed} value New option value.
     *
     * @return {Void}
     */
    set(name, value) {
        if ($.isPlainObject(name)) {
            $.extend(this.o, name);
        } else if (this.o.hasOwnProperty(name)) {
            this.o[name] = value;
        }
    }

    /**
     * Add one or multiple items to the SLIDEE end, or a specified position index.
     *
     * @param {Mixed} element Node element, or HTML string.
     * @param {Int}   index   Index of a new item position. By default item is appended at the end.
     *
     * @return {Void}
     */
    add(element, index) {
        var $element = $(element);

        if (this.itemNav) {
            // Insert the element(s)
            if (index == null || !this.items[0] || index >= this.items.length) {
                $element.appendTo(this.$slidee);
            } else if (this.items.length) {
                $element.insertBefore(this.items[index].el);
            }

            // Adjust the activeItem index
            if (this.rel.activeItem != null && index <= this.rel.activeItem) {
                this.last.active = this.rel.activeItem += $element.length;
            }
        } else {
            this.$slidee.append($element);
        }

        // Reload
        this.load();
    };

    /**
     * Remove an item from SLIDEE.
     *
     * @param {Mixed} element Item index, or DOM element.
     * @param {Int}   index   Index of a new item position. By default item is appended at the end.
     *
     * @return {Void}
     */
    remove(element) {
        if (this.itemNav) {
            var index = this.getRelativeIndex(element);

            if (index > -1) {
                // Remove the element
                this.$items.eq(index).remove();

                // If the current item is being removed, activate new one after reload
                var reactivate = index === this.rel.activeItem;

                // Adjust the activeItem index
                if (this.rel.activeItem != null && index < this.rel.activeItem) {
                    this.last.active = --this.rel.activeItem;
                }

                // Reload
                this.load();

                // Activate new item at the removed position
                if (reactivate) {
                    this.last.active = null;
                    this.activate(this.rel.activeItem);
                }
            }
        } else {
            $(element).remove();
            this.load();
        }
    };

    /**
     * Helps re-arranging items.
     *
     * @param  {Mixed} item     Item DOM element, or index starting at 0. Use negative numbers to select items from the end.
     * @param  {Mixed} position Item insertion anchor. Accepts same input types as item argument.
     * @param  {Bool}  after    Insert after instead of before the anchor.
     *
     * @return {Void}
     */
    private moveItem(item, position, after=false) {
        item = this.getRelativeIndex(item);
        position = this.getRelativeIndex(position);

        // Move only if there is an actual change requested
        if (item > -1 && position > -1 && item !== position && (!after || position !== item - 1) && (after || position !== item + 1)) {
            this.$items.eq(item)[after ? 'insertAfter' : 'insertBefore'](this.items[position].el);

            var shiftStart = item < position ? item : (after ? position : position - 1);
            var shiftEnd = item > position ? item : (after ? position + 1 : position);
            var shiftsUp = item > position;

            // Update activeItem index
            if (this.rel.activeItem != null) {
                if (item === this.rel.activeItem) {
                    this.last.active = this.rel.activeItem = after ? (shiftsUp ? position + 1 : position) : (shiftsUp ? position : position - 1);
                } else if (this.rel.activeItem > shiftStart && this.rel.activeItem < shiftEnd) {
                    this.last.active = this.rel.activeItem += shiftsUp ? 1 : -1;
                }
            }
            // Reload
            this.load();
        }
    }

    /**
     * Move item after the target anchor.
     *
     * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
     * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
     *
     * @return {Void}
     */
    moveAfter(item, position) 
    {
        this.moveItem(item, position, true);
    }

    /**
     * Move item before the target anchor.
     *
     * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
     * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
     *
     * @return {Void}
     */
    moveBefore(item, position) 
    {
        this.moveItem(item, position);
    };

    /**
     * Registers callbacks.
     *
     * @param  {Mixed} name  Event name, or callbacks map.
     * @param  {Mixed} fn    Callback, or an array of callback functions.
     *
     * @return {Void}
     */
    on (name, fn:any = undefined) {
        // Callbacks map
        if (SlideBars.type(name) === 'object') {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    this.on(key, name[key]);
                }
            }
        // Callback
        } else if (SlideBars.type(fn) === 'function') {
            var names = name.split(' ');
            for (var n = 0, nl = names.length; n < nl; n++) {
                this.callbacks[names[n]] = this.callbacks[names[n]] || [];
                if (this.callbackIndex(names[n], fn) === -1) {
                    this.callbacks[names[n]].push(fn);
                }
            }
        // Callbacks array
        } else if (SlideBars.type(fn) === 'array') {
            for (var f = 0, fl = fn.length; f < fl; f++) {
                this.on(name, fn[f]);
            }
        }
    }
 
    /**
     * Registers callbacks to be executed only once.
     *
     * @param  {Mixed} name  Event name, or callbacks map.
     * @param  {Mixed} fn    Callback, or an array of callback functions.
     *
     * @return {Void}
     */
    one(name, fn:Function) {
        var self = this;
        function proxy(){
            fn.apply(self, arguments);
            self.off(name, proxy);
        }
        this.on(name, proxy);
    }

    /**
     * Remove one or all callbacks.
     *
     * @param  {String} name Event name.
     * @param  {Mixed}  fn   Callback, or an array of callback functions. Omit to remove all callbacks.
     *
     * @return {Void}
     */
    off(name, fn) {
        if (fn instanceof Array) {
            for (var f = 0, fl = fn.length; f < fl; f++) {
                this.off(name, fn[f]);
            }
        } else {
            var names = name.split(' ');
            for (var n = 0, nl = names.length; n < nl; n++) {
                this.callbacks[names[n]] = this.callbacks[names[n]] || [];
                if (fn == null) {
                    this.callbacks[names[n]].length = 0;
                } else {
                    var index = this.callbackIndex(names[n], fn);
                    if (index !== -1) {
                        this.callbacks[names[n]].splice(index, 1);
                    }
                }
            }
        }
    };

    /**
     * Returns callback array index.
     *
     * @param  {String}   name Event name.
     * @param  {Function} fn   Function
     *
     * @return {Int} Callback array index, or -1 if isn't registered.
     */
    private callbackIndex(name, fn) {
        for (var i = 0, l = this.callbacks[name].length; i < l; i++) {
            if (this.callbacks[name][i] === fn) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Reset next cycle timeout.
     *
     * @return {Void}
     */
    private resetCycle() {
        if (this.dragging.released && !this.isPaused) {
            this.resume();
        }
    }

    /**
     * Calculate SLIDEE representation of handle position.
     *
     * @param  {Int} handlePos
     *
     * @return {Int}
     */
    private handleToSlidee(handlePos) 
    {
        return  this.round( this.within(handlePos,  this.hPos.start,  this.hPos.end) /  this.hPos.end * ( this.pos.end -  this.pos.start)) +  this.pos.start;
    }

    /**
     * Keeps track of a dragging delta history.
     *
     * @return {Void}
     */
    private draggingHistoryTick() {
        // Looking at this, I know what you're thinking :) But as we need only 4 history states, doing it this way
        // as opposed to a proper loop is ~25 bytes smaller (when minified with GCC), a lot faster, and doesn't
        // generate garbage. The loop version would create 2 new variables on every tick. Unexaptable!
        this.dragging.history[0] = this.dragging.history[1];
        this.dragging.history[1] = this.dragging.history[2];
        this.dragging.history[2] = this.dragging.history[3];
        this.dragging.history[3] = this.dragging.delta;
    }

    /**
     * Initialize continuous movement.
     *
     * @return {Void}
     */
    private continuousInit(source) {
        this.dragging.released = 0;
        this.dragging.source = source;
        this.dragging.slidee = source === 'slidee';
    }

    /**
     * Dragging initiator.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private dragInit(event) {
        var isTouch = event.type === 'touchstart';
        var source = event.data.source;
        var isSlidee = source === 'slidee';

        // Ignore when already in progress, or interactive element in non-touch navivagion
        if (this.dragging.init || !isTouch && this.isInteractive(event.target)) {
            return;
        }

        // Handle dragging conditions
        if (source === 'handle' && (!this.o.dragHandle || this.hPos.start === this.hPos.end)) {
            return;
        }

        // SLIDEE dragging conditions
        if (isSlidee && !(isTouch ? this.o.touchDragging : this.o.mouseDragging && event.which < 2)) {
            return;
        }

        if (!isTouch) {
            // prevents native image dragging in Firefox
            this.stopDefault(event);
        }

        // Reset dragging object
        this.continuousInit(source);

        // Properties used in dragHandler
        this.dragging.init = 0;
        this.dragging.$source = $(event.target);
        this.dragging.touch = isTouch;
        this.dragging.pointer = isTouch ? event.originalEvent.touches[0] : event;
        this.dragging.initX = this.dragging.pointer.pageX;
        this.dragging.initY = this.dragging.pointer.pageY;
        this.dragging.initPos = isSlidee ? this.pos.cur : this.hPos.cur;
        this.dragging.start = +new Date();
        this.dragging.time = 0;
        this.dragging.path = 0;
        this.dragging.delta = 0;
        this.dragging.locked = 0;
        this.dragging.history = [0, 0, 0, 0];
        this.dragging.pathToLock = isSlidee ? isTouch ? 30 : 10 : 0;

        // Bind dragging events
        this.$doc.on(isTouch ? this.dragTouchEvents : this.dragMouseEvents, this.dragHandler);

        // Pause ongoing cycle
        this.pause(1);

        // Add dragging class
        (isSlidee ? this.$slidee :this.$handle).addClass(this.o.draggedClass);

        // Trigger moveStart event
        this.trigger('moveStart');

        // Keep track of a dragging path history. This is later used in the
        // dragging release swing calculation when dragging SLIDEE.
        if (isSlidee) {
            this.historyID = setInterval(this.draggingHistoryTick.bind(this), 10);
        }
    }

    /**
     * Handler for dragging scrollbar handle or SLIDEE.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private dragHandler(event) 
    {
        this.dragging.released = event.type === 'mouseup' || event.type === 'touchend';
        this.dragging.pointer = this.dragging.touch ? event.originalEvent[this.dragging.released ? 'changedTouches' : 'touches'][0] : event;
        this.dragging.pathX = this.dragging.pointer.pageX - this.dragging.initX;
        this.dragging.pathY = this.dragging.pointer.pageY - this.dragging.initY;
        this.dragging.path = this.sqrt(this.pow(this.dragging.pathX, 2) + this.pow(this.dragging.pathY, 2));
        this.dragging.delta = this.o.horizontal ? this.dragging.pathX : this.dragging.pathY;

        if (!this.dragging.released && this.dragging.path < 1) return;

        // We haven't decided whether this is a drag or not...
        if (!this.dragging.init) {
            // If the drag path was very short, maybe it's not a drag?
            if (this.dragging.path < this.o.dragThreshold) {
                // If the pointer was released, the path will not become longer and it's
                // definitely not a drag. If not released yet, decide on next iteration
                return this.dragging.released ? this.dragEnd() : undefined;
            }
            else {
                // If dragging path is sufficiently long we can confidently start a drag
                // if drag is in different direction than scroll, ignore it
                if (this.o.horizontal ? this.abs(this.dragging.pathX) > this.abs(this.dragging.pathY) : this.abs(this.dragging.pathX) < this.abs(this.dragging.pathY)) {
                    this.dragging.init = 1;
                } else {
                    return this.dragEnd();
                }
            }
        }

        this.stopDefault(event);

        // Disable click on a source element, as it is unwelcome when dragging
        if (!this.dragging.locked && this.dragging.path > this.dragging.pathToLock && this.dragging.slidee) {
            this.dragging.locked = 1;
            this.dragging.$source.on(this.clickEvent, this.disableOneEvent);
        }

        // Cancel dragging on release
        if (this.dragging.released) {
            this.dragEnd();

            // Adjust path with a swing on mouse release
            if (this.o.releaseSwing && this.dragging.slidee) {
                this.dragging.swing = (this.dragging.delta - this.dragging.history[0]) / 40 * 300;
                this.dragging.delta += this.dragging.swing;
                this.dragging.tweese = this.abs(this.dragging.swing) > 10;
            }
        }

        this._slideTo(this.dragging.slidee ? this.round(this.dragging.initPos - this.dragging.delta) : this.handleToSlidee(this.dragging.initPos + this.dragging.delta));
    }

    /**
     * Stops dragging and cleans up after it.
     *
     * @return {Void}
     */
    private dragEnd() {
        clearInterval(this.historyID);
        this.dragging.released = true;
        this.$doc.off(this.dragging.touch ? this.dragTouchEvents : this.dragMouseEvents, this.dragHandler);
        (this.dragging.slidee ? this.$slidee : this.$handle).removeClass(this.o.draggedClass);

        // Make sure that disableOneEvent is not active in next tick.
        setTimeout( () =>{
            this.dragging.$source.off(this.clickEvent, this.disableOneEvent);
        });

        // Normally, this is triggered in render(), but if there
        // is nothing to render, we have to do it manually here.
        if (this.pos.cur === this.pos.dest && this.dragging.init) {
            this.trigger('moveEnd');
        }

        // Resume ongoing cycle
        this.resume(1);

        this.dragging.init = 0;
    }

    /**
     * Check whether element is interactive.
     *
     * @return {Boolean}
     */
    private isInteractive(element) {
        return ~$.inArray(element.nodeName, this.interactiveElements) || $(element).is(this.o.interactive);
    }

    /**
     * Continuous movement cleanup on mouseup.
     *
     * @return {Void}
     */
    private movementReleaseHandler() {
        this.stop();
        this.$doc.off('mouseup', this.movementReleaseHandler);
    }

    /**
     * Buttons navigation handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private buttonsHandler(event) {
        /*jshint validthis:true */
        this.stopDefault(event);
        switch (this) {
            case this.$forwardButton[0]:
            case this.$backwardButton[0]:
                this.moveBy(this.$forwardButton.is(this) ? this.o.moveBy : -this.o.moveBy);
                this.$doc.on('mouseup', this.movementReleaseHandler);
                break;

            case this.$prevButton[0]:
                this.prev();
                break;

            case this.$nextButton[0]:
                this.next();
                break;

            case this.$prevPageButton[0]:
                this.prevPage();
                break;

            case this.$nextPageButton[0]:
                this.nextPage();
                break;
        }
    }

    /**
     * Mouse wheel delta normalization.
     *
     * @param  {Event} event
     *
     * @return {Int}
     */
    private normalizeWheelDelta(event) {
        // wheelDelta needed only for IE8-
        this.scrolling.curDelta = ((this.o.horizontal ? event.deltaY || event.deltaX : event.deltaY) || -event.wheelDelta);
        this.scrolling.curDelta /= event.deltaMode === 1 ? 3 : 100;
        if (!this.itemNav) {
            return this.scrolling.curDelta;
        }
        this.time = +new Date();
        if (this.scrolling.last < this.time - this.scrolling.resetTime) {
            this.scrolling.delta = 0;
        }
        this.scrolling.last = this.time;
        this.scrolling.delta += this.scrolling.curDelta;
        if (this.abs(this.scrolling.delta) < 1) {
            this.scrolling.finalDelta = 0;
        } else {
            this.scrolling.finalDelta = this.round(this.scrolling.delta / 1);
            this.scrolling.delta %= 1;
        }
        return this.scrolling.finalDelta;
    }

    /**
     * Mouse scrolling handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private scrollHandler(event) {
        // Mark event as originating in a Sly instance
        event.originalEvent[this.namespace] = this;
        // Don't hijack global scrolling
        var time = +new Date();
        if (this.lastGlobalWheel + this.o.scrollHijack > time && this.$scrollSource[0] !== document && this.$scrollSource[0] !== window) {
            this.lastGlobalWheel = time;
            return;
        }
        // Ignore if there is no scrolling to be done
        if (!this.o.scrollBy || this.pos.start === this.pos.end) {
            return;
        }
        var delta = this.normalizeWheelDelta(event.originalEvent);
        // Trap scrolling only when necessary and/or requested
        if (this.o.scrollTrap || delta > 0 && this.pos.dest <this.pos.end || delta < 0 && this.pos.dest > this.pos.start) {
            this.stopDefault(event, true);
        }
        this.slideBy(this.o.scrollBy * delta);
    }

    /**
     * Scrollbar click handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private scrollbarHandler(event) {
        // Only clicks on scroll bar. Ignore the handle.
        if (this.o.clickBar && event.target === this.$sb[0]) {
            this.stopDefault(event);
            // Calculate new handle position and sync SLIDEE to it
            this.slideTo(this.handleToSlidee((this.o.horizontal ? event.pageX - this.$sb.offset().left : event.pageY - this.$sb.offset().top) - this.handleSize / 2));
        }
    }

    /**
     * Keyboard input handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private keyboardHandler(event) {
        if (!this.o.keyboardNavBy) {
            return;
        }

        switch (event.which) {
            // Left or Up
            case this.o.horizontal ? 37 : 38:
                this.stopDefault(event);
                this[this.o.keyboardNavBy === 'pages' ? 'prevPage' : 'prev']();
                break;

            // Right or Down
            case this.o.horizontal ? 39 : 40:
                this.stopDefault(event);
                this[this.o.keyboardNavBy === 'pages' ? 'nextPage' : 'next']();
                break;
        }
    }

    /**
     * Click on item activation handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private activateHandler(event) {
        /*jshint validthis:true */
        let target = event.currentTarget;
        
        // Ignore clicks on interactive elements.
        if (this.isInteractive(target)) {
            event.originalEvent[this.namespace + 'ignore'] = true;
            return;
        }
        
        // Ignore events that:
        // - are not originating from direct SLIDEE children
        // - originated from interactive elements
      if (target.parentNode !== this.$slidee[0] || event.originalEvent[this.namespace + 'ignore']) return;

       this.activate(target);
    }

    /**
     * Click on page button handler.
     *
     * @param {Event} event
     *
     * @return {Void}
     */
    private activatePageHandler() {
        /*jshint validthis:true */
        // Accept only events from direct pages bar children.
        if (this.parentNode === this.$pb[0]) {
            this.activatePage(this.$pages.index(this));
        }
    }

    /**
     * Pause on hover handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private pauseOnHoverHandler(event) {
        if (this.o.pauseOnHover) {
            this[event.type === 'mouseenter' ? 'pause' : 'resume'](2);
        }
    }

    /**
     * Trigger callbacks for event.
     *
     * @param  {String} name Event name.
     * @param  {Mixed}  argX Arguments passed to callbacks.
     *
     * @return {Void}
     */
    private trigger(name, arg1=undefined) {
        if (this.callbacks[name]) {
            this.l = this.callbacks[name].length;
            // Callbacks will be stored and executed from a temporary array to not
            // break the execution queue when one of the callbacks unbinds itself.
            this.tmpArray.length = 0;
            for (this.i = 0; this.i < this.l; this.i++) {
                this.tmpArray.push(this.callbacks[name][this.i]);
            }
            // Execute the callbacks
            for (this.i = 0; this.i < this.l; this.i++) {
                this.tmpArray[this.i].call(this, name, arg1);
            }
        }
    }
        /**
     * Destroys instance and everything it created.
     *
     * @return {Void}
     */
    public destroy () {
        // Remove the reference to itself
        SlideBars.removeInstance(this.frame, this.namespace);

        // Unbind all events
        this.$scrollSource
            .add(this.$handle)
            .add(this.$sb)
            .add(this.$pb)
            .add(this.$forwardButton)
            .add(this.$backwardButton)
            .add(this.$prevButton)
            .add(this.$nextButton)
            .add(this.$prevPageButton)
            .add(this.$nextPageButton)
            .off('.' + this.namespace);

        // Unbinding specifically as to not nuke out other instances
        this.$doc.off('keydown', this.keyboardHandler);

        // Remove classes
        this.$prevButton
            .add(this.$nextButton)
            .add(this.$prevPageButton)
            .add(this.$nextPageButton)
            .removeClass(this.o.disabledClass);

        if (this.$items && this.rel.activeItem != null) {
            this.$items.eq(this.rel.activeItem).removeClass(this.o.activeClass);
        }

        // Remove page items
        this.$pb.empty();

        if (!this.parallax) {
            // Unbind events from frame
            this.$frame.off('.' + this.namespace);
            // Restore original styles
            this.frameStyles.restore();
            this.slideeStyles.restore();
            this.sbStyles.restore();
            this.handleStyles.restore();
            // Remove the instance from element data storage
            $.removeData(this.frame, this.namespace);
        }

        // Clean up collections
        this.items.length = this.pages.length = 0;
        this.last = {};

        // Reset initialized status and return the instance
        this.initialized = 0;
        return this;
    }

    /**
     * Initialize.
     *
     * @return {Object}
     */
    init() {
        if (this.initialized) {
            return;
        }
        
        // Disallow multiple instances on the same element
        if (SlideBars.getInstance(this.frame,this.namespace)) throw new Error('There is already a Sly instance on this element');

        // Store the reference to itself
        SlideBars.storeInstance(this.frame,this.namespace,this);

        // Register callbacks map
        this.on(this.callbackMap);

        // Save styles
        let holderProps = ['overflow', 'position'];
        let movableProps = ['position', 'webkitTransform', 'msTransform', 'transform', 'left', 'top', 'width', 'height'];
        this.frameStyles.save.apply(this.frameStyles, holderProps);
        this.sbStyles.save.apply(this.sbStyles, holderProps);
        this.slideeStyles.save.apply(this.slideeStyles, movableProps);
        this.handleStyles.save.apply(this.handleStyles, movableProps);

        // Set required styles
        var $movables = this.$handle;
        if (!this.parallax) {
            $movables = $movables.add(this.$slidee);
            this.$frame.css('overflow', 'hidden');
            if (!this.transform && this.$frame.css('position') === 'static') {
                this.$frame.css('position', 'relative');
            }
        }
        if (this.transform) {
            if (this.gpuAcceleration) {
                $movables.css(this.transform, this.gpuAcceleration);
            }
        } else {
            if (this.$sb.css('position') === 'static') {
                this.$sb.css('position', 'relative');
            }
            $movables.css({ position: 'absolute' });
        }

        this.dragHandler = this.dragHandler.bind(this);    
        this.dragInit = this.dragInit.bind(this);
        this.disableOneEvent = this.disableOneEvent.bind(this);
        
        // Navigation buttons
        if (this.o.forward) {
            this.$forwardButton.on(this.mouseDownEvent, this.buttonsHandler);
        }
        if (this.o.backward) {
            this.$backwardButton.on(this.mouseDownEvent, this.buttonsHandler);
        }
        if (this.o.prev) {
            this.$prevButton.on(this.clickEvent, this.buttonsHandler);
        }
        if (this.o.next) {
            this.$nextButton.on(this.clickEvent, this.buttonsHandler);
        }
        if (this.o.prevPage) {
            this.$prevPageButton.on(this.clickEvent, this.buttonsHandler);
        }
        if (this.o.nextPage) {
            this.$nextPageButton.on(this.clickEvent, this.buttonsHandler);
        }

        // Scrolling navigation
        this.$scrollSource.on(this.wheelEvent, this.scrollHandler);

        // Clicking on scrollbar navigation
        if (this.$sb[0]) {
            this.$sb.on(this.clickEvent, this.scrollbarHandler);
        }

        // Click on items navigation
        if (this.itemNav && this.o.activateOn) {
            this. $frame.on(this.o.activateOn + '.' + this.namespace, '*', this.activateHandler.bind(this));
        }

        // Pages navigation
        if (this.$pb[0] && this.o.activatePageOn) {
            this.$pb.on(this.o.activatePageOn + '.' + this.namespace, '*', this.activatePageHandler.bind(this));
        }

        // Dragging navigation
        this.$dragSource.on(this.dragInitEvents, { source: 'slidee' }, this.dragInit);

        // Scrollbar dragging navigation
        if (this.$handle) {
            this.$handle.on(this.dragInitEvents, { source: 'handle' }, this.dragInit);
        }
        
        // Keyboard navigation
        this.$doc.on('keydown', this.keyboardHandler.bind(this));

        if (!this.parallax) {
            // Pause on hover
            this.$frame.on('mouseenter.' + this.namespace + ' mouseleave.' + this.namespace,this.pauseOnHoverHandler.bind(this));
            // Reset native FRAME element scroll
            this.$frame.on('scroll.' + this.namespace, this.resetScroll);
        }

        // Mark instance as initialized
        this.initialized = 1;

        // Load
        this.load(true);

        // Initiate automatic cycling
        if (this.o.cycleBy && !this.parallax) {
            this.o.startPaused ? this.pause() : this.resume();
        }

        // Return instance
        return this;
    }
    	/**
	 * Return type of the value.
	 *
	 * @param  {Mixed} value
	 *
	 * @return {String}
	 */
    static type(value) 
    {
		if (value == null) {
			return String(value);
		}

		if (typeof value === 'object' || typeof value === 'function') {
			return ( Object.prototype.toString.call(value).match(/\s([a-z]+)/i) || [] )[1].toLowerCase() || 'object';
		}

		return typeof value;
	}

	/**
	 * Event preventDefault & stopPropagation helper.
	 *
	 * @param {Event} event     Event object.
	 * @param {Bool}  noBubbles Cancel event bubbling.
	 *
	 * @return {Void}
	 */
	private stopDefault(event, noBubbles=false) {
		event.preventDefault();
		if (noBubbles) {
			event.stopPropagation();
		}
	}

	/**
	 * Disables an event it was triggered on and unbinds itself.
	 *
	 * @param  {Event} event
	 *
	 * @return {Void}
	 */
	private disableOneEvent(event) {
		/*jshint validthis:true */
		this.stopDefault(event, true);
		$(this).off(event.type, this.disableOneEvent);
	}

	/**
	 * Resets native element scroll values to 0.
	 *
	 * @return {Void}
	 */
	private resetScroll(event) {
		/*jshint validthis:true */
		event.target.scrollLeft = 0;
		event.target.scrollTop = 0;
	}

	/**
	 * Check if variable is a number.
	 *
	 * @param {Mixed} value
	 *
	 * @return {Boolean}
	 */
	private isNumber(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}

	/**
	 * Parse style to pixels.
	 *
	 * @param {Object}   $item    jQuery object with element.
	 * @param {Property} property CSS property to get the pixels from.
	 *
	 * @return {Int}
	 */
	private getPx($item, property) {
		return 0 | this.round(parseFloat(String($item.css(property)).replace(/[^\-0-9.]/g, '')));
	}

	/**
	 * Make sure that number is within the limits.
	 *
	 * @param {Number} number
	 * @param {Number} min
	 * @param {Number} max
	 *
	 * @return {Number}
	 */
	private within(number, min, max) {
		return number < min ? min : number > max ? max : number;
	}

    static getInstance (element, namespace)
    {
		return $.data(element, namespace);
	}

	static storeInstance = function (element, namespace, sly) {
		return $.data(element, namespace, sly);
	}

	static removeInstance (element, namespace) {
		return $.removeData(element, namespace);
	}
}

 
/**
 * Saves element styles for later restoration.
 *
 * Example:
 *   var styles = new StyleRestorer(frame);
 *   styles.save('position');
 *   element.style.position = 'absolute';
 *   styles.restore(); // restores to state before the assignment above
 *
 * @param {Element} element
 */
class StyleRestorer{

    style:any;
    element:any;
    constructor(element:any) {
        this.style = {};
        this.element = element;
    }

    save (...args) {
        if (!this.element || !this.element.nodeType) return;
        for (var i = 0; i < args.length; i++) {
            let cssName = args[i];
            this.style[cssName] = this.element.style[cssName];
        }
        return this;
    }
    
    restore() 
    {
        if (!this.element || !this.element.nodeType) return;
        for (var prop in this.style) {
            if (this.style.hasOwnProperty(prop)) this.element.style[prop] = this.style[prop];
        }
        return this;
    }

}
