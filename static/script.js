const url_parameters_object = new URLSearchParams(window.location.search);
const available_symbol_names_list = ['code', 'music', 'picture', 'text', 'voice', 'other'];
const active_symbol_names_list = [];

for (const symbol_name_string of available_symbol_names_list) {
    if (url_parameters_object.has(symbol_name_string)) {
        active_symbol_names_list.push(symbol_name_string);
    } else {
        for (const [parameter_key_string, parameter_value_string] of url_parameters_object.entries()) {
            if (parameter_value_string === symbol_name_string || parameter_key_string === symbol_name_string) {
                if (!active_symbol_names_list.includes(symbol_name_string)) {
                    active_symbol_names_list.push(symbol_name_string);
                }
            }
        }
    }
}

active_symbol_names_list.sort();

const symbol_file_mapping_object = {
    'code': 'AI_Symbol_Code.svg',
    'music': 'AI_Symbol_Music_&_Sound.svg',
    'picture': 'AI_Symbol_Picture.svg',
    'text': 'AI_Symbol_Text.svg',
    'voice': 'AI_Symbol_Voice.svg',
    'other': 'AI_Symbol_Square.svg'
};

const symbol_title_mapping_object = {
    'code': 'Code',
    'music': 'Music & Sound',
    'picture': 'Pictures',
    'text': 'Text',
    'voice': 'Voice',
    'other': 'Other'
};

const symbol_description_mapping_object = {
    'code': 'AI-generated code',
    'music': 'AI-generated music or sound',
    'picture': 'AI-generated pictures or videos',
    'text': 'AI-generated text, transcripts etc.',
    'voice': 'AI-generated or cloned voices',
    'other': 'Other unclarified uses of AI'
};

let clean_query_string = '';
for (const active_symbol_name_string of active_symbol_names_list) {
    if (clean_query_string !== '') {
        clean_query_string = clean_query_string + '&';
    }
    clean_query_string = clean_query_string + active_symbol_name_string;
}

const symbol_container_element = document.getElementById('symbol_container_element');

if (symbol_container_element !== null) {
    const is_single_mode_active = url_parameters_object.has('single');

    if (is_single_mode_active === false) {
        symbol_container_element.href = 'https://mebebruno.github.io/BrunosAILabelSystem/explain.html?' + clean_query_string;
    } else {
        symbol_container_element.removeAttribute('target');
        symbol_container_element.removeAttribute('rel');
    }

    const files_to_render_list = [];

    if (is_single_mode_active === true) {
        if (active_symbol_names_list.length > 0) {
            const single_symbol_name_string = active_symbol_names_list[0];
            files_to_render_list.push({
                file_name_string: symbol_file_mapping_object[single_symbol_name_string],
                element_title_string: symbol_title_mapping_object[single_symbol_name_string]
            });
        }
    } else {
        files_to_render_list.push({
            file_name_string: 'AI_Bracket_Open.svg'
        });

        for (const active_symbol_name_string of active_symbol_names_list) {
            files_to_render_list.push({
                file_name_string: symbol_file_mapping_object[active_symbol_name_string],
                element_title_string: symbol_title_mapping_object[active_symbol_name_string]
            });
        }

        files_to_render_list.push({
            file_name_string: 'AI_Bracket_Closed.svg'
        });
    }

    for (const file_information_object of files_to_render_list) {
        const image_element = document.createElement('img');
        image_element.src = './modules/' + file_information_object.file_name_string;
        
        if (file_information_object.element_title_string !== undefined) {
            image_element.title = file_information_object.element_title_string;
            image_element.alt = file_information_object.element_title_string;
        } else {
            image_element.alt = '';
        }
        
        image_element.classList.add('ai_symbol_image');
        symbol_container_element.appendChild(image_element);
    }
}

const dynamic_heading_element = document.getElementById('dynamic_heading_element');
const dynamic_subtitle_element = document.getElementById('dynamic_subtitle_element');
const main_iframe_element = document.getElementById('label_iframe_element');
const legend_list_element = document.getElementById('legend_list_element');

