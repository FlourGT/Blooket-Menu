const gui = document.createElement("div");
Object.assign(gui.style, {
    position: "fixed",
    top: "50px",
    left: "50px",
    width: "800px",
    height: "500px",
    background: "#0A0A13",
    color: "#FFFFFF",
    borderRadius: "10px",
    zIndex: "10000",
    padding: "20px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
});
document.body.appendChild(gui);

const sidebar = document.createElement("div");
Object.assign(sidebar.style, {
    position: "absolute",
    left: "0",
    top: "0",
    width: "150px",
    height: "100%",
    background: "#151529",
    padding: "10px",
    overflowY: "auto"
});
gui.appendChild(sidebar);

const addSidebarButton = (name, onClick) => {
    const button = document.createElement("button");
    button.innerText = name;
    Object.assign(button.style, {
        width: "100%",
        padding: "10px",
        background: "#4F4789",
        color: "white",
        border: "none",
        cursor: "pointer",
        marginBottom: "5px",
    });
    button.onclick = onClick;
    sidebar.appendChild(button);
};
addSidebarButton("📜 Global", () => showCheatCategory("global"));
addSidebarButton("🏆 Gold Mode", () => showCheatCategory("gold"));
addSidebarButton("🏴‍☠️ Pirate", () => showCheatCategory("pirate"));

const autoAnswer = {
    name: "Auto Answer",
    enabled: false,
    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.interval = setInterval(() => {
                let stateNode = getStateNode();
                let question = stateNode?.state?.question;
                if (question) {
                    let correct = question.correctAnswers[0];
                    let answers = document.querySelectorAll("[class*='answerContainer']");
                    answers.forEach(answer => {
                        if (answer.innerText.includes(correct)) answer.click();
                    });
                }
            }, 100);
        } else {
            clearInterval(this.interval);
        }
    }
};

const tripleGold = {
    name: "Always Triple Gold",
    enabled: false,
    toggle() {
        let stateNode = getStateNode();
        if (!stateNode) return;
        
        this.enabled = !this.enabled;
        stateNode.choosePrize = (index) => {
            stateNode.state.choices[index] = {
                type: "multiply",
                val: 3,
                text: "Triple Gold!",
                blook: "Unicorn"
            };
        };
    }
};

const setGold = (goldAmount) => {
    let stateNode = getStateNode();
    stateNode.setState({ gold: goldAmount, gold2: goldAmount });
    stateNode.props.liveGameController.setVal({
        path: `c/${stateNode.props.client.name}/g`,
        val: goldAmount,
    });
};

const setDoubloons = (amount) => {
    let stateNode = getStateNode();
    stateNode.setState({ doubloons: amount });
    stateNode.props.liveGameController.setVal({
        path: `c/${stateNode.props.client.name}/d`,
        val: amount,
    });
};

const cheats = {
    "global": [autoAnswer],
    "gold": [tripleGold, setGold],
    "pirate": [setDoubloons]
};

function showCheatCategory(category) {
    gui.innerHTML = "";
    cheats[category].forEach(cheat => {
        const button = document.createElement("button");
        button.innerText = cheat.name;
        button.onclick = () => cheat.toggle();
        gui.appendChild(button);
    });
}

function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    element.addEventListener("mousedown", (event) => {
        isDragging = true;
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        element.style.opacity = "0.8";  
    });

    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        element.style.left = `${event.clientX - offsetX}px`;
        element.style.top = `${event.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.opacity = "1";
    });
}
makeDraggable(gui);

const maximizeButton = document.createElement("button");
maximizeButton.innerText = "⬜"; 
Object.assign(maximizeButton.style, {
    position: "fixed",
    bottom: "10px",
    left: "10px",
    width: "50px",
    height: "50px",
    background: "#00A2FF",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "22px",
    borderRadius: "10px",
    display: "none", 
    zIndex: "99999"
});

maximizeButton.onclick = () => {
    gui.style.display = "block";
    maximizeButton.style.display = "none";
};

document.body.appendChild(maximizeButton);

const settingsButton = document.createElement("button");
settingsButton.innerText = "⚙";
Object.assign(settingsButton.style, {
    position: "absolute",
    top: "5px",
    right: "65px",
    width: "30px",
    height: "30px",
    background: "#FFD700",
    color: "black",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    borderRadius: "5px"
});

const settingsMenu = document.createElement("div");
Object.assign(settingsMenu.style, {
    position: "fixed",
    top: "50px",
    left: "50px",
    width: "250px",
    height: "200px",
    background: "#151529",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    zIndex: "99999",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
    display: "none"
});

const bgColorLabel = document.createElement("label");
bgColorLabel.innerText = "Background Color:";
const bgColorInput = document.createElement("input");
bgColorInput.type = "color";
bgColorInput.value = "#0A0A13";
bgColorInput.oninput = () => {
    gui.style.background = bgColorInput.value;
    localStorage.setItem("menuBgColor", bgColorInput.value);
};

const textColorLabel = document.createElement("label");
textColorLabel.innerText = "Text Color:";
const textColorInput = document.createElement("input");
textColorInput.type = "color";
textColorInput.value = "#FFFFFF";
textColorInput.oninput = () => {
    gui.style.color = textColorInput.value;
    localStorage.setItem("menuTextColor", textColorInput.value);
};

const resetPositionButton = document.createElement("button");
resetPositionButton.innerText = "Reset Position";
Object.assign(resetPositionButton.style, {
    width: "100%",
    marginTop: "10px",
    background: "#4F4789",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "8px"
});
resetPositionButton.onclick = () => {
    gui.style.top = "50px";
    gui.style.left = "50px";
    localStorage.setItem("menuTop", "50px");
    localStorage.setItem("menuLeft", "50px");
};

settingsMenu.appendChild(bgColorLabel);
settingsMenu.appendChild(bgColorInput);
settingsMenu.appendChild(document.createElement("br"));

settingsMenu.appendChild(textColorLabel);
settingsMenu.appendChild(textColorInput);
settingsMenu.appendChild(document.createElement("br"));

settingsMenu.appendChild(resetPositionButton);

settingsButton.onclick = () => {
    settingsMenu.style.display = settingsMenu.style.display === "none" ? "block" : "none";
};

gui.appendChild(settingsButton);
document.body.appendChild(settingsMenu);
