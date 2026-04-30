import config from "../config.json" assert { type: "json" };

class InputElement {
  constructor(inputType, defaultValue, selectValues) {
    if (inputType === "select") {
      this.input = document.createElement("select");
      this.input.style.width = "30%";
      this.input.style.padding = "8px";
      this.input.style.backgroundColor = "#aaaaaa";

      selectValues.forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val.toLowerCase();
        opt.textContent = val;
        this.input.appendChild(opt);
      });
    } else {
      this.input = document.createElement("input");
      this.input.value = defaultValue;
      this.input.type = inputType;
      this.input.style.width = "30%";
      this.input.style.backgroundColor = "#aaaaaa";
      this.input.style.padding = "8px";
      if (inputType === "checkbox") {
        this.input.checked = false;
      }
    }

    this.get = () => this.input.value;
  }

  set onchange(func) {
    this.input.onchange = func;
  }

  setDataType(dataType) {
    if (dataType == "float") this.get = () => parseFloat(this.input.value);
    if (dataType == "int") this.get = () => parseInt(this.input.value);
    return;
  }
}

export class ConfigHandler {
  constructor() {
    this.isOpen = false;
    this.config = config;
    this.inputElements = {};

    this.overlay = null;
    this.panel = null;
    this.closeBtn = null;
    this.clearBtn = null;
    this.handleKeyDown = this._handleKeyDown.bind(this);

    this._init();
  }

  createOption(
    name,
    inputLabel,
    inputType,
    dataType,
    defaultValue,
    selectValues,
    description,
  ) {
    const wrapper = document.createElement("div");
    wrapper.style.margin = "4px";

    const lbl = this._createInputLabel(inputLabel);
    const input = new InputElement(inputType, defaultValue, selectValues);
    input.setDataType(dataType);
    this.inputElements[name] = input;

    let desc = null;
    if (description) desc = this._createInputDescription(description);

    // put wrapper together
    wrapper.appendChild(lbl);
    wrapper.appendChild(input.input);
    if (desc) wrapper.appendChild(desc);
    this.overlay.appendChild(wrapper);
  }

  setImportApplyFunction(func) {
    // sets the function to be run when a config is imported
    this.apply = func;
  }

  openConfig() {
    this.overlay.style.display = "flex";
    this.isOpen = true;
  }

  closeConfig() {
    this.overlay.style.display = "none";
    this.isOpen = false;
  }

  destroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.overlay.removeEventListener("click", this._handleOverlayClick);
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.isOpen = false;
  }

  _init() {
    this._createOverlayStructure();
    this._attachEventListeners();
    this._createOptions();
    console.log(this.inputElements);
  }

  _createOverlayStructure() {
    // Create the backdrop
    this.overlay = document.createElement("div");
    this.overlay.id = "configOverlay";
    this.overlay.style.cssText = `
        margin: 0;
      display: none;
      position: fixed;
      flex-direction: column;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      overflow-y: auto; /* Enables vertical scrolling */
    `;

    // Create Close Button (X)
    this.closeBtn = document.createElement("button");
    this.closeBtn.innerHTML = "&times;";
    this.closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #fff;
    `;
    this.closeBtn.onclick = () => this.closeConfig();

    // Create Header
    const header = document.createElement("h2");

    header.textContent = "Configuration";
    header.style.margin = "16px";
    header.style.color = "white";
    header.style.width = "100%";

    // Create Import/Export Buttons Container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 0 16px 16px 16px;
        justify-content: center;
    `;

    // Create Import Button
    this.importBtn = document.createElement("button");
    this.importBtn.textContent = "Import";
    this.importBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #aaaaaa;
        color: black;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;
    this.importBtn.onclick = () => this._importConfig();

    // Create Export Button
    this.exportBtn = document.createElement("button");
    this.exportBtn.textContent = "Export";
    this.exportBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #aaaaaa;
        color: black;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;
    this.exportBtn.onclick = () => this._exportConfig();

    // Assemble the overlay
    this.overlay.appendChild(this.closeBtn);
    this.overlay.appendChild(header);
    this.overlay.appendChild(buttonContainer);
    buttonContainer.appendChild(this.importBtn);
    buttonContainer.appendChild(this.exportBtn);

    // Append to body
    document.body.appendChild(this.overlay);
  }

  _applyConfig(configData) {
    Object.entries(configData).forEach(([key, value]) => {
      this.inputElements[key].input.value = value;
    });
    this.apply();
  }

  _importConfig() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt,.json";
    fileInput.style.display = "none";

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const configData = JSON.parse(e.target.result);
          this._applyConfig(configData);
        } catch (err) {
          console.error("Invalid config file:", err);
          alert(
            "Failed to parse config file. Make sure it contains valid JSON.",
          );
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
      };

      reader.readAsText(file);
      document.body.removeChild(fileInput);
    };

    // 4. Append, trigger, and let onchange handle cleanup
    document.body.appendChild(fileInput);
    fileInput.click();
  }

  _exportConfig() {
    const exportObject = {};
    Object.entries(this.inputElements).forEach(([key, value]) => {
      exportObject[key] = value.input.value;
    });

    const exportJson = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "config.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  _createOptions() {
    for (const option in this.config) {
      this.createOption(
        option,
        this.config[option].inputLabel,
        this.config[option].inputType,
        this.config[option].dataType,
        this.config[option].defaultValue,
        this.config[option].selectValues,
        this.config[option].description,
      );
    }
  }

  _createInputLabel(inputLabel) {
    const lbl = document.createElement("label");
    lbl.textContent = inputLabel;
    lbl.style.fontSize = "20px";
    lbl.style.color = "white";
    lbl.style.margin = "0px 8px 0px 8px";
    return lbl;
  }

  _createInput(inputType, defaultValue, selectValues) {
    let input;

    if (inputType === "select") {
      input = document.createElement("select");
      input.style.width = "30%";
      input.style.padding = "8px";
      input.style.backgroundColor = "#aaaaaa";

      selectValues.forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val.toLowerCase();
        opt.textContent = val;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("input");
      input.value = defaultValue;
      input.type = inputType;
      input.style.width = "30%";
      input.style.backgroundColor = "#aaaaaa";
      input.style.padding = "8px";
      if (inputType === "checkbox") {
        input.checked = false;
      }
    }
    return input;
  }

  _createInputDescription(description) {
    const desc = document.createElement("p");
    desc.textContent = description;
    desc.style.width = "50%";
    desc.style.color = "#dddddd";
    desc.style.margin = "8px 0px 0px 16px";
    return desc;
  }

  _storeInputElement(input, name) {
    this.inputElements[name] = input;
  }

  _attachEventListeners() {
    // Attach the stored handler
    document.addEventListener("keydown", this.handleKeyDown);
  }

  _handleKeyDown(e) {
    const key = e.key.toLowerCase();

    if (this.isOpen) {
      if (key === "escape") {
        this.closeConfig();
      }
    } else if (!this.isOpen) {
      if (key === "escape") {
        this.openConfig();
      }
    }
  }
}
