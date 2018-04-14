function getInitialConfiguration(possibleColors, possibleLetters, numBlocks) {
    let topColors = makeColorsArray(possibleColors, numBlocks);
    let bottomColors = makeColorsArray(possibleColors, numBlocks);
    let topLetters = makeLettersArray(possibleLetters, numBlocks);
    let bottomLetters = makeLettersArray(possibleLetters, numBlocks);

    let config = [];
    for (i = 0; i < numBlocks; i++) {
        let block = {
            topLetter: topLetters[i],
            bottomLetter: bottomLetters[i],
            topColor: topColors[i],
            bottomColor: bottomColors[i],
            blockId: '#block' + i
        };
        config.push(block);
    }

    return config;
}

function makeColorsArray(possibleColors, numBlocks) {
    let colors = [];
    for (let i = 0; i < numBlocks; i++) {
        rand = Math.floor(Math.random() * possibleColors.length);
        colors.push(possibleColors[rand]);
    }
    return colors;
}

function makeLettersArray(possibleLetters, numBlocks) {
    let letters = [];
    for (var i = 0; i < numBlocks; i++) {
        y = Math.floor(Math.random() * possibleLetters.length);
        letters.push(possibleLetters[y]);
    }
    return letters;
}

function getFinalConfiguration(initialConfiguration) {
    return initialConfiguration.map(block => {
        let newBlock = Object.assign({}, block);

        if (Math.random() < 0.5) {
            let tempColor = newBlock.topColor;
            let tempLetter = newBlock.topLetter;
            newBlock.topLetter = newBlock.bottomLetter;
            newBlock.topColor = newBlock.bottomColor;
            newBlock.bottomLetter = tempLetter;
            newBlock.bottomColor = tempColor;
        }

        newBlock.position = [Math.random() * 100, Math.random() * 100];

        return newBlock;
    });
}

let possibleLetters = ["A", "B", "C", "D", "E", "F", "G"];
let possibleColors = ['red', 'blue','green','orange','yellow'];

initTaskID();
currentConfig = getInitialConfiguration(possibleColors, possibleLetters, NumBlocks);

initBlocks(currentConfig);
writeBlockStyles(currentConfig);
finalBlocks = getFinalConfiguration(currentConfig);

setTaskHeader();
popUpGameIntro();

function initBlocks(config) {
    let bColors = config.map(x => x.topColor);
    let flipColors = config.map(x => x.bottomColor);
    let bLetters = config.map(x => x.topLetter);
    let flipLtrs = config.map(x => x.bottomLetter);

    var container = document.createElement("div");
    container.id = "container";
    container.ondblclick = function(e) {
        var event = e || window.event;

        setGestureWithPosition(event.clientX, event.clientY, event);
    };
    container.style.fontSize = "4vmin";
    document.body.appendChild(container);
    var position_x = [];
    var position_y = [];
    var cur = 0;
    for (var i = 0; i < NumBlocks; i++) {
        var color_x = bColors[i];
        var l = Math.floor(Math.random() * bLetters.length);

        let horizNum = document.getElementById('container').getBoundingClientRect().right - 50 - 8 - 4 - 4;
        let horizDenom = document.getElementById('container').getBoundingClientRect().right * 100;
        var horizontal_percent = horizNum / horizDenom;

        let vertNum = document.getElementById('container').getBoundingClientRect().bottom - 50 - 8 - 4 - 4;
        let vertDenom = document.getElementById('container').getBoundingClientRect().bottom * 100;
        var vertical_percent = vertNum / vertDenom;

        let tLeft = Math.random() * Math.floor(horizontal_percent);
        let tTop = Math.random() * Math.floor(vertical_percent);

        if (i < bLetters.length) {
            l = i;
        }

        $("#container").append("<div class = \"block\" id =\"block"+i+"\" style=\"left: " + tLeft + "%; top: " + tTop + "%; background-color: " + color_x + "\"></div>");

        blocks.set_block_text(i, bLetters[l]);

        standard_info.push("block:" + i + " " + "standard position: (" + tLeft + "%, " + tTop + "%) color: " + color_x + " letters: " + bLetters[l] + " flipletters: " + flipLtrs[l]);
        goal_top.push(tTop);
        goal_left.push(tLeft);

        $("#block" + i).data("id", i);
        $("#block" + i).data("horizontal_percent", tLeft);
        $("#block" + i).data("vertical_percent", tTop);
    }
}
