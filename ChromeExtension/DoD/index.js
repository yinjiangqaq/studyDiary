var token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWl0cmFxYSIsImVtYWlsIjoibWl0cmFxYUBzaG9wZWUuY29tIiwicGljdHVyZSI6IiIsInVzZXJpZCI6IiIsImlhdCI6MTY2MTkzMjU3MCwiZXhwIjoxOTc3MjkyNTcwfQ.oZQoJn7dHmJsVQLOJKzjp7N1mb4O8NPrLvShcRgcLgk";
var headers = {
  "Content-Type": "application/json",
};

const build_url = `${window.location.origin}/api/admin/v2/fe.apc.hotpatch.PatchAdminService/BuildPackageFromRemote`;
/**
 * shopeepay 相关app构建服务对应的信息
 */
var shopeepay_related_service_infos;
/**
 * 获取code push 平台的环境
 * @returns {env}
 */
const getCodePushPlatformEnv = () => {
  const str = window.location.host;
  const regex = /admin\.codepush\.i\.(.*?)\.shopee\.io/;
  const match = str.match(regex);
  if (match && match.length > 1) {
    return match[1];
  } else if (match && match.length === 1) {
    return "live";
  }
};

/**
 * 获取选择的App Type对应的build 任务
 * @param {*} options
 * @param {*} basicInfo
 * @returns
 */
const getShopeePayBuildServiceOfSelectedApps = (options, basicInfo) => {
  const { need_build_app_services, build_type, pfb_name, build_val } = options;

  const shopeepay_info = shopeepay_related_service_infos?.find(
    (item) => item.project_name === "shopeepay"
  );
  const shopeepay_plugin_version_info = shopeepay_info?.plugin_version[0];

  const mitra_info = shopeepay_related_service_infos?.find(
    (item) => item.project_name === "mitra"
  );
  const mitra_plugin_version_info = mitra_info?.plugin_version[0];

  const driver_info = shopeepay_related_service_infos?.find(
    (item) => item.project_name === "driver"
  );
  const driver_plugin_version_info = driver_info?.plugin_version[0];

  const partner_info = shopeepay_related_service_infos?.find(
    (item) => item.project_name === "partner"
  );
  const partner_plugin_version_info = partner_info?.plugin_version[0];

  const spx_info = shopeepay_related_service_infos?.find(
    (item) => item.project_name === "spx-sp"
  );
  const spx_plugin_version_info = spx_info?.plugin_version[0];

  const buildInfoMapOfApps = {
    shopeepay: {
      plugin_id: shopeepay_info?.plugin_id || 106,
      plugin_version_id: shopeepay_plugin_version_info.plugin_version_id || 475,
      region: ["th", "vn"],
    },
    mitra: {
      plugin_id: mitra_info?.plugin_id || 45,
      plugin_version_id: mitra_plugin_version_info.plugin_version_id || 671,
      region: ["id"],
    },
    driver: {
      plugin_id: driver_info?.plugin_id || 137,
      plugin_version_id: driver_plugin_version_info.plugin_version_id || 680,
      region: ["id"],
    },
    partner: {
      plugin_id: partner_info?.plugin_id || 36,
      plugin_version_id: partner_plugin_version_info.plugin_version_id || 406,
      region: ["id", "my", "ph", "sg", "th", "vn"],
    },
    "spx-sp": {
      plugin_id: spx_info?.plugin_id || 156,
      plugin_version_id: spx_plugin_version_info.plugin_version_id || 701,
      region: ["id", "my", "ph", "sg", "th", "vn"],
    },
  };

  const shopeepayBuildServiceOfSelectedApps = [];
  for (let i = 0; i < need_build_app_services.length; i++) {
    const info = buildInfoMapOfApps[need_build_app_services[i]];
    if (info) {
      const body = JSON.stringify({
        ...basicInfo,
        ...{
          ...info,
          source_code_type: build_type || "branch",
          source_code_val: build_val || "master",
          remark: pfb_name,
        },
      });

      const buildPromise = fetch(build_url, {
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        method: "POST",
        headers,
        body: body,
      });

      shopeepayBuildServiceOfSelectedApps.push(buildPromise);
    }
  }
  return shopeepayBuildServiceOfSelectedApps;
};

/**
 * 立即执行函数，获取ShopeePayPlugin在code push上的详细信息
 * 需要获取对应环境的，先通过获取window.origin 获取到对应的env
 * refer to https://confluence.shopee.io/pages/viewpage.action?pageId=524491064#heading-%E4%B8%80%E3%80%81API%E6%8B%89%E5%8F%96plugin%E4%BF%A1%E6%81%AF
 */

