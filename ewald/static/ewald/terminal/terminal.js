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

var terminal = { VERSION: 0.1 };

terminal.Terminal = function(args) {
    // Required argument
    if (!args.textArea) {
        throw Error('Terminal constructor needs an HTML text area');
    }
    // Other arguments
    this.serverTokens = args.serverTokens;
    // Arguments with default values
    let textArea = this.textArea = args.textArea;
    let prompt = this.prompt = args.prompt || 'terminal: ';
    let self = this;
    this.style = {
        background: '#1A1A1A',
        color: '#1AFF1A',
        minWidth: '500px',
        maxWidth: '1200px',
        minHeight: '400px',
        border: 'solid 5px lightgray',
        margin: '20px 20px',
        padding: '20px 20px',
        fontSize: '13pt',
        lineHeight: '150%',
        fontFamily: 'monospace',
    };
    // style the textarea HTML element giving precedence to user settings
    if (args.style) {
        for (let prop in args.style) {
            this.style[prop] = args.style[prop];
        }
    }
    for (let prop in this.style) {
        textArea.style[prop] = this.style[prop];
    }
    // set the key event handler to add the prompt and send the command
    // to the execution engine
    textArea.value = prompt;
    textArea.onkeydown = function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            self.onEnterPressed();
        }
    }
}

terminal.Terminal.prototype.onEnterPressed = function(command) {
    let content = this.textArea.value;
    let lastCommand = content.substr(
        content.lastIndexOf(this.prompt) + this.prompt.length);
    if (lastCommand.length > 0) {
        this.postCommand(lastCommand);
    }
}

terminal.Terminal.prototype.postCommand = function(command) {
    let postData = { cmd: command };
    let self = this;
    if (this.serverTokens) {
        for (let prop in this.serverTokens) {
            postData[prop] = this.serverTokens[prop];
        }
    }
    $.ajax({
        type: 'POST',
        url: '/terminal/command/',
        data: postData,
        success: function(result) {
            self.onCommandFinished({
                data: result,
                error: false
            });
        },
        error: function(result) {
            self.onCommandFinished({
                data: result,
                error: true
            });
        },
    });
}

terminal.Terminal.prototype.onCommandFinished = function(args) {
    let self = this;
    let commandOutput = '';
    if (args.data) {
            commandOutput = args.data;
    }
    self.textArea.value = self.textArea.value +
        '\n' + commandOutput + '\n' + self.prompt;
    self.textArea.scrollTop = self.textArea.scrollHeight;
}
