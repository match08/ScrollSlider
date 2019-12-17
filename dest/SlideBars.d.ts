export default class SlideBars {
    pluginName: string;
    className: string;
    namespace: string;
    transform: any;
    gpuAcceleration: any;
    $doc: any;
    dragInitEvents: string;
    dragMouseEvents: string;
    dragTouchEvents: string;
    wheelEvent: string;
    clickEvent: string;
    mouseDownEvent: string;
    interactiveElements: Array<string>;
    tmpArray: Array<any>;
    time: any;
    abs: (x: number) => number;
    sqrt: (x: number) => number;
    pow: (x: number, y: number) => number;
    round: (x: number) => number;
    max: (...values: number[]) => number;
    min: (...values: number[]) => number;
    initialized: any;
    frame: any;
    slidee: any;
    pos: any;
    rel: any;
    items: any;
    pages: any;
    isPaused: any;
    options: any;
    dragging: any;
    o: any;
    parallax: any;
    $frame: any;
    $slidee: any;
    frameSize: any;
    slideeSize: any;
    $sb: any;
    $handle: any;
    sbSize: any;
    handleSize: any;
    hPos: any;
    $pb: any;
    $pages: any;
    $items: any;
    frameStyles: any;
    slideeStyles: any;
    sbStyles: any;
    handleStyles: any;
    basicNav: any;
    forceCenteredNav: any;
    centeredNav: any;
    itemNav: any;
    $scrollSource: any;
    $dragSource: any;
    $forwardButton: any;
    $backwardButton: any;
    $prevButton: any;
    $nextButton: any;
    $prevPageButton: any;
    $nextPageButton: any;
    callbacks: any;
    last: any;
    animation: any;
    move: any;
    scrolling: any;
    renderID: any;
    historyID: any;
    cycleID: any;
    continuousID: any;
    i: any;
    l: any;
    lastGlobalWheel: any;
    callbackMap: any;
    parentNode: any;
    defaults: any;
    constructor(frame: any, options: any, callbackMap: any);
    create(frame: any): void;
    /**
     * 创建jquery代理
     */
    createJqueryProxy(): void;
    private polyfill;
    private featureDetects;
    /**
     * dom element observer
     * @param element
     * @param ready
     */
    private mutationObserver;
    /**
     * Loading function.
     *
     * Populate arrays, set sizes, bind events, ...
     *
     * @param {Boolean} [isInit] Whether load is called from within self.init().
     * @return {Void}
     */
    load(isInit?: boolean): void;
    reload(): void;
    /**
     * Animate to a position.
     *
     * @param {Int}  newPos    New position.
     * @param {Bool} immediate Reposition immediately without an animation.
     * @param {Bool} dontAlign Do not align items, use the raw position passed in first argument.
     *
     * @return {Void}
     */
    private _slideTo;
    /**
     * Render animation frame.
     *
     * @return {Void}
     */
    render(): void;
    /**
     * Synchronizes scrollbar with the SLIDEE.
     *
     * @return {Void}
     */
    private syncScrollbar;
    /**
     * Synchronizes pagesbar with SLIDEE.
     *
     * @return {Void}
     */
    private syncPagesbar;
    /**
     * Returns the position object.
     *
     * @param {Mixed} item
     *
     * @return {Object}
     */
    private getPos;
    /**
     * Continuous move in a specified direction.
     *
     * @param  {Bool} forward True for forward movement, otherwise it'll go backwards.
     * @param  {Int}  speed   Movement speed in pixels per frame. Overrides options.moveBy value.
     *
     * @return {Void}
     */
    private moveBy;
    /**
     * Continuous movement loop.
     *
     * @return {Void}
     */
    private moveLoop;
    /**
     * Stops continuous movement.
     *
     * @return {Void}
     */
    stop(): void;
    /**
     * Activate previous item.
     *
     * @return {Void}
     */
    prev(): void;
    /**
     * Activate next item.
     *
     * @return {Void}
     */
    next(): void;
    /**
     * Activate previous page.
     *
     * @return {Void}
     */
    prevPage(): void;
    /**
     * Activate next page.
     *
     * @return {Void}
     */
    nextPage(): void;
    /**
     * Slide SLIDEE by amount of pixels.
     *
     * @param {Int}  delta     Pixels/Items. Positive means forward, negative means backward.
     * @param {Bool} immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    slideBy(delta: any, immediate?: boolean): void;
    /**
     * Animate SLIDEE to a specific position.
     *
     * @param {Int}  pos       New position.
     * @param {Bool} immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    slideTo(pos: any, immediate?: boolean): void;
    /**
     * Core method for handling `toLocation` methods.
     *
     * @param  {String} location
     * @param  {Mixed}  item
     * @param  {Bool}   immediate
     *
     * @return {Void}
     */
    private to;
    /**
     * Animate element or the whole SLIDEE to the start of the frame.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
     * @param {Bool}  immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    toStart(item: any, immediate?: boolean): void;
    /**
     * Animate element or the whole SLIDEE to the end of the frame.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
     * @param {Bool}  immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    toEnd(item: any, immediate: any): void;
    /**
     * Animate element or the whole SLIDEE to the center of the frame.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
     * @param {Bool}  immediate Reposition immediately without an animation.
     *
     * @return {Void}
     */
    toCenter(item: any, immediate?: boolean): void;
    /**
     * Get the index of an item in SLIDEE.
     *
     * @param {Mixed} item     Item DOM element.
     *
     * @return {Int}  Item index, or -1 if not found.
     */
    private getIndex;
    /**
     * Get index of an item in SLIDEE based on a variety of input types.
     *
     * @param  {Mixed} item DOM element, positive or negative integer.
     *
     * @return {Int}   Item index, or -1 if not found.
     */
    private getRelativeIndex;
    /**
     * Activates an item.
     *
     * @param  {Mixed} item Item DOM element, or index starting at 0.
     *
     * @return {Mixed} Activated item index or false on fail.
     */
    private _activate;
    /**
     * Activates an item and helps with further navigation when o.smart is enabled.
     *
     * @param {Mixed} item      Item DOM element, or index starting at 0.
     * @param {Bool}  immediate Whether to reposition immediately in smart navigation.
     *
     * @return {Void}
     */
    activate(item: any, immediate?: boolean): void;
    /**
     * Activates a page.
     *
     * @param {Int}  index     Page index, starting from 0.
     * @param {Bool} immediate Whether to reposition immediately without animation.
     *
     * @return {Void}
     */
    activatePage(index: any, immediate?: boolean): void;
    /**
     * Return relative positions of items based on their visibility within FRAME.
     *
     * @param {Int} slideePos Position of SLIDEE.
     *
     * @return {Void}
     */
    private getRelatives;
    /**
     * Update object with relative positions.
     *
     * @param {Int} newPos
     *
     * @return {Void}
     */
    private updateRelatives;
    /**
     * Disable navigation buttons when needed.
     *
     * Adds disabledClass, and when the button is <button> or <input>, activates :disabled state.
     *
     * @return {Void}
     */
    private updateButtonsState;
    /**
     * Resume cycling.
     *
     * @param {Int} priority Resume pause with priority lower or equal than this. Used internally for pauseOnHover.
     *
     * @return {Void}
     */
    resume(priority?: number): void;
    /**
     * Pause cycling.
     *
     * @param {Int} priority Pause priority. 100 is default. Used internally for pauseOnHover.
     *
     * @return {Void}
     */
    pause(priority?: number): void;
    /**
     * Toggle cycling.
     *
     * @return {Void}
     */
    toggle(): void;
    /**
     * Updates a signle or multiple option values.
     *
     * @param {Mixed} name  Name of the option that should be updated, or object that will extend the options.
     * @param {Mixed} value New option value.
     *
     * @return {Void}
     */
    set(name: any, value: any): void;
    /**
     * Add one or multiple items to the SLIDEE end, or a specified position index.
     *
     * @param {Mixed} element Node element, or HTML string.
     * @param {Int}   index   Index of a new item position. By default item is appended at the end.
     *
     * @return {Void}
     */
    add(element: any, index: any): void;
    /**
     * Remove an item from SLIDEE.
     *
     * @param {Mixed} element Item index, or DOM element.
     * @param {Int}   index   Index of a new item position. By default item is appended at the end.
     *
     * @return {Void}
     */
    remove(element: any): void;
    /**
     * Helps re-arranging items.
     *
     * @param  {Mixed} item     Item DOM element, or index starting at 0. Use negative numbers to select items from the end.
     * @param  {Mixed} position Item insertion anchor. Accepts same input types as item argument.
     * @param  {Bool}  after    Insert after instead of before the anchor.
     *
     * @return {Void}
     */
    private moveItem;
    /**
     * Move item after the target anchor.
     *
     * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
     * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
     *
     * @return {Void}
     */
    moveAfter(item: any, position: any): void;
    /**
     * Move item before the target anchor.
     *
     * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
     * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
     *
     * @return {Void}
     */
    moveBefore(item: any, position: any): void;
    /**
     * Registers callbacks.
     *
     * @param  {Mixed} name  Event name, or callbacks map.
     * @param  {Mixed} fn    Callback, or an array of callback functions.
     *
     * @return {Void}
     */
    on(name: any, fn?: any): void;
    /**
     * Registers callbacks to be executed only once.
     *
     * @param  {Mixed} name  Event name, or callbacks map.
     * @param  {Mixed} fn    Callback, or an array of callback functions.
     *
     * @return {Void}
     */
    one(name: any, fn: Function): void;
    /**
     * Remove one or all callbacks.
     *
     * @param  {String} name Event name.
     * @param  {Mixed}  fn   Callback, or an array of callback functions. Omit to remove all callbacks.
     *
     * @return {Void}
     */
    off(name: any, fn: any): void;
    /**
     * Returns callback array index.
     *
     * @param  {String}   name Event name.
     * @param  {Function} fn   Function
     *
     * @return {Int} Callback array index, or -1 if isn't registered.
     */
    private callbackIndex;
    /**
     * Reset next cycle timeout.
     *
     * @return {Void}
     */
    private resetCycle;
    /**
     * Calculate SLIDEE representation of handle position.
     *
     * @param  {Int} handlePos
     *
     * @return {Int}
     */
    private handleToSlidee;
    /**
     * Keeps track of a dragging delta history.
     *
     * @return {Void}
     */
    private draggingHistoryTick;
    /**
     * Initialize continuous movement.
     *
     * @return {Void}
     */
    private continuousInit;
    /**
     * Dragging initiator.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private dragInit;
    /**
     * Handler for dragging scrollbar handle or SLIDEE.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private dragHandler;
    /**
     * Stops dragging and cleans up after it.
     *
     * @return {Void}
     */
    private dragEnd;
    /**
     * Check whether element is interactive.
     *
     * @return {Boolean}
     */
    private isInteractive;
    /**
     * Continuous movement cleanup on mouseup.
     *
     * @return {Void}
     */
    private movementReleaseHandler;
    /**
     * Buttons navigation handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private buttonsHandler;
    /**
     * Mouse wheel delta normalization.
     *
     * @param  {Event} event
     *
     * @return {Int}
     */
    private normalizeWheelDelta;
    /**
     * Mouse scrolling handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private scrollHandler;
    /**
     * Scrollbar click handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private scrollbarHandler;
    /**
     * Keyboard input handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private keyboardHandler;
    /**
     * Click on item activation handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private activateHandler;
    /**
     * Click on page button handler.
     *
     * @param {Event} event
     *
     * @return {Void}
     */
    private activatePageHandler;
    /**
     * Pause on hover handler.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private pauseOnHoverHandler;
    /**
     * Trigger callbacks for event.
     *
     * @param  {String} name Event name.
     * @param  {Mixed}  argX Arguments passed to callbacks.
     *
     * @return {Void}
     */
    private trigger;
    /**
 * Destroys instance and everything it created.
 *
 * @return {Void}
 */
    private destroy;
    /**
     * Initialize.
     *
     * @return {Object}
     */
    init(): this;
    /**
 * Return type of the value.
 *
 * @param  {Mixed} value
 *
 * @return {String}
 */
    static type(value: any): any;
    /**
     * Event preventDefault & stopPropagation helper.
     *
     * @param {Event} event     Event object.
     * @param {Bool}  noBubbles Cancel event bubbling.
     *
     * @return {Void}
     */
    private stopDefault;
    /**
     * Disables an event it was triggered on and unbinds itself.
     *
     * @param  {Event} event
     *
     * @return {Void}
     */
    private disableOneEvent;
    /**
     * Resets native element scroll values to 0.
     *
     * @return {Void}
     */
    private resetScroll;
    /**
     * Check if variable is a number.
     *
     * @param {Mixed} value
     *
     * @return {Boolean}
     */
    private isNumber;
    /**
     * Parse style to pixels.
     *
     * @param {Object}   $item    jQuery object with element.
     * @param {Property} property CSS property to get the pixels from.
     *
     * @return {Int}
     */
    private getPx;
    /**
     * Make sure that number is within the limits.
     *
     * @param {Number} number
     * @param {Number} min
     * @param {Number} max
     *
     * @return {Number}
     */
    private within;
    static getInstance(element: any, namespace: any): any;
    static storeInstance: (element: any, namespace: any, sly: any) => any;
    static removeInstance(element: any, namespace: any): any;
}