(function getShopeePayPluginInfo() {
  const env = getCodePushPlatformEnv();
  console.log("xxxxxxxx env: ", env);
  const url = `${window.location.origin}/api/admin/v2/fe.apc.hotpatch.PatchAdminService/GetPluginInfoFromRemote`;
  // const url = 'https://admin.codepush.i.test.shopee.io/api/admin/v2/fe.apc.hotpatch.PatchAdminService/GetPluginInfoFromRemote'
  const body = JSON.stringify({
    token,
    git_lab_id: 33870,
    env,
  });

  fetch(url, {
    mode: "same-origin", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    method: "POST",
    headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      // 处理响应数据
      console.log("xxxxxxxx data", data);
      shopeepay_related_service_infos = data.data.plugin_list.filter(
        (item) => item.plugin_name === "shopeepay"
      );
      console.log(
        "xxxxxxxxxxx shopeepay related service",
        shopeepay_related_service_infos
      );
    })
    .catch((error) => {
      // 处理错误
      console.log("xxxxxxxxxxxxx error", error);
      window.alert("get remote plugin info error", error);
    });
})();

// 辅助函数：把表单数据抽出来整合成对象
function transformFormData() {
  const form = document.getElementById("dodForm");
  // 获取options
  const appTypeValues = [];
  const appTypeCheckboxes = form.elements["need_build_app_services"];
  console.log("xxxxxxx appTypeCheckboxes", appTypeCheckboxes);
  for (let i = 0; i < appTypeCheckboxes.length; i++) {
    if (appTypeCheckboxes[i]?.checked) {
      appTypeValues.push(appTypeCheckboxes[i].value);
    }
  }
  const pfbName = form.elements["pfb_name"].value.trim();
  const buildType = form.elements["build_type"];

  let build_type_val;
  for (let i = 0; i < buildType.length; i++) {
    if (buildType[i]?.checked) {
      build_type_val = buildType[i].value;
    }
  }
  console.log("xxxxxxxxx branchType", buildType, build_type_val);
  const branchName = form.elements["build_val"].value.trim();

  console.log("xxxxxxxxx form data", appTypeValues, pfbName, branchName);
  return {
    need_build_app_services: appTypeValues,
    build_type: build_type_val,
    build_val: branchName,
    pfb_name: pfbName,
  };
}
/**
 * 选择对应App平台，批量构建
 * 因为目前每一个Plugin对应的信息应该是固定的，动态的只有需要用户填写的部分，例如App，分支/Tag， 分支名/Tag名，PFB名字
 * need_build_app_services -> 选择的App平台对应的Plugin 信息 mitra, shopeepay, driver, merchant, spx
 * build_type -> 选择的构建方式，是分支，还是Tag name
 * build_val -> 对应构建方式的值，分支对应分支名，tag对应tag名字
 * pfb_name -> 想要构建的PFB名字
 */
function build(event) {
  // 避免默认表单提交行为
  event.preventDefault();
  const env = getCodePushPlatformEnv();
  const options = transformFormData();
  console.log("xxxxxxx options", options);
  const basicInfo = {
    platform: ["android", "ios"],
    operator: "script bot",
    bundle_pfb: "release",
    env,
    auto_publish: false,
    release_type: "normal",
    is_hotfix: false,
    token,
  };
  const shopeepayBuildPromise = getShopeePayBuildServiceOfSelectedApps(
    options,
    basicInfo
  );

  if (shopeepayBuildPromise.length) {
    window.alert("Trigger build job");
  }

  Promise.all([shopeepayBuildPromise])
    .then((results) => {
      console.log("xxxxxxxxxxx results", results);
    })
    .catch((error) => {
      console.log("xxxxxxxx error", error);
    });
}
/**
 * 选择对应App平台，批量构建
 * 因为目前每一个Plugin对应的信息应该是固定的，动态的只有需要用户填写的部分，例如App，分支/Tag， 分支名/Tag名，PFB名字
 * need_build_app_services -> 选择的App平台对应的Plugin 信息 mitra, shopeepay, driver, merchant, spx
 * build_type -> 选择的构建方式，是分支，还是Tag name
 * build_val -> 对应构建方式的值，分支对应分支名，tag对应tag名字
 * pfb_name -> 想要构建的PFB名字
 */
function buildAndPublish() {
  // 避免默认表单提交行为
  event.preventDefault();
  const env = getCodePushPlatformEnv();
  const options = transformFormData();
  console.log("xxxxxxx options", options);
  const basicInfo = {
    platform: ["android", "ios"],
    operator: "script bot",
    bundle_pfb: "release",
    env,
    auto_publish: true, // 是否自动发布当构建成功之后
    release_type: "normal",
    is_hotfix: false,
    token,
  };
  const shopeepayBuildPromise = getShopeePayBuildServiceOfSelectedApps(
    options,
    basicInfo
  );

  if (shopeepayBuildPromise.length) {
    window.alert("Trigger build job");
  }

  Promise.all([shopeepayBuildPromise])
    .then((results) => {
      console.log("xxxxxxxxxxx build and publish results", results);
    })
    .catch((error) => {
      window.alert("Build fail");
      console.log("xxxxxxxx error", error);
    });
}

/**
 * 脚本注入的表单界面代码
 */

