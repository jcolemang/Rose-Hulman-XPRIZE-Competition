describe("movesTracker", () => {
    let imported = require('../movesTracker.js');

    let MovesTracker = imported.MovesTracker;
    let _Gesture = imported._Gesture;
    let _Instruction = imported._Instruction;
    let _Flip = imported._Flip;
    let _Move = imported._Move;

    let movesTracker;

    beforeEach(() => {
        movesTracker = new MovesTracker();

        getDateTime = jasmine.createSpy("getDateTime");
    });

    describe("when exporting gestures", () => {
        // getDateTime returns a string, therefore:
        let current_date = "<now>";
        let left = 49;
        let top = 33;

        let string;

        beforeEach(() => {
            getDateTime.and.returnValue(current_date);

            let gesture = new _Gesture(left, top);
            string = gesture.export_to_string();
        });

        it("should have the proper formatting", () => {
            expect(string).toEqual("Gesture " + current_date
                                   + " (" + left + "," + top + ")");
        });
    });

    describe("when exporting instructions", () => {
        // getDateTime returns a string, therefore:
        let current_date = "<now>";
        let text = "Hello world!";

        let string;

        beforeEach(() => {
            getDateTime.and.returnValue(current_date);

            let instruction = new _Instruction(text);
            string = instruction.export_to_string();
        });

        it("should have the proper formating", () => {
            expect(string).toEqual("Instruction "
                                   + current_date + " "
                                   + text);
        });
    });

    describe("when exporting flips", () => {
        let id = 5;
        let letter = "A";
        let color = "green";
        let current_date = "<now>";
        let left = 41;
        let top = 32;

        let string;

        beforeEach(() => {
            getDateTime.and.returnValue(current_date);

            let flip = new _Flip(id, letter, color, left, top);
            string = flip.export_to_string();
        });

        it("should have the proper formatting", () => {
            expect(string).toEqual("Flip Block id: " + id
                                   + " Letter: " + letter
                                   + " Color: " + color
                                   + " " + current_date
                                   + " (" + left + "," + top + ")");
        });
    });

    describe("when exporting moves", () => {
        let id = 5;
        let letter = "A";
        let color = "green";
        let current_date = "<now>";
        let left = 41;
        let top = 32;
        let end_left = 67;
        let end_top = 35;

        let string;

        beforeEach(() => {
            getDateTime.and.returnValue(current_date);

            let move = new _Move(id, letter, color, left, top,
                                 end_left, end_top);
            string = move.export_to_string();
        });

        it("should have the proper formatting", () => {
            expect(string).toEqual("Movement Block id: " + id
                                   + " Letter: " + letter
                                   + " Color: " + color
                                   + " " + current_date
                                   + " (" + left + "," + top + ")"
                                   + " ("+ end_left + "," + end_top +")");
        });
    });

    describe("when adding a gesture", () => {
        let left = 5;
        let top = 23;

        describe("when there are currently no other stored actions", () => {
            beforeEach(() => {
                movesTracker.add_gesture(left, top);
            });

            it("should store the new gesture", () => {
                expect(movesTracker.actions.length).toEqual(1);
            });

            it("should create a new gesture with the given parameters", () => {
                expect(movesTracker.actions[0].left_pos).toEqual(left);
                expect(movesTracker.actions[0].top_pos).toEqual(top);
            });
        });

        describe("when there are already stored actions", () => {
            let mock_action = {
                id: "Fake action"
            };

            beforeEach(() => {
                movesTracker.actions = [mock_action];

                movesTracker.add_gesture(left, top);
            });

            it("should keep all actions and add the new gesture", () => {
                expect(movesTracker.actions.length).toEqual(2);
            });

            it("should keep add the new gesture to the end of the list", () => {
                expect(movesTracker.actions[0]).toEqual(mock_action);
            });

            it("should create a new gesture with the given parameters", () => {
                expect(movesTracker.actions[1].left_pos).toEqual(left);
                expect(movesTracker.actions[1].top_pos).toEqual(top);
            });
        });
    });

    describe("when adding an instruction", () => {
        let text = "my text";

        describe("when there are currently no other stored actions", () => {
            beforeEach(() => {
                movesTracker.add_instruction(text);
            });

            it("should store the new instruction", () => {
                expect(movesTracker.actions.length).toEqual(1);
            });

            it("should create a new instruction with the given parameters", () => {
                expect(movesTracker.actions[0].text).toEqual(text);
            });
        });

        describe("when there are already stored actions", () => {
            let mock_action = {
                id: "Fake action"
            };

            beforeEach(() => {
                movesTracker.actions = [mock_action];

                movesTracker.add_instruction(text);
            });

            it("should keep all actions and add the new gesture", () => {
                expect(movesTracker.actions.length).toEqual(2);
            });

            it("should keep add the new gesture to the end of the list", () => {
                expect(movesTracker.actions[0]).toEqual(mock_action);
            });

            it("should create a new gesture with the given parameters", () => {
                expect(movesTracker.actions[1].text).toEqual(text);
            });
        });
    });

    describe("when adding a flip", () => {
        let id = "block5";
        let letter = "A";
        let color = "green";
        let x = 51;
        let y = 22;

        describe("when there are currently no other stored actions", () => {
            beforeEach(() => {
                movesTracker.add_flip(id, letter, color, x, y);
            });

            it("should store the new instruction", () => {
                expect(movesTracker.actions.length).toEqual(1);
            });

            it("should create a new instruction with the given parameters", () => {
                expect(movesTracker.actions[0].id).toEqual(id);
                expect(movesTracker.actions[0].letter).toEqual(letter);
                expect(movesTracker.actions[0].color).toEqual(color);
                expect(movesTracker.actions[0].left_pos).toEqual(x);
                expect(movesTracker.actions[0].top_pos).toEqual(y);
            });
        });

        describe("when there are already stored actions", () => {
            let mock_action = {
                id: "Fake action"
            };

            beforeEach(() => {
                movesTracker.actions = [mock_action];

                movesTracker.add_flip(id, letter, color, x, y);
            });

            it("should keep all actions and add the new gesture", () => {
                expect(movesTracker.actions.length).toEqual(2);
            });

            it("should keep add the new gesture to the end of the list", () => {
                expect(movesTracker.actions[0]).toEqual(mock_action);
            });

            it("should create a new gesture with the given parameters", () => {
                expect(movesTracker.actions[1].id).toEqual(id);
                expect(movesTracker.actions[1].letter).toEqual(letter);
                expect(movesTracker.actions[1].color).toEqual(color);
                expect(movesTracker.actions[1].left_pos).toEqual(x);
                expect(movesTracker.actions[1].top_pos).toEqual(y);
            });
        });
    });

    describe("when adding a move", () => {
        let id = "block5";
        let letter = "A";
        let color = "green";
        let init_x = 51;
        let init_y = 22;
        let end_x = 51;
        let end_y = 22;

        describe("when there are currently no other stored actions", () => {
            beforeEach(() => {
                movesTracker.add_move(id, letter, color, init_x, init_y, end_x, end_y);
            });

            it("should store the new instruction", () => {
                expect(movesTracker.actions.length).toEqual(1);
            });

            it("should create a new instruction with the given parameters", () => {
                expect(movesTracker.actions[0].id).toEqual(id);
                expect(movesTracker.actions[0].letter).toEqual(letter);
                expect(movesTracker.actions[0].color).toEqual(color);
                expect(movesTracker.actions[0].left_pos).toEqual(init_x);
                expect(movesTracker.actions[0].top_pos).toEqual(init_y);
                expect(movesTracker.actions[0].new_left_pos).toEqual(end_x);
                expect(movesTracker.actions[0].new_top_pos).toEqual(end_y);
            });
        });

        describe("when there are already stored actions", () => {
            let mock_action = {
                id: "Fake action"
            };

            beforeEach(() => {
                movesTracker.actions = [mock_action];

                movesTracker.add_move(id, letter, color, init_x, init_y, end_x, end_y);
            });

            it("should keep all actions and add the new gesture", () => {
                expect(movesTracker.actions.length).toEqual(2);
            });

            it("should keep add the new gesture to the end of the list", () => {
                expect(movesTracker.actions[0]).toEqual(mock_action);
            });

            it("should create a new gesture with the given parameters", () => {
                expect(movesTracker.actions[1].id).toEqual(id);
                expect(movesTracker.actions[1].letter).toEqual(letter);
                expect(movesTracker.actions[1].color).toEqual(color);
                expect(movesTracker.actions[1].left_pos).toEqual(init_x);
                expect(movesTracker.actions[1].top_pos).toEqual(init_y);
                expect(movesTracker.actions[1].new_left_pos).toEqual(end_x);
                expect(movesTracker.actions[1].new_top_pos).toEqual(end_y);
            });
        });
    });

    describe("when exporting all actions", () => {
        describe("when there are no actions to export", () => {
            it("should return an empty list", () => {
                expect(movesTracker.export_actions()).toEqual([]);
            });
        });

        describe("when there are some actions to export", () => {
            let exported_actions;

            beforeEach(() => {
                for (let i = 5; i >= 0; i--) {
                    movesTracker.actions.push({
                        export_to_string: () => i
                    });
                }

                exported_actions = movesTracker.export_actions();
            });

            it("should export all stored actions in the correct order", () => {
                expect(exported_actions).toEqual([5, 4, 3, 2, 1, 0]);
            });
        });
    });

    describe("when adding and exporting actions", () => {
        let gesture_data = {
            left: 51,
            top: 52,
            time: "<g now>"
        };
        let flip_data = {
            id: "block5",
            letter: "A",
            color: "green",
            x: 39,
            y: 55,
            time: "<f now>"
        };
        let instruction_data = {
            text: "sample",
            time: "<i now>"
        };

        let exported_gesture;
        let exported_flip;
        let exported_instruction;

        beforeEach(() => {
            getDateTime.and.returnValues(gesture_data.time,
                                         flip_data.time,
                                         instruction_data.time);

            movesTracker.add_gesture(gesture_data.left, gesture_data.top);
            movesTracker.add_flip(flip_data.id, flip_data.letter, flip_data.color,
                                    flip_data.x, flip_data.y);
            movesTracker.add_instruction(instruction_data.text);

            [exported_gesture, exported_flip, exported_instruction]
                = movesTracker.export_actions();
        });

        it("should export all actions correctly", () => {
            expect(exported_gesture).toEqual("Gesture " + gesture_data.time
                                             + " (" + gesture_data.left + ","
                                             + gesture_data.top + ")");
            expect(exported_flip).toEqual("Flip Block id: " + flip_data.id
                                          + " Letter: " + flip_data.letter
                                          + " Color: " + flip_data.color + " "
                                          + flip_data.time
                                          + " (" + flip_data.x + ","
                                          + flip_data.y + ")");
            expect(exported_instruction).toEqual("Instruction "
                                                 + instruction_data.time
                                                 + " " + instruction_data.text);
        });
    });
});
