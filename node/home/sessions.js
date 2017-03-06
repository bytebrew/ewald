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

const Session = require('cookie-session');

const SESSIONS_NAME = '511397b2fee443919eca215171e5ef04';
const SESSIONS_KEYS = ['fc44fd652adf49beb4e0dee2666de909'];
const SESSIONS_MAXAGE = 2 * 60 * 60 * 1000;

module.exports = Session({
    name: SESSIONS_NAME,
    keys: SESSIONS_KEYS,
    maxAge: SESSIONS_MAXAGE
});