if (dynamic_heading_element !== null && main_iframe_element !== null && legend_list_element !== null) {
    if (active_symbol_names_list.length === 0) {
        window.location.href = 'https://mebebruno.github.io/BrunosAILabelSystem/index.html';
    } else {
        const readable_names_list = [];
        for (const active_symbol_name_string of active_symbol_names_list) {
            readable_names_list.push(symbol_title_mapping_object[active_symbol_name_string]);
        }

        let combined_readable_title_string = 'AI-generated ';
        for (let loop_index_number = 0; loop_index_number < readable_names_list.length; loop_index_number = loop_index_number + 1) {
            combined_readable_title_string = combined_readable_title_string + readable_names_list[loop_index_number];
            if (loop_index_number < readable_names_list.length - 2) {
                combined_readable_title_string = combined_readable_title_string + ', ';
            } else if (loop_index_number === readable_names_list.length - 2) {
                combined_readable_title_string = combined_readable_title_string + ' and ';
            }
        }

        if (readable_names_list.includes('Other')) {
            combined_readable_title_string = 'Other AI-generated content';
        }

        let combined_identifier_title_string = '';
        for (let loop_index_number = 0; loop_index_number < readable_names_list.length; loop_index_number = loop_index_number + 1) {
            combined_identifier_title_string = combined_identifier_title_string + readable_names_list[loop_index_number].charAt(0);
        }
        combined_identifier_title_string = 'Bruno\'s AI Label Explanation (' + combined_identifier_title_string + ')';

        document.title = combined_identifier_title_string;
        dynamic_heading_element.textContent = combined_identifier_title_string;
        dynamic_subtitle_element.textContent = combined_readable_title_string;
        main_iframe_element.src = 'https://mebebruno.github.io/BrunosAILabelSystem/label.html?' + clean_query_string;

        async function initialize_dynamic_aspect_ratios_function() {
            const unique_file_names_to_measure_list = [];
            unique_file_names_to_measure_list.push('AI_Bracket_Open.svg');
            unique_file_names_to_measure_list.push('AI_Bracket_Closed.svg');
            
            for (const active_symbol_name_string of active_symbol_names_list) {
                const mapped_file_name_string = symbol_file_mapping_object[active_symbol_name_string];
                if (!unique_file_names_to_measure_list.includes(mapped_file_name_string)) {
                    unique_file_names_to_measure_list.push(mapped_file_name_string);
                }
            }

            const measured_aspect_ratios_object = {};
            const image_load_promise_list = [];

            for (const file_name_string of unique_file_names_to_measure_list) {
                const image_load_promise = new Promise(function(resolve_function) {
                    const image_element = new Image();
                    image_element.onload = function() {
                        measured_aspect_ratios_object[file_name_string] = image_element.naturalWidth / image_element.naturalHeight;
                        resolve_function();
                    };
                    image_element.onerror = function() {
                        measured_aspect_ratios_object[file_name_string] = 1;
                        resolve_function();
                    };
                    image_element.src = './modules/' + file_name_string;
                });
                image_load_promise_list.push(image_load_promise);
            }

            await Promise.all(image_load_promise_list);

            let total_intrinsic_aspect_ratio_number = 0;
            total_intrinsic_aspect_ratio_number = total_intrinsic_aspect_ratio_number + measured_aspect_ratios_object['AI_Bracket_Open.svg'];
            
            for (const active_symbol_name_string of active_symbol_names_list) {
                total_intrinsic_aspect_ratio_number = total_intrinsic_aspect_ratio_number + measured_aspect_ratios_object[symbol_file_mapping_object[active_symbol_name_string]];
            }
            
            total_intrinsic_aspect_ratio_number = total_intrinsic_aspect_ratio_number + measured_aspect_ratios_object['AI_Bracket_Closed.svg'];
            
            const adjusted_main_aspect_ratio_number = (total_intrinsic_aspect_ratio_number * 0.9) + 0.1;
            const rounded_main_iframe_ratio_number = Math.round(adjusted_main_aspect_ratio_number * 1000) / 1000;
            main_iframe_element.style.aspectRatio = rounded_main_iframe_ratio_number + ' / 1';

            let max_individual_aspect_ratio_number = 0;
            
            for (const active_symbol_name_string of active_symbol_names_list) {
                const individual_intrinsic_aspect_ratio_number = measured_aspect_ratios_object[symbol_file_mapping_object[active_symbol_name_string]];
                const adjusted_individual_aspect_ratio_number = (individual_intrinsic_aspect_ratio_number * 0.9) + 0.1;
                
                if (adjusted_individual_aspect_ratio_number > max_individual_aspect_ratio_number) {
                    max_individual_aspect_ratio_number = adjusted_individual_aspect_ratio_number;
                }
            }

            const rounded_max_ratio_number = Math.round(max_individual_aspect_ratio_number * 1000) / 1000;
            legend_list_element.style.setProperty('--dynamic_icon_column_width', 'calc(4rem * ' + rounded_max_ratio_number + ')');

            for (const active_symbol_name_string of active_symbol_names_list) {
                const list_item_element = document.createElement('li');
                list_item_element.classList.add('legend_item_element');

                const legend_iframe_element = document.createElement('iframe');
                legend_iframe_element.src = 'https://mebebruno.github.io/BrunosAILabelSystem/label.html?' + active_symbol_name_string + '&single';
                legend_iframe_element.title = symbol_title_mapping_object[active_symbol_name_string];
                legend_iframe_element.setAttribute('aria-hidden', 'true');
                legend_iframe_element.setAttribute('tabindex', '-1');
                legend_iframe_element.classList.add('legend_iframe_element');
                
                const individual_intrinsic_aspect_ratio_number = measured_aspect_ratios_object[symbol_file_mapping_object[active_symbol_name_string]];
                const adjusted_individual_aspect_ratio_number = (individual_intrinsic_aspect_ratio_number * 0.9) + 0.1;
                const rounded_individual_ratio_number = Math.round(adjusted_individual_aspect_ratio_number * 1000) / 1000;
                legend_iframe_element.style.aspectRatio = rounded_individual_ratio_number + ' / 1';

                const paragraph_element = document.createElement('p');
                paragraph_element.innerHTML = symbol_description_mapping_object[active_symbol_name_string];
                paragraph_element.classList.add('legend_text_element');

                list_item_element.appendChild(legend_iframe_element);
                list_item_element.appendChild(paragraph_element);
                legend_list_element.appendChild(list_item_element);
            }
        }

        initialize_dynamic_aspect_ratios_function();
    }
}

