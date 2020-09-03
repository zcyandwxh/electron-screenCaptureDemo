// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// const jQuery = window.jQuery = require("./node_modules/jquery");
// require("./node_modules/popper.js");
// require("./node_modules/bootstrap");
const jQuery = window.jQuery = require("jquery");
require("popper.js");
require("bootstrap");
const Vue = require("vue/dist/vue");
const electron = require('electron');
const fs = require('fs');

new Vue({
    el: "#vueapp",
    data: {
        recording: false
    },
    methods: {
        async btnStartRecordClicked() {
            this._stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            })
            let stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
            stream.getVideoTracks().forEach(value => this._stream.addTrack(value));
            this.$refs.preview.srcObject = stream;

            this._recorder = new MediaRecorder(this._stream, {
                mimeType: "video/webm;codecs=h264"
            });
            this._recorder.ondataavailable = async e => {
                console.log(electron)
                let path = electron.remote.dialog.showSaveDialogSync(
                    electron.remote.getCurrentWindow(), {
                        title: "保存文件",
                        defaultPath: "ScreenData.webm"
                    });
                console.log(path)
                await fs.writeFileSync(path, new Int8Array(await e.data.arrayBuffer()))
            };
            this._recorder.start();
            this.recording = true;
        },
        btnStopRecordClicked() {
            this.recording = false;
            this._recorder.stop();
        }
    },
})