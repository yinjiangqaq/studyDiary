# ant design 开发中遇到的问题

## ant design 中的 Input.TextArea 单独使用时，不跟 form 捆绑使用时，需要获取 value 时，怎么解决输入不进值的情况

没有跟 form 捆绑使用的话，又想要正常的获取文本框的 value，我们可以采用 value +onChange

```
 const [rejectReason, setRejectReason] = useState('');
  const handleCancel = (e) => {
    console.log(rejectReason);
    setRejectReason('');
  };
  const handleOk = (record) => {
    //拿到这行的数据,以及此时的rejectReason,发送给接口
    console.log('驳回', record);
  };
  <Popconfirm
            title={
              <div>
                <div>需要提供不通过的理由</div>
                <Input.TextArea
                  placeholder="请输入不通过的理由"
                  value={rejectReason}
                  onChange={(e) => {
                    //单独inputTextArea，需要采用value+onchange回调，来实现输入值的双向绑定和更新
                    setRejectReason(e.target.value);
                  }}
                  rows={3}
                ></Input.TextArea>
              </div>
            }
            onCancel={handleCancel}
            onConfirm={(e) => handleOk(record)}
            okText="确认"
            cancelText="取消"
          >
            <a href="#">驳回</a>
          </Popconfirm>

```
