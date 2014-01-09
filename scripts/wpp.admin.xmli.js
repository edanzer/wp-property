wpp.strings = wpp.strings || {}, wpp.xmli = jQuery.extend({
    settings: {
        debug: !0
    },
    ready: function() {
        wpp.xmli.debug("wpp.xmli.ready()");
        var schedule_id;
        wpp.xmli.refresh_dom(), jQuery(".wppi_delete_all_orphan_attachments").click(function() {
            var notice_container = jQuery(".wppi_delete_all_orphan_attachments_result").show();
            jQuery(notice_container).html("Deleting all unattached images. You can close your browser, the operation will continue until completion."), 
            jQuery.post(wpp.instance.ajax_url, {
                action: "wpp_property_import_handler",
                wpp_action: "delete_all_orphan_attachments"
            }, function(result) {
                result && result.success ? jQuery(notice_container).html(result.ui) : jQuery(notice_container).html("An error occured.");
            }, "json");
        }), jQuery("#wpp_ajax_show_xml_imort_history").click(function() {
            jQuery(".wpp_ajax_show_xml_imort_history_result").html(""), jQuery.post(wpp.instance.ajax_url, {
                action: "wpp_ajax_show_xml_imort_history"
            }, function(data) {
                jQuery(".wpp_ajax_show_xml_imort_history_result").show(), jQuery(".wpp_ajax_show_xml_imort_history_result").html(data);
            });
        }), jQuery(".wpp_xi_sort_rules").live("click", function() {
            var list_wrapper = jQuery("#wpp_property_import_attribute_mapper"), listitems = jQuery(".wpp_dynamic_table_row", list_wrapper).get();
            listitems.sort(function(a, b) {
                var compA = jQuery("select.wpp_import_attribute_dropdown option:selected", a).text(), compB = jQuery("select.wpp_import_attribute_dropdown option:selected", b).text();
                compA = void 0 === compA ? 0 : compA, compB = void 0 === compB ? 0 : compB;
                var index = compB > compA ? -1 : compA > compB ? 1 : 0;
                return console.log(compA + " - " + compB + ": " + index), index;
            }), jQuery.each(listitems, function(idx, itm) {
                list_wrapper.append(itm);
            });
        }), jQuery("#wpp_property_import_choose_root_element").live("change", function() {
            var value = jQuery(this).val(), fixed_value = value.replace(/'/g, '"');
            jQuery(this).val(fixed_value);
        }), jQuery(".wpp_xi_advanced_setting input[type=checkbox]").live("change", function() {
            var wrapper = jQuery(this).closest(".wpp_xi_advanced_setting");
            jQuery(this).is(":checked") ? jQuery(wrapper).addClass("wpp_xi_enabld_row") : jQuery(wrapper).removeClass("wpp_xi_enabld_row"), 
            wpp.xmli.advanced_option_counter();
        }), jQuery(".wpp_xi_advanced_setting input[type=text]").live("change", function() {
            var wrapper = jQuery(this).closest(".wpp_xi_advanced_setting"), value = jQuery(this).val();
            "" === value || "0" === value ? (jQuery(this).val(""), 0 == jQuery("input:text[value != '' ]", wrapper).length && jQuery(wrapper).removeClass("wpp_xi_enabld_row")) : jQuery(wrapper).addClass("wpp_xi_enabld_row"), 
            wpp.xmli.advanced_option_counter();
        }), jQuery(".wpp_property_toggle_import_settings").live("click", function() {
            jQuery(".wpp_property_import_settings").toggle(), wpp.xmli.advanced_option_counter();
        }), jQuery(".wpp_import_delete_row").live("click", function() {
            return jQuery('input[name^="wpp_property_import[map]"]:checkbox:checked').length ? confirm("Are you sure you want remove these items?") ? (jQuery('input[name^="wpp_property_import[map]"]:checkbox').each(function() {
                this.checked && (1 == jQuery("#wpp_property_import_attribute_mapper .wpp_dynamic_table_row").length && jQuery(".wpp_add_row").click(), 
                jQuery(this).parents(".wpp_dynamic_table_row").remove());
            }), jQuery(jQuery('[name^="wpp_property_import[map]"]:checkbox').parents(".wpp_dynamic_table_row").get().reverse()).each(function(index) {
                jQuery(this).find("input,select").each(function() {
                    var old_name = jQuery(this).attr("name"), matches = old_name.match(/\[( \d{1,2} )\]/);
                    matches && (old_count = parseInt(matches[1]), new_count = index + 1);
                    var new_name = old_name.replace("[" + old_count + "]", "[" + new_count + "]");
                    jQuery(this).attr("name", new_name);
                });
            }), wpp.xmli.import_build_unique_id_selector(), void 0) : !1 : !1;
        }), jQuery("#check_all").live("click", function() {
            this.checked ? jQuery('[name^="wpp_property_import[map]"]:checkbox').attr("checked", "checked") : jQuery('[name^="wpp_property_import[map]"]:checkbox').attr("checked", "");
        }), jQuery("#wpp_i_do_full_import").live("click", function() {
            jQuery("wpp_i_preview_raw_data_result").html("");
            var import_hash = jQuery("#import_hash").val();
            "" != import_hash ? window.open(wpp.instance.home_url + "/?wpp_schedule_import=" + import_hash + "&echo_log=true", "wpp_i_do_full_import") : wpp.xmli.actions_bar_message(wpp.strings.xmli.please_save, "bad", 7e3);
        }), jQuery("#wpp_i_preview_action").live("click", function() {
            var source_type = jQuery("#wpp_property_import_source_type option:selected").val();
            jQuery("#wpp_i_preview_action").val("Loading..."), jQuery("#wpp_import_object_preview").html('<pre class="wpp_class_pre"></pre>');
            var params = {
                action: "wpp_property_import_handler",
                wpp_action: "execute_schedule_import",
                preview: "true",
                data: jQuery("#wpp_property_import_setup").serialize()
            };
            void 0 !== schedule_id && (params.schedule_id = schedule_id), void 0 !== source_type && (params.source_type = source_type), 
            jQuery.post(wpp.instance.ajax_url, params, function(result) {
                jQuery("#wpp_i_preview_action").attr("disabled", !1), jQuery("#wpp_i_preview_action").val("Preview Again"), 
                "true" == result.success ? (wpp.xmli.actions_bar_message(), jQuery("#wpp_import_object_preview").show(), 
                jQuery("#wpp_import_object_preview").html('<pre class="wpp_class_pre">' + result.ui + "</pre>")) : alert(result.message);
            }, "json").success(function() {}).error(function(result) {
                500 == result.status && (wpp.xmli.actions_bar_message(wpp.strings.xmli.out_of_memory, "bad"), 
                jQuery("#wpp_i_preview_action").val("Preview Again"));
            });
        }), jQuery(".wpp_i_close_preview").live("click", function() {
            jQuery("#wpp_i_preview_raw_data").val("Preview Raw Data"), jQuery(".wpp_i_close_preview").hide(), 
            jQuery(".wppi_raw_preview_result").hide(), jQuery(".wppi_raw_preview_result").html("");
        }), jQuery("#wpp_i_preview_raw_data").live("click", function() {
            var source_type = jQuery("#wpp_property_import_source_type option:selected").val();
            if (!wpp.xmli.validate_source_info(source_type)) return !1;
            if ("" == source_type) return jQuery("#wpp_property_import_source_type").addClass("wpp_error"), 
            void 0;
            jQuery("#wpp_property_import_source_type").removeClass("wpp_error"), wpp.xmli.preview_raw_preview_result(wpp.strings.xmli.loading), 
            jQuery("#wpp_i_preview_raw_data").attr("disabled", !0);
            var params = {
                action: "wpp_property_import_handler",
                wpp_action: "execute_schedule_import",
                raw_preview: "true",
                data: jQuery("#wpp_property_import_setup").serialize()
            };
            void 0 !== schedule_id && (params.schedule_id = schedule_id), void 0 !== source_type && (params.source_type = source_type), 
            wpp.xmli.loading_show(), jQuery.post(wpp.instance.ajax_url, params, function(result) {
                wpp.xmli.loading_hide(), jQuery("#wpp_i_preview_raw_data").attr("disabled", !1), 
                jQuery("#wpp_i_preview_raw_data").val("Preview Again"), result.success === !0 || "true" === result.success ? (wpp.xmli.preview_raw_preview_result(result.preview_bar_message), 
                wpp.xmli.set_schedule_id(result.schedule_id), jQuery(".wpp_i_close_preview").show(), 
                jQuery(".wppi_raw_preview_result").show(), jQuery(".wppi_raw_preview_result").html('<pre class="wpp_class_pre">' + result.ui + "</pre>")) : wpp.xmli.preview_raw_preview_result(result.message, "bad"), 
                wpp.xmli.loading_hide();
            }, "json").success(function() {}).error(function(result) {
                jQuery("#wpp_i_preview_raw_data").attr("disabled", !1), 500 == result.status && (wpp.xmli.preview_raw_preview_result(wpp.strings.xmli.out_of_memory, "bad"), 
                jQuery("#wpp_i_preview_raw_data").val("Preview Raw Data")), wpp.xmli.preview_raw_preview_result(result.responseText, "bad"), 
                wpp.xmli.loading_hide();
            });
        }), jQuery("#wpp_import_auto_match").live("click", function() {
            wpp.xmli.perform_auto_matching();
        }), jQuery("#wpp_property_import_save").live("click", function(e) {
            e.preventDefault();
            var this_button = this, original_text = wpp.strings.xmli.save;
            wpp.xmli.actions_bar_message(wpp.strings.xmli.saving), jQuery(this_button).val(wpp.strings.xmli.processing);
            var params = {
                action: "wpp_property_import_handler",
                wpp_action: "save_new_schedule",
                data: jQuery("#wpp_property_import_setup").serialize()
            };
            void 0 !== schedule_id && (params.schedule_id = schedule_id), jQuery.post(wpp.instance.ajax_url, params, function(result) {
                "true" == result.success ? (wpp.xmli.actions_bar_message(wpp.strings.xmli.saved, "good", 7e3), 
                wpp.xmli.set_schedule_id(result.schedule_id), wpp.xmli.set_schedule_hash(result.hash), 
                jQuery(this_button).val(original_text)) : wpp.xmli.actions_bar_message(result.message, "error");
            }, "json");
        }), jQuery("#wpp_property_import_update").live("click", function(e) {
            e.preventDefault();
            var this_button = this, original_text = wpp.strings.xmli.save;
            wpp.xmli.actions_bar_message(wpp.strings.xmli.updating), jQuery(this_button).val(wpp.strings.xmli.processing), 
            schedule_id = jQuery(this).attr("schedule_id"), jQuery.post(wpp.instance.ajax_url, {
                action: "wpp_property_import_handler",
                wpp_action: "update_schedule",
                schedule_id: schedule_id,
                data: jQuery("#wpp_property_import_setup").serialize()
            }, function(result) {
                "object" == typeof result && "true" === result.success ? (wpp.xmli.set_schedule_id(result.schedule_id), 
                wpp.xmli.set_schedule_hash(result.hash), wpp.xmli.actions_bar_message(wpp.strings.xmli.updated, "good", 7e3), 
                jQuery(this_button).val(original_text)) : wpp.xmli.actions_bar_message(result.message, "error");
            }, "json");
        }), jQuery("#wpp_property_import_add_import").click(function() {
            jQuery(".updated").remove(), wpp.xmli.show_schedule_editor_ui();
        }), jQuery(".wpp_property_import_edit_report").click(function() {
            var schedule_id = jQuery(this).attr("schedule_id");
            wpp.xmli.show_schedule_editor_ui(schedule_id);
        }), jQuery(".wpp_i_sort_schedules").click(function(e) {
            e.preventDefault(), jQuery(".wpp_i_sort_schedules a").removeClass("current"), jQuery("a", this).addClass("current");
            var sort_by = jQuery(this).attr("sort_by"), sort_direction = jQuery(this).attr("sort_direction"), mylist = jQuery("#wpp_property_import_overview tbody"), listitems = mylist.children("tr").get();
            listitems.sort(function(a, b) {
                var compA = jQuery(a).attr(sort_by), compB = jQuery(b).attr(sort_by);
                if (compA = void 0 === compA ? 0 : parseInt(compA), compB = void 0 === compB ? 0 : parseInt(compB), 
                "DESC" == sort_direction) var index = compB > compA ? -1 : compA > compB ? 1 : 0; else var index = compA > compB ? -1 : compB > compA ? 1 : 0;
                return index;
            }), "DESC" == sort_direction ? jQuery(this).attr("sort_direction", "ASC") : jQuery(this).attr("sort_direction", "DESC"), 
            jQuery.each(listitems, function(idx, itm) {
                mylist.append(itm);
            });
        }), jQuery(".wppi_delete_all_feed_properties").click(function(e) {
            e.preventDefault();
            var verify_response, row = jQuery(this).parents(".wpp_i_schedule_row"), total_properties = jQuery(row).attr("total_properties"), schedule_id = jQuery(row).attr("schedule_id"), import_title = jQuery(row).attr("import_title");
            verify_response = prompt("Confirm that you want to delete all " + total_properties + " properties from this feed by typing in in 'delete' below, or press 'Cancel' to cancel."), 
            "delete" == verify_response && (jQuery("#wpp_property_import_ajax").show(), jQuery("#wpp_property_import_ajax").html("<div class='updated below-h2'><p>Deleting all properties from " + import_title + ". You can close your browser, the operation will continue until completion.</p></div>"), 
            jQuery.post(wpp.instance.ajax_url, {
                action: "wpp_property_import_handler",
                schedule_id: schedule_id,
                wpp_action: "delete_all_schedule_properties"
            }, function(result) {
                "true" == result.success ? jQuery("#wpp_property_import_ajax").html("<div class='updated below-h2'><p>" + result.ui + "</p></div>") : jQuery("#wpp_property_import_ajax").html("<div class='updated below-h2'><p>" + wpp.strings.xmli.error_occured + "</p></div>");
            }, "json"));
        }), jQuery(".wpp_property_import_delete_report").click(function(e) {
            if (e.preventDefault(), confirm(wpp.strings.xmli.are_you_sure)) {
                var schedule_id = jQuery(this).attr("schedule_id"), rmel = jQuery(this).parents("tr");
                jQuery.post(wpp.instance.ajax_url, {
                    action: "wpp_property_import_handler",
                    schedule_id: schedule_id,
                    wpp_action: "delete_schedule"
                }, function(result) {
                    "true" == result.success && (jQuery(rmel).remove(), 1 == jQuery("#wpp_property_import_overview tr").length && jQuery("#wpp_property_import_overview").remove());
                }, "json");
            }
        }), jQuery("#wpp_property_import_remote_url, #wpp_property_import_username, #wpp_property_import_password").live("change", function() {
            wpp.xmli.determine_settings({});
        }), jQuery("#wpp_property_import_source_type").live("change", wpp.xmli.source_changed), 
        jQuery("#wpp_property_import_source_status").live("click", function() {
            wpp.xmli.evaluate_source(this, !1, !0);
        }), jQuery("#wpp_property_import_unique_id").live("change", function() {
            wpp.xmli.import_build_unique_id_selector();
        }), jQuery('select[name^="wpp_property_import[map]"]').live("change", function() {
            wpp.xmli.import_build_unique_id_selector();
        });
    },
    source_changed: function() {
        wpp.xmli.debug("wpp.xmli.source_changed()"), wpp.xmli.determine_settings({}), jQuery("#wpp_property_import_source_type").removeClass("wpp_error");
    },
    debug: function() {
        wpp.xmli.settings.debug && "function" == typeof console.log && console.log.apply(console, arguments);
    },
    loading_show: function() {
        jQuery(".wpp_xi_loader").css("display", "inline-block");
    },
    loading_hide: function() {
        jQuery(".wpp_xi_loader").hide();
    },
    import_build_unique_id_selector: function() {
        var uid_container = jQuery(".wpp_i_unique_id_wrapper"), uid_select_element = jQuery("#wpp_property_import_unique_id"), selected_id = uid_select_element.val(), selected_attributes = jQuery("select[name^='wpp_property_import[map]'] option:selected[value!='']").length;
        uid_select_element.html(""), uid_select_element.append('<option value=""> - </option>'), 
        jQuery('select[name^="wpp_property_import[map]"] option:selected').each(function() {
            var attribute_slug = jQuery(this).val(), cur = jQuery('select#wpp_property_import_unique_id option[value="' + attribute_slug + '"]');
            if (0 == cur.length && "" != cur.val()) {
                var title = jQuery(this).html();
                uid_select_element.append('<option value="' + attribute_slug + '">' + title + "</option>");
            }
            "" != selected_id && null != selected_id && uid_select_element.val(selected_id);
        }), 0 == selected_attributes ? jQuery(".wpp_i_unique_id_wrapper").hide() : (jQuery(".wpp_i_unique_id_wrapper").show(), 
        "" == selected_id ? jQuery("span.description", uid_container).html(wpp.strings.xmli.select_unique_id) : jQuery("span.description", uid_container).html(wpp.strings.xmli.unique_id_attribute));
    },
    perform_auto_matching: function() {
        wpp.xmli.debug("wpp.xmli.perform_auto_matching()");
        var wpp_all_importable_attributes = new Array(), wpp_all_importable_attributes_labels = new Array(), wpp_successful_matches = 0, source_type = jQuery("#wpp_property_import_source_type").val();
        if (jQuery("#wpp_import_auto_match").attr("disabled", !1), jQuery("#wpp_import_auto_match").val("Automatically Match"), 
        void 0 === wpp_auto_matched_tags) return jQuery("#wpp_import_auto_match").val("Reloading XML..."), 
        jQuery("#wpp_import_auto_match").attr("disabled", !0), wpp.xmli.evaluate_source(!1, wpp.xmli.perform_auto_matching), 
        void 0;
        if (jQuery("#wpp_property_import_attribute_mapper .wpp_dynamic_table_row option").each(function() {
            var meta_key = jQuery(this).val(), label = jQuery(this).text();
            "" != meta_key && -1 != !jQuery.inArray(meta_key, wpp_all_importable_attributes) && wpp_all_importable_attributes.push(meta_key), 
            "" != label && -1 != !jQuery.inArray(label, wpp_all_importable_attributes_labels) && wpp_all_importable_attributes_labels.push(label);
        }), jQuery.each(wpp_auto_matched_tags, function() {
            var xml_tag = String(this), wpp_like_xml_tag = wpp_create_slug(xml_tag);
            if ("wpp" == source_type && "images" == wpp_like_xml_tag) return !0;
            if (-1 == jQuery.inArray(wpp_like_xml_tag, wpp_all_importable_attributes)) return -1 == jQuery.inArray(wpp_like_xml_tag, wpp_all_importable_attributes_labels), 
            void 0;
            if (jQuery("#wpp_property_import_attribute_mapper .wpp_dynamic_table_row option[value=" + wpp_like_xml_tag + "]:selected").length > 0) return !0;
            var added_row = wpp_add_row(jQuery(".wpp_add_row"));
            jQuery(".wpp_import_attribute_dropdown", added_row).val(wpp_like_xml_tag), jQuery(".xpath_rule", added_row).val(xml_tag), 
            wpp_successful_matches++;
        }), "wpp" == source_type && jQuery("#wpp_property_import_attribute_mapper .wpp_dynamic_table_row option[value=images]:selected").length < 1) {
            var added_row = wpp_add_row(jQuery(".wpp_add_row"));
            jQuery(".wpp_import_attribute_dropdown", added_row).val("images"), jQuery(".xpath_rule", added_row).val("gallery/*/large"), 
            wpp_successful_matches++;
        }
        if ("rets" == source_type && jQuery("#wpp_property_import_attribute_mapper .wpp_dynamic_table_row option[value=images]:selected").length < 1) {
            var added_row = wpp_add_row(jQuery(".wpp_add_row"));
            jQuery(".wpp_import_attribute_dropdown", added_row).val("images"), jQuery(".xpath_rule", added_row).val("wpp_gallery/*/path"), 
            wpp_successful_matches++;
        }
        wpp.xmli.rule_table_remove_blank_rows(), wpp.xmli.import_build_unique_id_selector(), 
        "wpp" == source_type && jQuery("#wpp_property_import_unique_id").val("wpp_gpid");
    },
    rule_table_remove_blank_rows: function() {
        jQuery("#wpp_property_import_attribute_mapper .wpp_dynamic_table_row").length < 2 || jQuery("#wpp_property_import_attribute_mapper .wpp_dynamic_table_row").each(function() {
            var wpp_import_attribute_dropdown = jQuery(".wpp_import_attribute_dropdown option:selected", this).val(), xpath_rule = jQuery(".xpath_rule", this).val();
            "" == xpath_rule && "" == wpp_import_attribute_dropdown && jQuery(this).remove();
        });
    },
    evaluate_source: function(object, callback_func, do_not_use_cache) {
        wpp.xmli.debug("wpp.xmli.evaluate_source()"), do_not_use_cache || (do_not_use_cache = !1);
        var remote_url = jQuery("#wpp_property_import_remote_url").val(), import_type = jQuery("#wpp_property_import_source_type option:selected").val();
        if (remote_url.length && "" != import_type) {
            if (jQuery(".wpp_i_source_feedback").hide(), jQuery(".wpp_property_import_gs_options .wpp_i_advanced_source_settings, .wpp_property_import_rets_options .wpp_i_advanced_source_settings").hide(), 
            "wpp" == import_type ? jQuery("#wpp_property_import_choose_root_element").val("/objects/object") : "gs" == import_type ? (jQuery("#wpp_property_import_choose_root_element").val("ROW"), 
            jQuery(".wpp_property_import_gs_options .wpp_i_advanced_source_settings").show()) : "rets" == import_type && (jQuery("#wpp_property_import_choose_root_element").val("/ROWS/ROW"), 
            jQuery(".wpp_property_import_rets_options .wpp_i_advanced_source_settings").show()), 
            "wpp_property_import_remote_url" == jQuery(object).attr("id") && (remote_url.search("action=wpp_export_properties") > 0 ? jQuery("#wpp_property_import_source_type").val("wpp") : remote_url.search("spreadsheets.google.com") > 0 && jQuery("#wpp_property_import_source_type").val("gs")), 
            "rets" == import_type || "gs" == import_type) {
                if ("gs" == import_type && ("" == jQuery("#wpp_property_import_username").val() || "" == jQuery("#wpp_property_import_password").val())) return alert("Please fill out all required fields, check the advanced properties if you're unsure of where to look."), 
                !1;
                if ("rets" == import_type && ("" == jQuery("#wpp_property_import_rets_username").val() || "" == jQuery("#wpp_property_import_rets_password").val() || "" == jQuery("#wpp_property_import_rets_class").val())) return alert("Please fill out all required fields, check the advanced properties if you're unsure of where to look."), 
                !1;
            }
            wpp.xmli.loading_show(), wpp.xmli.source_status("processing");
            var params = {
                action: "wpp_property_import_handler",
                wpp_action: "execute_schedule_import",
                wpp_action_type: "source_evaluation",
                source_type: jQuery("#wpp_property_import_source_type option:selected").val(),
                data: jQuery("#wpp_property_import_setup").serialize()
            };
            do_not_use_cache && (params.do_not_use_cache = !0), void 0 !== schedule_id && (params.schedule_id = schedule_id), 
            jQuery.post(wpp.instance.ajax_url, params, function(result) {
                wpp.xmli.loading_hide(), wpp.xmli.set_schedule_id(result.schedule_id), wpp.xmli.set_schedule_hash(result.hash), 
                wpp_auto_matched_tags = result.auto_matched_tags, jQuery("#wpp_import_auto_match").val(wpp.strings.xmli.automatically_match), 
                jQuery("#wpp_import_auto_match").attr("disabled", !1), "true" == result.success ? (wpp.xmli.source_status("good"), 
                callback_func && "function" == typeof callback_func && callback_func()) : (wpp.xmli.source_status("bad"), 
                wpp.xmli.source_check_result(result.message, "bad"));
            }, "json").success(function() {}).error(function(result) {
                return wpp.xmli.loading_hide(), 500 == result.status ? (wpp.xmli.source_status("server_error"), 
                wpp.xmli.source_check_result(wpp.strings.xmli.evaluation_500_error, "bad"), void 0) : (wpp.xmli.source_status("bad"), 
                wpp.xmli.source_check_result(wpp.strings.xmli.request_error + " " + result.responseText, "bad"), 
                void 0);
            });
        }
    },
    set_schedule_id: function(schedule_id) {
        return window.location.hash = schedule_id, schedule_id;
    },
    set_schedule_hash: function(schedule_hash) {
        return import_hash = schedule_hash, jQuery("#import_hash").val(import_hash), schedule_hash;
    },
    actions_bar_message: function(message, type, delay) {
        var element = jQuery(".wpp_i_import_actions_bar .wpp_i_ajax_message");
        if (element.removeClass("wpp_i_error_text"), void 0 !== type && "" != type) if ("bad" == type) var add_class = "wpp_i_error_text"; else if ("good" == type) var add_class = ""; else var add_class = type;
        return "" == message || void 0 == message ? (void 0 != delay ? element.delay(delay).fadeOut("slow") : element.hide(), 
        void 0) : (add_class && (element.addClass("wpp_i_ajax_message"), element.addClass(add_class)), 
        element.show(), element.html(message), void 0 != delay && element.delay(delay).fadeOut("slow"), 
        void 0);
    },
    source_check_result: function(message, type) {
        var element = jQuery("li.wpp_i_source_feedback");
        return element.show(), element.removeClass("wpp_i_error_text"), void 0 === message ? (element.html(""), 
        element.hide(""), void 0) : ("bad" == type && element.addClass("wpp_i_error_text"), 
        element.html(message), void 0);
    },
    preview_raw_preview_result: function(message, type) {
        var element = jQuery("span.wpp_i_preview_raw_data_result");
        return element.removeClass("wpp_i_error_text"), void 0 === message ? (element.html(""), 
        void 0) : ("bad" == type && element.addClass("wpp_i_error_text"), element.html(message), 
        void 0);
    },
    source_status: function(status) {
        return wpp.xmli.debug("wpp.xmli.source_status()"), jQuery("#wpp_property_import_source_status").removeClass(), 
        "" == status ? (jQuery("#wpp_property_import_source_status").hide(), void 0) : (jQuery("#wpp_property_import_source_status").show(), 
        "ready_to_check" == status && jQuery("#wpp_property_import_source_status").text("Check Source"), 
        "processing" == status && (jQuery("#wpp_property_import_source_status").addClass("wpp_import_source_processing"), 
        jQuery("#wpp_property_import_source_status").text(wpp.strings.xmli.source_is_good)), 
        "good" == status && (jQuery("#wpp_property_import_source_status").addClass("wpp_import_source_good"), 
        jQuery("#wpp_property_import_source_status").text(wpp.strings.xmli.source_is_good)), 
        "bad" == status && (jQuery("#wpp_property_import_source_status").addClass("wpp_import_source_bad"), 
        jQuery("#wpp_property_import_source_status").text(wpp.strings.xmli.cannot_reload_source)), 
        "server_error" == status && (jQuery("#wpp_property_import_source_status").addClass("wpp_import_source_bad"), 
        jQuery("#wpp_property_import_source_status").text(wpp.strings.xmli.internal_server_error)), 
        void 0);
    },
    validate_source_info: function(type) {
        wpp.xmli.debug("wpp.xmli.validate_source_info()");
        var required_fields = jQuery("input.wpp_required", "[wpp_i_source_type=" + type + "]"), success = !0;
        return required_fields.length < 1 ? !0 : (jQuery(required_fields).each(function() {
            var value = jQuery.trim(jQuery(this).val());
            "" == value ? (jQuery(this).addClass("wpp_error"), success = !1) : (jQuery(this).val(value), 
            jQuery(this).removeClass("wpp_error"));
        }), success);
    },
    show_schedule_editor_ui: function(passed_schedule_id) {
        if (wpp.xmli.loading_show(), jQuery(".updated").remove(), "" == passed_schedule_id) var new_import = !0;
        schedule_id = passed_schedule_id, params = {
            action: "wpp_property_import_handler",
            wpp_action: "add_edit_schedule"
        }, new_import || (params.schedule_id = schedule_id), jQuery.post(wpp.instance.ajax_url, params, function(result) {
            "true" == result.success && (jQuery(".wpp_import_overview_page_element").hide(), 
            jQuery("#wpp_property_import_ajax").html(result.ui).show(), jQuery("#wpp_property_import_name").focus(), 
            wpp.xmli.loading_hide(), wpp.xmli.run_on_import_ui_display(result));
        }, "json");
    },
    advanced_option_counter: function() {
        jQuery("#wpp_property_limit_properties").val() || jQuery("#wpp_property_limit_scanned_properties").val() ? wpp.xmli.disable_advanced_option("#wpp_property_import_remove_non_existant_properties") : wpp.xmli.enable_advanced_option("#wpp_property_import_remove_non_existant_properties"), 
        jQuery("#wpp_import_log_detail").is(":checked") ? wpp.xmli.enable_advanced_option('input[name="wpp_property_import[show_sql_queries]"]') : wpp.xmli.disable_advanced_option('input[name="wpp_property_import[show_sql_queries]"]'), 
        jQuery('input[name="wpp_property_import[remove_all_from_this_source]"]').is(":checked") ? wpp.xmli.disable_advanced_option('input[name="wpp_property_import[remove_all_before_import]"]') : wpp.xmli.enable_advanced_option('input[name="wpp_property_import[remove_all_before_import]"]');
        var count = jQuery(".wpp_xi_advanced_setting.wpp_xi_enabld_row").length;
        return jQuery(".wpp_property_import_settings").is(":visible") || 0 == count ? (jQuery("span.wpp.xmli.advanced_option_counter").html(""), 
        void 0) : (jQuery("span.wpp.xmli.advanced_option_counter").html("( " + count + " " + wpp.strings.xmli.enabled_options + ")"), 
        void 0);
    },
    disable_advanced_option: function(element) {
        jQuery(element).prop("disabled", !0), jQuery(element).prop("checked", !1), jQuery(element).closest("li.wpp_xi_advanced_setting").css("opacity", .3).removeClass(".wpp_xi_enabld_row");
    },
    enable_advanced_option: function(element) {
        jQuery(element).prop("disabled", !1), jQuery(element).closest("li.wpp_xi_advanced_setting").css("opacity", 1);
    },
    refresh_dom: function() {
        wpp.xmli.debug("wpp.xmli.refresh_dom()");
        var current_page = !1;
        if (window.location.hash) if (11 == window.location.hash.length) {
            var hash = window.location.hash.replace("#", "");
            wpp.xmli.show_schedule_editor_ui(hash), current_page = "schedule_editor";
        } else "#add_new_schedule" == window.location.hash ? (wpp.xmli.show_schedule_editor_ui(hash), 
        current_page = "add_new_schedule") : current_page = "overview";
    },
    determine_settings: function(response) {
        wpp.xmli.debug("wpp.xmli.determine_settings()");
        var source_type = jQuery("#wpp_property_import_source_type option:selected").val(), source_label = jQuery("#wpp_property_import_source_type option:selected").html(), source_url = jQuery("#wpp_property_import_remote_url").val();
        "" != source_url && "" != source_type ? wpp.xmli.source_status("ready_to_check") : wpp.xmli.source_status(""), 
        jQuery(".wpp_i_advanced_source_settings").hide(), jQuery(".wpp_something_advanced_wrapper.wppi_source_option_preview_wrapper .wpp_i_source_specific").hide(), 
        jQuery(".wpp_something_advanced_wrapper.wppi_source_option_preview_wrapper .wpp_i_source_specific[wpp_i_source_type = " + source_type + " ]").not(".wpp_i_advanced_source_settings").show(), 
        jQuery("li.wpp_i_advanced_source_settings[wpp_i_source_type='" + source_type + "']").length ? (jQuery(".wppi_source_option_preview_wrapper.wpp_something_advanced_wrapper").show(), 
        jQuery(".wppi_source_option_preview_wrapper.wpp_something_advanced_wrapper .wpp_show_advanced").text(wpp.strings.xmli.toggle_advanced + " " + source_label + " " + wpp.strings.xmli.settings)) : jQuery(".wppi_source_option_preview_wrapper.wpp_something_advanced_wrapper").hide(), 
        response.schedule_exists || (("rets" == source_type || "gs" == source_type) && jQuery("#wpp_property_import_choose_root_element").val("//ROW"), 
        "csv" == source_type && jQuery("#wpp_property_import_choose_root_element").val("//object"));
    },
    run_on_import_ui_display: function(response) {
        wpp.xmli.debug("wpp.xmli.run_on_import_ui_display()"), wpp.xmli.determine_settings(response), 
        wpp.xmli.import_build_unique_id_selector(), jQuery(".wpp_xi_advanced_setting input[type=checkbox]").each(function() {
            var wrapper = jQuery(this).closest("li.wpp_xi_advanced_setting");
            jQuery(this).is(":checked") ? jQuery(wrapper).addClass("wpp_xi_enabld_row") : jQuery(wrapper).removeClass("wpp_xi_enabld_row");
        }), jQuery(".wpp_xi_advanced_setting input[type=text]").each(function() {
            var wrapper = jQuery(this).closest("li.wpp_xi_advanced_setting");
            return "" != jQuery(this).val() && "0" != jQuery(this).val() ? (jQuery(wrapper).addClass("wpp_xi_enabld_row"), 
            void 0) : (jQuery(this).val(""), jQuery(wrapper).removeClass("wpp_xi_enabld_row"), 
            void 0);
        }), wpp.xmli.advanced_option_counter();
    }
}, wpp.xmli || {}), jQuery(document).ready(wpp.xmli.ready);