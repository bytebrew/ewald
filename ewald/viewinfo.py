#
# Copyright (C) 2017 Elvis Teixeira
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.shortcuts import render as django_render

def render(request, template_name, context=None, content_type=None,
           status=None, using=None):
    """A wrapper around the the django render shortcut that adds userinfo
    to the displayed in views"""
    ewald_context = {
        'viewinfo' : {
            'urlname' : 'Ewald - ' + request.path.split('/')[1],
        }
    }
    if request.user.is_authenticated():
        ewald_context['viewinfo']['username'] = request.user.username
    if context is not None:
        ewald_context.update(context)
    return django_render(
        request, template_name, ewald_context, content_type, status, using)
