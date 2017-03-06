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
const Pug = require('pug');
const Path = require('path');
const Fs = require('fs');
const CSurf = require('csurf');

const router = module.exports = Express.Router();
const csurfMiddleware = CSurf({ cookie: true });

router.get('/login', function(req, res) {
    res.render(Path.join(__dirname, 'templates/login.pug'), {
        pageTitle: 'Ewald - login',
        csrfToken: req.csrfToken()
    });
});

router.post('/login', csurfMiddleware, function(req, res) {
    res.sendStatus(200);
});

router.get('/logout', function(req, res) {
    // TODO
    res.render(Path.join(__dirname, 'templates/base.pug'), {
        pageTitle: 'Ewald - home',
    });
});

router.get('/', function(req, res) {
    res.render(Path.join(__dirname, 'templates/base.pug'), {
        pageTitle: 'Ewald - home',
    });
});

