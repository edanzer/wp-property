!function($) {
    $.extend($.fn, {
        validate: function(options) {
            if (!this.length) return options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing"), 
            void 0;
            var validator = $.data(this[0], "validator");
            return validator ? validator : (validator = new $.validator(options, this[0]), $.data(this[0], "validator", validator), 
            validator.settings.onsubmit && (this.find("input, button").filter(".cancel").click(function() {
                validator.cancelSubmit = !0;
            }), this.submit(function(event) {
                function handle() {
                    return validator.settings.submitHandler ? (validator.settings.submitHandler.call(validator, validator.currentForm), 
                    !1) : !0;
                }
                return validator.settings.debug && event.preventDefault(), validator.cancelSubmit ? (validator.cancelSubmit = !1, 
                handle()) : validator.form() ? validator.pendingRequest ? (validator.formSubmitted = !0, 
                !1) : handle() : (validator.focusInvalid(), !1);
            })), validator);
        },
        valid: function() {
            if ($(this[0]).is("form")) return this.validate().form();
            var valid = !1, validator = $(this[0].form).validate();
            return this.each(function() {
                valid |= validator.element(this);
            }), valid;
        },
        removeAttrs: function(attributes) {
            var result = {}, $element = this;
            return $.each(attributes.split(/\s/), function(index, value) {
                result[value] = $element.attr(value), $element.removeAttr(value);
            }), result;
        },
        rules: function(command, argument) {
            var element = this[0];
            if (command) {
                var settings = $.data(element.form, "validator").settings, staticRules = settings.rules, existingRules = $.validator.staticRules(element);
                switch (command) {
                  case "add":
                    $.extend(existingRules, $.validator.normalizeRule(argument)), staticRules[element.name] = existingRules, 
                    argument.messages && (settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages));
                    break;

                  case "remove":
                    if (!argument) return delete staticRules[element.name], existingRules;
                    var filtered = {};
                    return $.each(argument.split(/\s/), function(index, method) {
                        filtered[method] = existingRules[method], delete existingRules[method];
                    }), filtered;
                }
            }
            var data = $.validator.normalizeRules($.extend({}, $.validator.metadataRules(element), $.validator.classRules(element), $.validator.attributeRules(element), $.validator.staticRules(element)), element);
            if (data.required) {
                var param = data.required;
                delete data.required, data = $.extend({
                    required: param
                }, data);
            }
            return data;
        }
    }), $.extend($.expr[":"], {
        blank: function(a) {
            return !$.trim(a.value);
        },
        filled: function(a) {
            return !!$.trim(a.value);
        },
        unchecked: function(a) {
            return !a.checked;
        }
    }), $.format = function(source, params) {
        return 1 == arguments.length ? function() {
            var args = $.makeArray(arguments);
            return args.unshift(source), $.format.apply(this, args);
        } : (arguments.length > 2 && params.constructor != Array && (params = $.makeArray(arguments).slice(1)), 
        params.constructor != Array && (params = [ params ]), $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        }), source);
    }, $.validator = function(options, form) {
        this.settings = $.extend({}, $.validator.defaults, options), this.currentForm = form, 
        this.init();
    }, $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            errorElement: "label",
            focusInvalid: !0,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: !0,
            ignore: [],
            ignoreTitle: !1,
            onfocusin: function(element) {
                this.lastActive = element, this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass), 
                this.errorsFor(element).hide());
            },
            onfocusout: function(element) {
                this.checkable(element) || !(element.name in this.submitted) && this.optional(element) || this.element(element);
            },
            onkeyup: function(element) {
                (element.name in this.submitted || element == this.lastElement) && this.element(element);
            },
            onclick: function(element) {
                element.name in this.submitted && this.element(element);
            },
            highlight: function(element, errorClass) {
                $(element).addClass(errorClass);
            },
            unhighlight: function(element, errorClass) {
                $(element).removeClass(errorClass);
            }
        },
        setDefaults: function(settings) {
            $.extend($.validator.defaults, settings);
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            dateDE: "Bitte geben Sie ein gГјltiges Datum ein.",
            number: "Please enter a valid number.",
            numberDE: "Bitte geben Sie eine Nummer ein.",
            digits: "Please enter only digits",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            accept: "Please enter a value with a valid extension.",
            maxlength: $.format("Please enter no more than {0} characters."),
            minlength: $.format("Please enter at least {0} characters."),
            rangelength: $.format("Please enter a value between {0} and {1} characters long."),
            range: $.format("Please enter a value between {0} and {1}."),
            max: $.format("Please enter a value less than or equal to {0}."),
            min: $.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function delegate(event) {
                    var validator = $.data(this[0].form, "validator");
                    validator.settings["on" + event.type] && validator.settings["on" + event.type].call(validator, this[0]);
                }
                this.labelContainer = $(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm), 
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer), 
                this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, 
                this.invalid = {}, this.reset();
                var groups = this.groups = {};
                $.each(this.settings.groups, function(key, value) {
                    $.each(value.split(/\s/), function(index, name) {
                        groups[name] = key;
                    });
                });
                var rules = this.settings.rules;
                $.each(rules, function(key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                }), $(this.currentForm).delegate("focusin focusout keyup", ":text, :password, :file, select, textarea", delegate).delegate("click", ":radio, :checkbox", delegate), 
                this.settings.invalidHandler && $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
            },
            form: function() {
                return this.checkForm(), $.extend(this.submitted, this.errorMap), this.invalid = $.extend({}, this.errorMap), 
                this.valid() || $(this.currentForm).triggerHandler("invalid-form", [ this ]), this.showErrors(), 
                this.valid();
            },
            checkForm: function() {
                this.prepareForm();
                for (var i = 0, elements = this.currentElements = this.elements(); elements[i]; i++) this.check(elements[i]);
                return this.valid();
            },
            element: function(element) {
                element = this.clean(element), this.lastElement = element, this.prepareElement(element), 
                this.currentElements = $(element);
                var result = this.check(element);
                return result ? delete this.invalid[element.name] : this.invalid[element.name] = !0, 
                this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), 
                result;
            },
            showErrors: function(errors) {
                if (errors) {
                    $.extend(this.errorMap, errors), this.errorList = [];
                    for (var name in errors) this.errorList.push({
                        message: errors[name],
                        element: this.findByName(name)[0]
                    });
                    this.successList = $.grep(this.successList, function(element) {
                        return !(element.name in errors);
                    });
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors();
            },
            resetForm: function() {
                $.fn.resetForm && $(this.currentForm).resetForm(), this.submitted = {}, this.prepareForm(), 
                this.hideErrors(), this.elements().removeClass(this.settings.errorClass);
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },
            objectLength: function(obj) {
                var count = 0;
                for (var i in obj) count++;
                return count;
            },
            hideErrors: function() {
                this.addWrapper(this.toHide).hide();
            },
            valid: function() {
                return 0 == this.size();
            },
            size: function() {
                return this.errorList.length;
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) try {
                    $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus();
                } catch (e) {}
            },
            findLastActive: function() {
                var lastActive = this.lastActive;
                return lastActive && 1 == $.grep(this.errorList, function(n) {
                    return n.element.name == lastActive.name;
                }).length && lastActive;
            },
            elements: function() {
                var validator = this, rulesCache = {};
                return $([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function() {
                    return !this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this), 
                    this.name in rulesCache || !validator.objectLength($(this).rules()) ? !1 : (rulesCache[this.name] = !0, 
                    !0);
                });
            },
            clean: function(selector) {
                return $(selector)[0];
            },
            errors: function() {
                return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
            },
            reset: function() {
                this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = $([]), 
                this.toHide = $([]), this.formSubmitted = !1, this.currentElements = $([]);
            },
            prepareForm: function() {
                this.reset(), this.toHide = this.errors().add(this.containers);
            },
            prepareElement: function(element) {
                this.reset(), this.toHide = this.errorsFor(element);
            },
            check: function(element) {
                element = this.clean(element), this.checkable(element) && (element = this.findByName(element.name)[0]);
                var rules = $(element).rules(), dependencyMismatch = !1;
                for (method in rules) {
                    var rule = {
                        method: method,
                        parameters: rules[method]
                    };
                    try {
                        var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);
                        if ("dependency-mismatch" == result) {
                            dependencyMismatch = !0;
                            continue;
                        }
                        if (dependencyMismatch = !1, "pending" == result) return this.toHide = this.toHide.not(this.errorsFor(element)), 
                        void 0;
                        if (!result) return this.formatAndAdd(element, rule), !1;
                    } catch (e) {
                        throw this.settings.debug && window.console && console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method"), 
                        e;
                    }
                }
                return dependencyMismatch ? void 0 : (this.objectLength(rules) && this.successList.push(element), 
                !0);
            },
            customMetaMessage: function(element, method) {
                if ($.metadata) {
                    var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
                    return meta && meta.messages && meta.messages[method];
                }
            },
            customMessage: function(name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor == String ? m : m[method]);
            },
            findDefined: function() {
                for (var i = 0; i < arguments.length; i++) if (void 0 !== arguments[i]) return arguments[i];
                return void 0;
            },
            defaultMessage: function(element, method) {
                return this.findDefined(this.customMessage(element.name, method), this.customMetaMessage(element, method), !this.settings.ignoreTitle && element.title || void 0, $.validator.messages[method], "<strong>Warning: No message defined for " + element.name + "</strong>");
            },
            formatAndAdd: function(element, rule) {
                var message = this.defaultMessage(element, rule.method);
                "function" == typeof message && (message = message.call(this, rule.parameters, element)), 
                this.errorList.push({
                    message: message,
                    element: element
                }), this.errorMap[element.name] = message, this.submitted[element.name] = message;
            },
            addWrapper: function(toToggle) {
                return this.settings.wrapper && (toToggle = toToggle.add(toToggle.parents(this.settings.wrapper))), 
                toToggle;
            },
            defaultShowErrors: function() {
                for (var i = 0; this.errorList[i]; i++) {
                    var error = this.errorList[i];
                    this.settings.highlight && this.settings.highlight.call(this, error.element, this.settings.errorClass), 
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) for (var i = 0; this.successList[i]; i++) this.showLabel(this.successList[i]);
                if (this.settings.unhighlight) for (var i = 0, elements = this.validElements(); elements[i]; i++) this.settings.unhighlight.call(this, elements[i], this.settings.errorClass);
                this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show();
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements());
            },
            invalidElements: function() {
                return $(this.errorList).map(function() {
                    return this.element;
                });
            },
            showLabel: function(element, message) {
                var label = this.errorsFor(element);
                label.length ? (label.removeClass().addClass(this.settings.errorClass), label.attr("generated") && label.html(message)) : (label = $("<" + this.settings.errorElement + "/>").attr({
                    "for": this.idOrName(element),
                    generated: !0
                }).addClass(this.settings.errorClass).html(message || ""), this.settings.wrapper && (label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), 
                this.labelContainer.append(label).length || (this.settings.errorPlacement ? this.settings.errorPlacement(label, $(element)) : label.insertAfter(element))), 
                !message && this.settings.success && (label.text(""), "string" == typeof this.settings.success ? label.addClass(this.settings.success) : this.settings.success(label)), 
                this.toShow = this.toShow.add(label);
            },
            errorsFor: function(element) {
                return this.errors().filter("[for='" + this.idOrName(element) + "']");
            },
            idOrName: function(element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },
            checkable: function(element) {
                return /radio|checkbox/i.test(element.type);
            },
            findByName: function(name) {
                var form = this.currentForm;
                return $(document.getElementsByName(name)).map(function(index, element) {
                    return element.form == form && element.name == name && element || null;
                });
            },
            getLength: function(value, element) {
                switch (element.nodeName.toLowerCase()) {
                  case "select":
                    return $("option:selected", element).length;

                  case "input":
                    if (this.checkable(element)) return this.findByName(element.name).filter(":checked").length;
                }
                return value.length;
            },
            depend: function(param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : !0;
            },
            dependTypes: {
                "boolean": function(param) {
                    return param;
                },
                string: function(param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function(param, element) {
                    return param(element);
                }
            },
            optional: function(element) {
                return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
            },
            startRequest: function(element) {
                this.pending[element.name] || (this.pendingRequest++, this.pending[element.name] = !0);
            },
            stopRequest: function(element, valid) {
                this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[element.name], 
                valid && 0 == this.pendingRequest && this.formSubmitted && this.form() ? $(this.currentForm).submit() : !valid && 0 == this.pendingRequest && this.formSubmitted && $(this.currentForm).triggerHandler("invalid-form", [ this ]);
            },
            previousValue: function(element) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", previous = {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(element, "remote")
                });
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            dateDE: {
                dateDE: !0
            },
            number: {
                number: !0
            },
            numberDE: {
                numberDE: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(className, rules) {
            className.constructor == String ? this.classRuleSettings[className] = rules : $.extend(this.classRuleSettings, className);
        },
        classRules: function(element) {
            var rules = {}, classes = $(element).attr("class");
            return classes && $.each(classes.split(" "), function() {
                this in $.validator.classRuleSettings && $.extend(rules, $.validator.classRuleSettings[this]);
            }), rules;
        },
        attributeRules: function(element) {
            var rules = {}, $element = $(element);
            for (method in $.validator.methods) {
                var value = $element.attr(method);
                value && (rules[method] = value);
            }
            return rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) && delete rules.maxlength, 
            rules;
        },
        metadataRules: function(element) {
            if (!$.metadata) return {};
            var meta = $.data(element.form, "validator").settings.meta;
            return meta ? $(element).metadata()[meta] : $(element).metadata();
        },
        staticRules: function(element) {
            var rules = {}, validator = $.data(element.form, "validator");
            return validator.settings.rules && (rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {}), 
            rules;
        },
        normalizeRules: function(rules, element) {
            return $.each(rules, function(prop, val) {
                if (val === !1) return delete rules[prop], void 0;
                if (val.param || val.depends) {
                    var keepRule = !0;
                    switch (typeof val.depends) {
                      case "string":
                        keepRule = !!$(val.depends, element.form).length;
                        break;

                      case "function":
                        keepRule = val.depends.call(element, element);
                    }
                    keepRule ? rules[prop] = void 0 !== val.param ? val.param : !0 : delete rules[prop];
                }
            }), $.each(rules, function(rule, parameter) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            }), $.each([ "minlength", "maxlength", "min", "max" ], function() {
                rules[this] && (rules[this] = Number(rules[this]));
            }), $.each([ "rangelength", "range" ], function() {
                rules[this] && (rules[this] = [ Number(rules[this][0]), Number(rules[this][1]) ]);
            }), $.validator.autoCreateRanges && (rules.min && rules.max && (rules.range = [ rules.min, rules.max ], 
            delete rules.min, delete rules.max), rules.minlength && rules.maxlength && (rules.rangelength = [ rules.minlength, rules.maxlength ], 
            delete rules.minlength, delete rules.maxlength)), rules.messages && delete rules.messages, 
            rules;
        },
        normalizeRule: function(data) {
            if ("string" == typeof data) {
                var transformed = {};
                $.each(data.split(/\s/), function() {
                    transformed[this] = !0;
                }), data = transformed;
            }
            return data;
        },
        addMethod: function(name, method, message) {
            $.validator.methods[name] = method, $.validator.messages[name] = message, method.length < 3 && $.validator.addClassRules(name, $.validator.normalizeRule(name));
        },
        methods: {
            required: function(value, element, param) {
                if (!this.depend(param, element)) return "dependency-mismatch";
                switch (element.nodeName.toLowerCase()) {
                  case "select":
                    var options = $("option:selected", element);
                    return options.length > 0 && ("select-multiple" == element.type || ($.browser.msie && !options[0].attributes.value.specified ? options[0].text : options[0].value).length > 0);

                  case "input":
                    if (this.checkable(element)) return this.getLength(value, element) > 0;

                  default:
                    return $.trim(value).length > 0;
                }
            },
            remote: function(value, element, param) {
                if (this.optional(element)) return "dependency-mismatch";
                var previous = this.previousValue(element);
                if (this.settings.messages[element.name] || (this.settings.messages[element.name] = {}), 
                this.settings.messages[element.name].remote = "function" == typeof previous.message ? previous.message(value) : previous.message, 
                param = "string" == typeof param && {
                    url: param
                } || param, previous.old !== value) {
                    previous.old = value;
                    var validator = this;
                    this.startRequest(element);
                    var data = {};
                    return data[element.name] = value, $.ajax($.extend(!0, {
                        url: param,
                        mode: "abort",
                        port: "validate" + element.name,
                        dataType: "json",
                        data: data,
                        success: function(response) {
                            if (response) {
                                var submitted = validator.formSubmitted;
                                validator.prepareElement(element), validator.formSubmitted = submitted, validator.successList.push(element), 
                                validator.showErrors();
                            } else {
                                var errors = {};
                                errors[element.name] = response || validator.defaultMessage(element, "remote"), 
                                validator.showErrors(errors);
                            }
                            previous.valid = response, validator.stopRequest(element, response);
                        }
                    }, param)), "pending";
                }
                return this.pending[element.name] ? "pending" : previous.valid;
            },
            minlength: function(value, element, param) {
                return this.optional(element) || this.getLength($.trim(value), element) >= param;
            },
            maxlength: function(value, element, param) {
                return this.optional(element) || this.getLength($.trim(value), element) <= param;
            },
            rangelength: function(value, element, param) {
                var length = this.getLength($.trim(value), element);
                return this.optional(element) || length >= param[0] && length <= param[1];
            },
            min: function(value, element, param) {
                return this.optional(element) || value >= param;
            },
            max: function(value, element, param) {
                return this.optional(element) || param >= value;
            },
            range: function(value, element, param) {
                return this.optional(element) || value >= param[0] && value <= param[1];
            },
            email: function(value, element) {
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            },
            url: function(value, element) {
                return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },
            date: function(value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
            },
            dateISO: function(value, element) {
                return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
            },
            dateDE: function(value, element) {
                return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
            },
            number: function(value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
            },
            numberDE: function(value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
            },
            digits: function(value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            creditcard: function(value, element) {
                if (this.optional(element)) return "dependency-mismatch";
                if (/[^0-9-]+/.test(value)) return !1;
                var nCheck = 0, nDigit = 0, bEven = !1;
                for (value = value.replace(/\D/g, ""), n = value.length - 1; n >= 0; n--) {
                    var cDigit = value.charAt(n), nDigit = parseInt(cDigit, 10);
                    bEven && (nDigit *= 2) > 9 && (nDigit -= 9), nCheck += nDigit, bEven = !bEven;
                }
                return nCheck % 10 == 0;
            },
            accept: function(value, element, param) {
                return param = "string" == typeof param ? param : "png|jpe?g|gif", this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
            },
            equalTo: function(value, element, param) {
                return value == $(param).val();
            }
        }
    });
}(jQuery), function($) {
    var ajax = $.ajax, pendingRequests = {};
    $.ajax = function(settings) {
        settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings));
        var port = settings.port;
        return "abort" == settings.mode ? (pendingRequests[port] && pendingRequests[port].abort(), 
        pendingRequests[port] = ajax.apply(this, arguments)) : ajax.apply(this, arguments);
    };
}(jQuery), function($) {
    $.each({
        focus: "focusin",
        blur: "focusout"
    }, function(original, fix) {
        $.event.special[fix] = {
            setup: function() {
                return $.browser.msie ? !1 : (this.addEventListener(original, $.event.special[fix].handler, !0), 
                void 0);
            },
            teardown: function() {
                return $.browser.msie ? !1 : (this.removeEventListener(original, $.event.special[fix].handler, !0), 
                void 0);
            },
            handler: function(e) {
                return arguments[0] = $.event.fix(e), arguments[0].type = fix, $.event.handle.apply(this, arguments);
            }
        };
    }), $.extend($.fn, {
        delegate: function(type, delegate, handler) {
            return this.bind(type, function(event) {
                var target = $(event.target);
                return target.is(delegate) ? handler.apply(target, arguments) : void 0;
            });
        },
        triggerEvent: function(type, target) {
            return this.triggerHandler(type, [ $.event.fix({
                type: type,
                target: target
            }) ]);
        }
    });
}(jQuery);