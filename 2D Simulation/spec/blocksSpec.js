describe("blocks", () => {
    let blocks = require('../blocks.js');
    let block_object = {
        length: 1
    };
    currentConfig = {};

    beforeEach(() => {
        $ = (id) => id === "#block5" ? block_object : {
            length: 0
        };
    });

    describe("when setting their text", () => {
        let html_text = "";

        beforeEach(() => {
            block_object.html = (contents) => html_text = contents;
        });

        it("should change the HTML with the text", () => {
            let example_text = "Some example text";

            blocks.set_block_text(5, example_text);

            expect(html_text).toContain(example_text);
        });
    });

    describe("when getting their text", () => {
        let html_text = "C";

        beforeEach(() => {
            currentConfig[5] = {
                topLetter: html_text
            };
        });

        it("should return the current text", () => {
            expect(blocks.get_block_text(5)).toEqual(html_text);
        });

        describe("when using an invalid id", () => {
            it("should return an empty string", () => {
                expect(blocks.get_block_text(6)).toEqual("");
            });
        });
    });

    describe("when getting left position", () => {
        let left_pos = "43.234";

        beforeEach(() => {
            block_object.prop = (key) => key !== "style" ? {} : {
                left: left_pos + "%"
            };
        });

        it("should return the left style property", () => {
            expect(blocks.get_block_left_pos(5)).toEqual(left_pos);
        });

        describe("when using an invalid id", () => {
            it("should return an empty string", () => {
                expect(blocks.get_block_left_pos(6)).toEqual("");
            });
        });
    });

    describe("when getting top position", () => {
        let top_pos = "43.234";

        beforeEach(() => {
            block_object.prop = (key) => key !== "style" ? {} : {
                top: top_pos + "%"
            };
        });

        it("should return the top style property", () => {
            expect(blocks.get_block_top_pos(5)).toEqual(top_pos);
        });

        describe("when using an invalid id", () => {
            it("should return an empty string", () => {
                expect(blocks.get_block_top_pos(6)).toEqual("");
            });
        });
    });

    describe("when setting the block color", () => {
        let background_color = "";
        let goal_color = "green";

        beforeEach(() => {
            block_object.css = (key, value) => {
                if (key === "background-color")
                    background_color = value;
            };
        });

        it("should set the background color", () => {
            blocks.set_block_color(5, goal_color);

            expect(background_color).toEqual(goal_color);
        });
    });

    describe("when getting the block color", () => {
        let background_color = "orange";

        beforeEach(() => {
            currentConfig[5] = {
                topColor: background_color
            };
        });

        it("should return the background color", () => {
            expect(blocks.get_block_color(5)).toEqual(background_color);
        });

        describe("when using an invalid id", () => {
            it("should return the empty string", () => {
                expect(blocks.get_block_color(6)).toEqual("");
            });
        });
    });
});
