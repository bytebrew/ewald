/*
 * Copyright (C) 2017 Elvis Teixeira
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(document).on('submit', '#login-form', function(event) {
    event.preventDefault(); // dont reload the page
    $.ajax({
        type: 'POST',
        url: '/login/',
        data: {
            "username": $("input[name=uname]").val(),
            "password": $("input[name=psw]").val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function() {
            window.location.href = "/home/";
        },
        error: function() {
            // TODO: improve
            alert('Login failed');
        }
    });
});