function injectForm() {
  // 动态加载 Ant Design 的样式文件
  const antdStyle = document.createElement("link");
  antdStyle.rel = "stylesheet";
  antdStyle.href = "https://cdn.jsdelivr.net/npm/antd/dist/antd.css";
  document.head.appendChild(antdStyle);

  // 动态加载 Ant Design 的脚本文件
  // const antdScript = document.createElement("script");
  // antdScript.src = "https://cdn.jsdelivr.net/npm/antd/dist/antd.js";
  // document.head.appendChild(antdScript);

  // 创建表单元素
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  var form = document.createElement("form");
  form.classList.add("ant-form", "ant-form-horizontal");
  form.id = "dodForm";
  const formItemContainer = document.createElement("div");
  form.appendChild(formItemContainer);
  // 创建并添加 appType 多选框
  const appTypeOptions = [
    {
      name: "need_build_app_services",
      label: "shopeepay",
      value: "shopeepay",
    },
    {
      name: "need_build_app_services",
      label: "mitra",
      value: "mitra",
    },
    {
      name: "need_build_app_services",
      label: "driver",
      value: "driver",
    },
    {
      name: "need_build_app_services",
      label: "partner",
      value: "partner",
    },
    {
      name: "need_build_app_services",
      label: "spx-sp",
      value: "spx-sp",
    },
  ];

  const buildTypeOptions = [
    {
      name: "build_type",
      label: "tag",
      value: "tag",
    },
    {
      name: "build_type",
      label: "branch",
      value: "branch",
    },
  ];

  const appTypeCheckBoxGroup = createCheckboxGroup(appTypeOptions);
  const buildTypeRadioGroup = createRadioGroup(buildTypeOptions);
  const branchNameInput = createInput("build_val");
  const pfbNameInput = createInput("pfb_name");
  const buildButton = createButton("Build", build);
  const buildAndPublishButton = createButton(
    "Build and Publish",
    buildAndPublish
  );
  const appTypeFormItem = createFormItem("App Type", appTypeCheckBoxGroup);
  const buildTypeFormItem = createFormItem("Build Type", buildTypeRadioGroup);
  const branchNameFormItem = createFormItem("Branch Name", branchNameInput);
  const pfbNameFormItem = createFormItem("PFB Name", pfbNameInput);
  const buttonFormItem = createFormItem("", buildButton);
  const buildAndPublishButtonFormItem = createFormItem(
    "",
    buildAndPublishButton
  );

  formItemContainer.appendChild(appTypeFormItem);
  formItemContainer.appendChild(buildTypeFormItem);
  formItemContainer.appendChild(branchNameFormItem);
  formItemContainer.appendChild(pfbNameFormItem);
  formItemContainer.appendChild(buttonFormItem);
  formItemContainer.appendChild(buildAndPublishButtonFormItem);
  formContainer.appendChild(form);

  document.body.appendChild(formContainer);
}
// 辅助函数
const createFormItem = (labelText, inputElement) => {
  const formItem = document.createElement("div");
  formItem.classList.add("ant-form-item", "ant-row", "formRow");
  const label = document.createElement("div");
  label.classList.add("ant-col", "ant-col-5", "label-text");
  label.innerText = labelText;

  const inputContainer = document.createElement("div");
  inputContainer.classList.add(
    "ant-form-item-control",
    "ant-col",
    "ant-col-19"
  );
  inputContainer.appendChild(inputElement);

  formItem.appendChild(label);
  formItem.appendChild(inputContainer);

  return formItem;
};
// 辅助函数
const createCheckboxGroup = (options) => {
  const checkboxGroup = document.createElement("div");
  checkboxGroup.classList.add("ant-checkbox-group");

  options.forEach((option) => {
    const checkbox = document.createElement("label");
    checkbox.classList.add("ant-checkbox-wrapper");
    checkbox.id = "checkBoxLabel";
    const input = document.createElement("input");
    input.classList.add("check-box-input");
    input.type = "checkbox";
    input.name = option.name;
    input.value = option.value;
    checkbox.appendChild(input);
    checkbox.appendChild(document.createTextNode(option.label));

    checkboxGroup.appendChild(checkbox);
  });

  return checkboxGroup;
};
// 辅助函数
const createRadioGroup = (options) => {
  const radioGroup = document.createElement("div");
  radioGroup.classList.add("ant-radio-group");

  options.forEach((option) => {
    const radio = document.createElement("label");
    radio.classList.add("ant-radio-wrapper");
    radio.id = "radioLabel";
    const input = document.createElement("input");
    input.classList.add("radio-input");
    input.type = "radio";
    input.name = option.name;
    input.value = option.value;
    input.required = true;
    radio.appendChild(input);
    radio.appendChild(document.createTextNode(option.label));

    radioGroup.appendChild(radio);
  });

  return radioGroup;
};
// 辅助函数
const createInput = (name) => {
  const input = document.createElement("input");
  input.name = name;
  input.required = true;
  input.classList.add("ant-input");

  return input;
};
// 辅助函数
const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.classList.add("ant-btn", "ant-btn-primary");
  button.innerText = text;
  button.addEventListener("click", onClick);

  return button;
};

// TODO: toast 提示， git分支远程获取

injectForm();