const checkbox_container_element = document.getElementById('checkbox_container_element');

if (checkbox_container_element !== null) {
    const checkbox_node_list = document.querySelectorAll('.symbol_checkbox_element');
    const single_mode_checkbox_element = document.getElementById('single_mode_checkbox_element');
    const iframe_preview_container_element = document.getElementById('iframe_preview_container_element');
    const output_textarea_element = document.getElementById('output_textarea_element');
    const markdown_output_textarea_element = document.getElementById('markdown_output_textarea_element');

    for (const checkbox_element of checkbox_node_list) {
        if (active_symbol_names_list.includes(checkbox_element.value)) {
            checkbox_element.checked = true;
        }
    }

    if (url_parameters_object.has('single')) {
        single_mode_checkbox_element.checked = true;
    }

    async function update_generated_code_function() {
        const selected_symbol_names_list = [];
        
        for (const checkbox_element of checkbox_node_list) {
            if (checkbox_element.checked) {
                selected_symbol_names_list.push(checkbox_element.value);
            }
        }

        selected_symbol_names_list.sort();

        if (selected_symbol_names_list.length === 0) {
            output_textarea_element.value = 'Please select at least one symbol above.';
            markdown_output_textarea_element.value = 'Please select at least one symbol above.';
            iframe_preview_container_element.innerHTML = '';
            return;
        }

        let new_clean_query_string = '';
        let markdown_identifier_string = '';
        for (const selected_symbol_name_string of selected_symbol_names_list) {
            if (new_clean_query_string !== '') {
                new_clean_query_string = new_clean_query_string + '&';
            }
            new_clean_query_string = new_clean_query_string + selected_symbol_name_string;
            markdown_identifier_string = markdown_identifier_string + symbol_title_mapping_object[selected_symbol_name_string].charAt(0);
        }

        const markdown_link_string = '[AI-Label: B-{' + markdown_identifier_string + '}](https://mebebruno.github.io/BrunosAILabelSystem/explain.html?' + new_clean_query_string + ')';

        const is_single_mode_active = single_mode_checkbox_element.checked;
        
        if (is_single_mode_active) {
            new_clean_query_string = new_clean_query_string + '&single';
        }

        const file_names_to_measure_list = [];
        
        if (is_single_mode_active) {
            file_names_to_measure_list.push(symbol_file_mapping_object[selected_symbol_names_list[0]]);
        } else {
            file_names_to_measure_list.push('AI_Bracket_Open.svg');
            for (const selected_symbol_name_string of selected_symbol_names_list) {
                file_names_to_measure_list.push(symbol_file_mapping_object[selected_symbol_name_string]);
            }
            file_names_to_measure_list.push('AI_Bracket_Closed.svg');
        }

        const image_load_promise_list = [];
        
        for (const file_name_string of file_names_to_measure_list) {
            const image_load_promise = new Promise(function(resolve_function) {
                const image_element = new Image();
                image_element.onload = function() {
                    resolve_function(image_element.naturalWidth / image_element.naturalHeight);
                };
                image_element.onerror = function() {
                    resolve_function(1);
                };
                image_element.src = './modules/' + file_name_string;
            });
            image_load_promise_list.push(image_load_promise);
        }

        const aspect_ratio_results_list = await Promise.all(image_load_promise_list);
        let total_aspect_ratio_sum_number = 0;
        
        for (const aspect_ratio_number of aspect_ratio_results_list) {
            total_aspect_ratio_sum_number = total_aspect_ratio_sum_number + aspect_ratio_number;
        }
        
        const adjusted_generated_aspect_ratio_number = (total_aspect_ratio_sum_number * 0.9) + 0.1;
        const rounded_ratio_number = Math.round(adjusted_generated_aspect_ratio_number * 1000) / 1000;

        const iframe_code_string = '<iframe src=\'https://mebebruno.github.io/BrunosAILabelSystem/label.html?' + new_clean_query_string + '\' style=\'height: 3rem; aspect-ratio: ' + rounded_ratio_number + ' / 1; border: none; background: transparent; overflow: hidden;\' title=\'AI Label\'></iframe>';
        
        output_textarea_element.value = iframe_code_string;
        markdown_output_textarea_element.value = markdown_link_string;
        iframe_preview_container_element.innerHTML = iframe_code_string;
    }

    for (const checkbox_element of checkbox_node_list) {
        checkbox_element.addEventListener('change', function(event_object) {
            const clicked_checkbox_element = event_object.target;
            
            if (clicked_checkbox_element.checked === true) {
                if (clicked_checkbox_element.value === 'other') {
                    for (const loop_checkbox_element of checkbox_node_list) {
                        if (loop_checkbox_element.value !== 'other') {
                            loop_checkbox_element.checked = false;
                        }
                    }
                } else {
                    for (const loop_checkbox_element of checkbox_node_list) {
                        if (loop_checkbox_element.value === 'other') {
                            loop_checkbox_element.checked = false;
                        }
                    }
                }
            }
            
            update_generated_code_function();
        });
    }

    single_mode_checkbox_element.addEventListener('change', update_generated_code_function);

    update_generated_code_function();
}
