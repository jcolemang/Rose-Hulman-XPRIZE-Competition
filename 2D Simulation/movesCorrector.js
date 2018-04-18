let movesCorrector = new function () {
    let undo_action;
    let awaiting_flip_correction = false;
    let awaiting_move_correction = false;

    function run_undo_action() {
        if (undo_action === undefined) {
            return;
        }

        if (undo_action.type === "move") {
            update_gui_block(undo_action);
            update_score(undo_action);
        } else if (undo_action.type === "flip") {
            let id = undo_action.block_id.substring(5);

            flipBlock(undo_action.block_id,
                      blocks.get_block_text(id),
                      blocks.get_block_color(id),
                      currentConfig);
        }

        undo_action = undefined;
    }

    this._start_correct_action = function () {
        correctionUI.hide_corrections_modal();
        correctionUI.disable_incorrect_button();

        run_undo_action();

        blocks.display_block_ids();
    }

    this.correct_flip = function () {
        awaiting_flip_correction = true;
        this._start_correct_action();
        correctionUI.display_flip_explanation();
    };

    this.correct_move = function () {
        awaiting_move_correction = true;
        this._start_correct_action();

        correctionUI.display_move_explanation();
    };

    this.update_undo_move = function (moveData) {
        let id = Number(moveData.block_id.substring(5));

        undo_action = {
            type: "move",
            block_id: moveData.block_id,
            left: blocks.get_block_left_pos(id),
            top: blocks.get_block_top_pos(id)
        };
    };

    this.update_undo_flip = function (block_id) {
        undo_action = {
            type: "flip",
            block_id: block_id
        };
    };

    this.handle_message = function (message) {
        message = message.trim();

        if (awaiting_flip_correction) {
            handle_flip_message(message);
            return true;
        } else if (awaiting_move_correction) {
            handle_move_message(message);
            return true;
        } else {
            return false;
        }
    };

    function handle_flip_message(message) {
        let id = Number(message);

        if (message !== "" && is_valid_id(id)) {
            flipBlock("block" + id,
                      blocks.get_block_text(id),
                      blocks.get_block_color(id),
                      currentConfig);
            awaiting_flip_correction = false;
            blocks.display_block_letters();
        } else {
            correctionUI.display_flip_explanation();
        }
    }

    function handle_move_message(message) {
        let id = Number(message);
      
        if (message !== "" && is_valid_id(id)) {
            let gesture_pos = get_gesture_position();
            let move = {
                left: gesture_pos.left,
                top: gesture_pos.top,
                block_id: "block" + id
            };

            update_gui_block(move);
            hide_gesture();

            awaiting_move_correction = false;
            blocks.display_block_letters();
        } else {
            blocks.display_flip_explanation();
        }
    }

    function is_valid_id(id) {
        return id % 1 === 0 && id >= 0 && id < NumBlocks;
    }

    this.handle_ambiguity = function(currMove) {
        handling_ambiguity = true;
        move = currMove;
        display_ambiguous_move_explanation(move);
        blocks.display_block_ids();
    };

    function finish_handling_ambiguity(message) {
        let id = convert_message_to_id_num(message);

        if (message !== "" && is_valid_id(id)) {

            move.block_id = 'block' + id;

            handling_ambiguity = false;
            blocks.display_block_letters();

            if (move.type == 'ambiguous_move') {
                move.type = 'move';
                update_position(move);
            } else if (move.type == 'ambiguous_flip') {
                move.type = 'flip';
                update_flip_block(move.block_id);
            }
        } else {
            display_ambiguous_move_explanation(move);
        }
    };
};
