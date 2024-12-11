

console.setExitOnClose(7e3).show();

let ws = new WebSocket('http://101.201.33.155:8099');

ws
    .on(WebSocket.EVENT_OPEN, (res, ws) => {
        console.log('WebSocket 已连接');
    })
    .on(WebSocket.EVENT_MESSAGE, (message, ws) => {
        console.log('接收到消息');
        // if (message instanceof okio.ByteString) {
        //     console.log(`消息类型: ByteString`);
        // } else if (typeof message === 'string') {
        //     console.log(`消息类型: String`);
        // } else {
        //     throw TypeError('Should never happen');
        // }
    })
    .on(WebSocket.EVENT_TEXT, (text, ws) => {
        console.info('接收到文本消息:');
        console.info(`text: ${text}`);
    })
    .on(WebSocket.EVENT_BYTES, (bytes, ws) => {
        console.info('接收到字节数组消息:');
        console.info(`utf8: ${bytes.utf8()}`);
        console.info(`base64: ${bytes.base64()}`);
        console.info(`md5: ${bytes.md5()}`);
        console.info(`hex: ${bytes.hex()}`);
    })
    .on(WebSocket.EVENT_CLOSING, (code, reason, ws) => {
        console.log('WebSocket 关闭中');
    })
    .on(WebSocket.EVENT_CLOSED, (code, reason, ws) => {
        console.log('WebSocket 已关闭');
        console.log(`code: ${code}`);
        if (reason) console.log(`reason: ${reason}`);
    })
    .on(WebSocket.EVENT_FAILURE, (err, res, ws) => {
        console.error('WebSocket 连接失败');
        console.error(err);
    });

/* 发送文本消息. */
ws.send('Hello WebSocket');

/* 发送字节数组消息. */
ws.send(new okio.ByteString(new java.lang.String('Hello WebSocket').getBytes()));

setTimeout(() => {
    console.log('断开 WebSocket');
    ws.close('由用户断开连接');
}, 8e3);
