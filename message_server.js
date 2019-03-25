const net = require('net');                                 //获取net模块
const querystring = require('querystring');                 //获取querystring模块
const port = 8000;                                          //指定端口8000
const msgs = [];                                            //储存留言板消息的数组

const server = net.createServer(conn=>{                     //创建服务器，当连接建立时
    conn.on('data',d=>{                                     
        var d = d.toString();                               //获取浏览器发来的请求，转为字符串
        var lines = d.split('\r\n');                        //把请求整理成多行数组
        var firstLine = lines.shift();                      //获取第一行请求

        var [method,url] = firstLine.split(" ");            //获取第一行中的请求方法和url地址

        console.log(method);

        if(method == 'GET'){                                //如果是GET请求

        }
        if(method == 'POST'){                               //如果是POST请求
            var query = querystring.parse(lines.pop());     //把请求的最后一行转化为一个包含name和content的query对象
            query.timestamp = Date.now();                   //把当前时间给到这个对象

            msgs.push(query);                               //把这个对象放到msgs数组中
            conn.write('HTTP/1.1 302 Moved\r\n');           //把POST的响应转到GET
            conn.write('Location: /\r\n');                  //重新GET一下这个页面
            conn.write('\r\n');
            conn.end();
            return;                                         //结束if这个语句
        }
        conn.write('HTTP/1.1 200 ok\r\n');                  //write出响应(响应头)
        conn.write('Content-Type: text/html\r\n');          //文本格式
        conn.write('\r\n');                                 //回车换行

        //write出输入框和文本输入框
        conn.write(`                                        
            <form action='/' method='POST'>
                <input type='text' name='name'/>
                <textarea name='content'></textarea>
                <button>Submit</button>
            </form>
        `);

        //write出一个包含所有留言的列表
        conn.write(`
            <ul>
                ${
                    msgs.slice().reverse().map(msg => `
                        <li>
                            <h3>${msg.name} <small>${new Date(msg.timestamp).toLocaleString()}</small></h3>
                            <p>${msg.content}</p>
                        </li>
                    `).join('')
                }
            </ul>
        `)
    })
});

//name=zym&msg=hello
//把POST请求的最后一行转换为一个包含name和content的对象
function parseQueryString(str){
    return str
    .split('&')
    .map(it => it.split('='))
    .reduce((result,pair) =>{
        var key = pair[0];
        var val = decodeURIComponent(pair[1]);
        result[key] = val;
        return result;
    },{})
}

//服务器监听8000端口
server.listen(port,()=>{
    console.log('server listening on port',port);
})


