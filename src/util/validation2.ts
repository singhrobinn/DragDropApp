//===============Another Validation approach=================better one ======

const config: { [input: string]: string[] } = {};

//wtf is this?
const addValidator = (input: string, type: string) => {
  config[input] = config[input] ? [...config[input], type] : [type];
};

const Required = (_: any, input: string) => addValidator(input, "required");
const Maxlength = (_: any, input: string) => addValidator(input, "maxlength");
const Positive = (_: any, input: string) => addValidator(input, "positive");

const validateNew = (value: any) =>
  Object.entries(config).every(([input, types]) =>
    types.every(
      (type) =>
        (type === "required" && value[input]) ||
        (type === "positive" && value[input] > 0) ||
        (type === "maxlength" && value[input].length < 5)
    )
  );