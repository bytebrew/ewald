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

const Express = require('express');
const BodyParser = require('body-parser');
const Path = require('path');
const app = module.exports = Express();

// common settintgs and meddleware
app.set('view engine', 'pug');
app.use(BodyParser.json());
app.use(Express.static(Path.join(__dirname, 'static')));
app.use(require('./home/sessions.js'));

// set up main routes and start application
app.use(require('./home/router.js'));
app.listen(process.env.PORT || 8080);
