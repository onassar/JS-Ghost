
/**
 * Ghost
 * 
 * @notes  Class uses the approach of wrapping the input in a wrapper, along
 *         with the label to allow for variability in the user experience.
 *         Otherwise, if the label were set absolutely, and DOM elements above
 *         it appeared, changed heighted, or animated, the label would remain in
 *         the absolute position it was directed to upon instantiation.
 * @public
 * @var    Class
 */
var Ghost = new Class({

    /**
     * Implements
     * 
     * Interfaces to implement (aka extend)
     * 
     * @public
     * @var    Class
     */
    Implements: Options,

    /**
     * _input
     * 
     * @protected
     * @var    HTMLElement
     */
    _input: {},

    /**
     * _label
     * 
     * @protected
     * @var    HTMLElement
     */
    _label: {},

    /**
     * options
     * 
     * @public
     * @var    Object
     */
    options: {
        focused: 'focused',
        idle: 'idle',
        inactive: 'inactive',
        primary: 'ghost'
    },

    /**
     * initialize
     * 
     * @public
     * @param  Element input
     * @param  Object options
     * @return void
     */
    initialize: function(input, options) {
        this._input = input;
        this.setOptions(options);
        this._setup();
        this._addEvents();
    },

    /**
     * _addEvent
     * 
     * @protected
     * @return    void
     */
    _addEvents: function() {

        // scope
        var self = this;

        // label event
        this._label.addEvent(
            'click',
            function(event) {

                /**
                 * Have the label act as a proxy for the input since it's
                 * positioned above it
                 */
                self._input.focus();
            }
        );

        // input events
        this._input.addEvents({
            'focus': function(event) {

                /**
                 * Upon focusing on the input, mark that the label is now also
                 * being focused upon by adding the appropriate class
                 */
                self._label.addClass(self.options.focused);
            },
            'blur': function(event) {

                /**
                 * Remove the focused class from the label (since input is being
                 * blurred right now, and thus the label is also no longer the
                 * focus)
                 */
                self._label.removeClass(self.options.focused);

                // if the input is still (or newly) empty
                if (this.get('value').length === 0) {

                    /**
                     * Mark that the label ought to be shown by removing the
                     * inactive class (which ought only be applied when the
                     * label shoudn't be visible; eg. when there's content)
                     */
                    self._label.removeClass(self.options.inactive);
                }
            },
            'keydown': function(event) {

                // invalid keys
                var invalid = [
                    9,  // tab
                    13, // enter
                    16, // shift
                    17, // control
                    18, // option/alt
                    91, // command
                    192 // tilde
                ];

                // if one of the keys above wasn't that which was clicked
                if (!invalid.contains(event.code)) {

                    /**
                     * Add the inactive class to the label, since the input now
                     * contains at least one character (indicative since this is
                     * being run in the keydown event, within the condition
                     * which checks against invalid characters being fired)
                     */
                    self._label.addClass(self.options.inactive);
                }
            }
        });
    },

    /**
     * _setup
     * 
     * @protected
     * @return    void
     */
    _setup: function() {

        // create label; store input value in DOM property
        this._label = (new Element('label'));
        this._label.set('text', this._input.get('title'));

        /**
         * Create wrapper (for reasoning behind this approach, see class notes
         * above)
         */
        var wrapper = (new Element('div', {'class': 'GhostElementWrapper'}));
        wrapper.wraps(this._input);
        wrapper.adopt(this._label);

        // add the primary and idle class (upon instantiation)
        this._label.addClass(this.options.primary);
        this._label.addClass(this.options.idle);

        // if the input has a value
        if (this._input.get('value') !== '') {

            // make the label active
            this._label.addClass(this.options.inactive);
        }

        // grab all styles that would affect the labels visuals and position
        var styles = this._input.getStyles(
            'font-family', 'font-size',
            'padding', 'margin',
            'height', 'line-height', 'width',
            'border-top-width', 'border-right-width',
            'border-bottom-width', 'border-left-width'
        );

        // set the label's visual and position styles
        this._label.setStyles({
            'font-family': styles['font-family'],
            'font-size': styles['font-size'],

            'padding': styles['padding'],
            'margin': styles['margin'],

            'height': styles['height'],
            'line-height': styles['line-height'],
            'width': styles['width'],

            'border-top': styles['border-top-width'] + ' solid transparent',
            'border-right': styles['border-right-width'] + ' solid transparent',
            'border-bottom': styles['border-bottom-width'] + ' solid transparent',
            'border-left': styles['border-left-width'] + ' solid transparent'
        });
    }
});
