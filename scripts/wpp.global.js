function wpp_format_currency(selector) {
    return wpp.format.currency(selector);
}

function wpp_format_number(selector) {
    return wpp.format.number(selector);
}

function wpp_add_commas(data) {
    return wpp.format.commas(data);
}

top === self || "object" == typeof window.wpp && "object" == typeof window.wpp.instance && "undefined" != typeof window.wpp.instance.iframe_enabled && window.wpp.instance.iframe_enabled === !0 || (top.location.href = document.location.href), 
jQuery.extend(wpp = wpp || {}, {
    settings: {
        debug: !1
    },
    debug: function(data) {
        return wpp.settings.debug ? ("function" == typeof console.log && console.log.apply(console, arguments), 
        data) : data;
    },
    format: {
        currency: function(selector) {
            jQuery(selector).change(function() {
                this_value = jQuery(this).val();
                var val = jQuery().number_format(this_value.replace(/[^\d|\.]/g, ""));
                jQuery(this).val(val);
            });
        },
        number: function(selector) {
            jQuery(selector).change(function() {
                this_value = jQuery(this).val();
                var val = jQuery().number_format(this_value.replace(/[^\d|\.]/g, ""), {
                    numberOfDecimals: 0,
                    decimalSeparator: ".",
                    thousandSeparator: ","
                });
                "NaN" == val && (val = ""), jQuery(this).val(val);
            });
        },
        commas: function(nStr) {
            nStr += "", x = nStr.split("."), x1 = x[0], x2 = x.length > 1 ? "." + x[1] : "";
            for (var rgx = /(\d+)(\d{3})/; rgx.test(x1); ) x1 = x1.replace(rgx, "$1,$2");
            return x1 + x2;
        }
    },
    version_compare: function(v1, v2, operator) {
        this.php_js = this.php_js || {}, this.php_js.ENV = this.php_js.ENV || {};
        var i = 0, x = 0, compare = 0, vm = {
            dev: -6,
            alpha: -5,
            a: -5,
            beta: -4,
            b: -4,
            RC: -3,
            rc: -3,
            "#": -2,
            p: 1,
            pl: 1
        }, prepVersion = function(v) {
            return v = ("" + v).replace(/[_\-+]/g, "."), v = v.replace(/([^.\d]+)/g, ".$1.").replace(/\.{2,}/g, "."), 
            v.length ? v.split(".") : [ -8 ];
        }, numVersion = function(v) {
            return v ? isNaN(v) ? vm[v] || -7 : parseInt(v, 10) : 0;
        };
        for (v1 = prepVersion(v1), v2 = prepVersion(v2), x = Math.max(v1.length, v2.length), 
        i = 0; x > i; i++) if (v1[i] != v2[i]) {
            if (v1[i] = numVersion(v1[i]), v2[i] = numVersion(v2[i]), v1[i] < v2[i]) {
                compare = -1;
                break;
            }
            if (v1[i] > v2[i]) {
                compare = 1;
                break;
            }
        }
        if (!operator) return compare;
        switch (operator) {
          case ">":
          case "gt":
            return compare > 0;

          case ">=":
          case "ge":
            return compare >= 0;

          case "<=":
          case "le":
            return 0 >= compare;

          case "==":
          case "=":
          case "eq":
            return 0 === compare;

          case "<>":
          case "!=":
          case "ne":
            return 0 !== compare;

          case "":
          case "<":
          case "lt":
            return 0 > compare;

          default:
            return null;
        }
    }
});