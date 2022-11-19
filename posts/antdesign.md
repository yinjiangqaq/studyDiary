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

## RangePicker 有个奇怪的 bug antd : date1.isAfter is not a function

```html
  <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="日期" name="time">
              <RangePicker
                format={dateFormat}
              />
            </Form.Item>
            </Form>
```

```js
//这里对应上面的onFinish
const onFinish = (values) => {
  //将moment转换为s的时间戳,但是不能直接改到rangePicker选中的两个moment对象的引用
  //需要重新复制一个对象
  let inputValues = { ...values };
  if (!!!values.time) {
    inputValues.time = [0, 9999999999]; //赋值了新的引用,避免操作之前的值
  } else {
    inputValues.time = [0, 9999999999];
    inputValues.time[0] = parseInt(+values.time[0] / 1000);
    inputValues.time[1] = parseInt(+values.time[1] / 1000);
    //也可以如下写法，重新更改新对象的引用,不操作老对象的引用
    // inputValues.time = [
    //   parseInt(+values.time[0] / 1000),
    //   parseInt(+values.time[1] / 1000),
    // ];
  }

  console.log("Success:", inputValues);
  setTableSpinning(true);
  findDeviceCase(inputValues) //用新的inputValues发请求
    .then((res) => {
      console.log(res.data);
      setTableData(res.data.caseData);
      setCaseSum(res.data.sum);
      setTableSpinning(false);
    })
    .catch((err) => {
      message.error(err.message);
    });
};
```

如上面所示，我们 RangePicker 选中之后，我们的 form 表单的数据中 time 项是一个数组，数组的两个元素均为 Moment 对象，既然是 Moment 对象，我们在发请求的时候，就不应该直接修改到他们的引用值，需要重新复制一个对象，然后新对象的 time 数组的引用指向一个新地址，然后再做其他的赋值操作，也就是如下 L:

```js
let inputValues = { ...values };
if (!!!values.time) {
  inputValues.time = [0, 9999999999];
} else {
  inputValues.time = [0, 9999999999];
  inputValues.time[0] = parseInt(+values.time[0] / 1000);
  inputValues.time[1] = parseInt(+values.time[1] / 1000);
}
```

这样就能防止出现 `antd : date1.isAfter is not a function`的错误

原本我的**错误**操作是这样的：

```js
const onFinish = (values) => {
  values.time[0] = parseInt(+values.time[0] / 1000);
  values.time[1] = parseInt(+values.time[1] / 1000);
  //为了传到后端的是时间戳，我这样处理导致我直接改了rangepicker里面两个moment对象的引用，就会报如上的错误
  setTableSpinning(true);
  findDeviceCase(values) //用新的inputValues发请求
    .then((res) => {
      console.log(res.data);
      setTableData(res.data.caseData);
      setCaseSum(res.data.sum);
      setTableSpinning(false);
    })
    .catch((err) => {
      message.error(err.message);
    });
};
```

## antd design form

### Form.Item.shouldUpdate

当 `shouldUpdate` 为 `true` 时，`Form` 的任意变化都会使该 `Form.Item` 重新渲染。这对于自定义渲染一些区域十分有帮助：

```js
<Form.Item shouldUpdate>
  {() => {
    return <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>;
  }}
</Form.Item>
```

当 `shouldUpdate` 为方法时，表单的每次数值更新都会调用该方法，**提供原先的值与当前的值以供你比较是否需要更新**。这对于是否根据值来渲染额外字段十分有帮助
： 这种十分适合那种单选框和其他表单的复合形式，例如单选框的选择决定了另外一个表单的展示与否，而且这两个表单后端需要的其实只有一个字段，所以我们还需要经过一层处理，把这个字段交给后端，等到编辑模式，需要把表单数据展示出来的时候，还是需要经过处理，把原来的一个字段拆分成两个字段。
场景:

```js
<Form.Item name="pricexx" label="设备价格">
  <Radio.Group>
    <Radio.Button value={0}>不限</Radio.Button>
    <Radio.Button value={1}>选择价格</Radio.Button>
  </Radio.Group>
</Form.Item>;
{
  form.getFieldValue("pricexxx") === 1 ? (
    <Form.Item name="price" label>
      <Select>xxxx</Select>
    </Form.Item>
  ) : null;
}
```

如果采用 Form.Item.shouldUpdate，就可以比较好的满足这种场景

```js
<Form.Item
  shouldUpdate={(pre: any, cur: any) => pre.price !== curr.price}
  label="设备价格"
>
  {({ getFieldValue }) => {
    const price = getFieldValue("price");
    return (
      <>
        <Radio.Group value={price ? 1 : 0}>
          <Radio.Button value={0}>不限</Radio.Button>
          <Radio.Button value={1}>选择价格</Radio.Button>
        </Radio.Group>
      {
        price? (
          <Form.Item name="price" label>
            <Select>xxxx</Select>
          </Form.Item>
        ) : null;
      }
      </>
    );
  }}
</Form.Item>;

```
