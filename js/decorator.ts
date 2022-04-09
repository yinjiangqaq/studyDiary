interface param {
  name: string;
}

@decoratorName
class A {
  name: string = "";
  constructor(parameters: param) {
    this.name = parameters.name;
  }
}

function decoratorName(target: any) {
  console.log(target);
}

const a = new A({ name: "xxx" });
console.log(a);
