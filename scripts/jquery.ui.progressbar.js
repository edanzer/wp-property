!function($, undefined) {
    $.widget("ui.progressbar", {
        options: {
            value: 0,
            max: 100
        },
        min: 0,
        _create: function() {
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                role: "progressbar",
                "aria-valuemin": this.min,
                "aria-valuemax": this.options.max,
                "aria-valuenow": this._value()
            }), this.valueDiv = $("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element), 
            this.oldValue = this._value(), this._refreshValue();
        },
        destroy: function() {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"), 
            this.valueDiv.remove(), $.Widget.prototype.destroy.apply(this, arguments);
        },
        value: function(newValue) {
            return newValue === undefined ? this._value() : (this._setOption("value", newValue), 
            this);
        },
        _setOption: function(key, value) {
            "value" === key && (this.options.value = value, this._refreshValue(), this._value() === this.options.max && this._trigger("complete")), 
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        _value: function() {
            var val = this.options.value;
            return "number" != typeof val && (val = 0), Math.min(this.options.max, Math.max(this.min, val));
        },
        _percentage: function() {
            return 100 * this._value() / this.options.max;
        },
        _refreshValue: function() {
            var value = this.value(), percentage = this._percentage();
            this.oldValue !== value && (this.oldValue = value, this._trigger("change")), this.valueDiv.toggleClass("ui-corner-right", value === this.options.max).width(percentage.toFixed(0) + "%"), 
            this.element.attr("aria-valuenow", value);
        }
    }), $.extend($.ui.progressbar, {
        version: "1.8.10"
    });
}(jQuery);